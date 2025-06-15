import { supabase } from "../lib/supabaseClient";
import { Order, Customer, BirthdayStatus, MenuItem } from "../types";

// Função para normalizar strings, garantindo correspondência insensível a maiúsculas/minúsculas
const normalizeString = (str: string | undefined | null): string => {
  if (typeof str !== "string") return "";
  return str.trim().toLowerCase();
};

export const getOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      customer:customers ( name ),
      address:addresses ( street, number, city )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }

  return (
    data?.map((order: any) => ({
      ...order,
      customerName: order.customer?.name || "Cliente Anônimo",
    })) || []
  );
};

export const getCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }

  return data || [];
};

export const createOrder = async (
  order: Omit<Order, "order_id" | "created_at">
) => {
  const { data, error } = await supabase
    .from("orders")
    .insert([order])
    .select()
    .single();

  if (error) {
    console.error("Error creating order:", error);
    throw error;
  }

  return data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("order_id", orderId)
    .select()
    .single();

  if (error) {
    console.error("Error updating order status:", error);
    throw error;
  }

  return data;
};

export const getMenuItems = async () => {
  const { data, error } = await supabase.from("menu_items").select("*");

  if (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }

  return data || [];
};

export const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .gte("created_at", todayStr);

  if (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }

  if (!orders)
    return { totalOrders: 0, revenue: 0, activeOrders: 0, completedOrders: 0 };

  const stats = {
    totalOrders: orders.length,
    revenue: orders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
    activeOrders: orders.filter((order) =>
      ["pending", "confirmed", "preparing", "out_for_delivery"].includes(
        order.status
      )
    ).length,
    completedOrders: orders.filter((order) =>
      ["delivered", "completed"].includes(order.status)
    ).length,
  };

  return stats;
};

export const getSalesByCategory = async () => {
  try {
    console.log("getSalesByCategory: Iniciando busca de dados...");

    // Buscar pedidos com status de completados ou entregues
    const [ordersData, menuItemsData] = await Promise.all([
      supabase
        .from("orders")
        .select("order_items, status")
        .in("status", ["completed", "delivered"]),
      supabase.from("menu_items").select("name, category"),
    ]);

    console.log("getSalesByCategory: Resposta orders:", ordersData);
    console.log("getSalesByCategory: Resposta menu items:", menuItemsData);

    if (ordersData.error) {
      console.error("Erro ao buscar pedidos:", ordersData.error);
      throw ordersData.error;
    }

    if (menuItemsData.error) {
      console.error("Erro ao buscar itens do menu:", menuItemsData.error);
      throw menuItemsData.error;
    }

    const orders = ordersData.data || [];
    const menuItems = menuItemsData.data || [];

    console.log("getSalesByCategory: Total de pedidos:", orders.length);
    console.log(
      "getSalesByCategory: Total de itens do menu:",
      menuItems.length
    );

    // Criar mapa de categorias
    const categoryMap = new Map<string, string>();
    menuItems.forEach((item) => {
      if (item.name && item.category) {
        categoryMap.set(normalizeString(item.name), item.category);
      }
    });

    console.log(
      "getSalesByCategory: Mapa de categorias criado com",
      categoryMap.size,
      "itens"
    );

    const sales: Record<string, number> = {};
    let processedItems = 0;
    const unmappedItems: string[] = [];

    // Processar pedidos
    orders.forEach((order) => {
      let orderItems = order.order_items;

      // Se order_items for uma string JSON, fazer o parse
      if (typeof orderItems === "string") {
        try {
          orderItems = JSON.parse(orderItems);
        } catch (e) {
          console.warn("Erro ao fazer parse de order_items:", e, order);
          return;
        }
      }

      if (!orderItems || !Array.isArray(orderItems)) {
        console.warn("Pedido sem itens ou formato inválido:", order);
        return;
      }

      orderItems.forEach((item: any) => {
        // Tenta diferentes variações de nomes de campos
        const itemName =
          item.item_name || item.name || item.item || item.product_name;

        if (!itemName) {
          console.warn("Item sem nome encontrado:", item);
          return;
        }

        const quantity = item.quantity || 0;
        const price = item.price || 0;
        const saleAmount = quantity * price;

        if (saleAmount <= 0) {
          console.warn("Item com valor inválido:", {
            itemName,
            quantity,
            price,
          });
          return;
        }

        const normalizedItemName = normalizeString(itemName);
        let category = categoryMap.get(normalizedItemName);

        // Se não encontrar categoria, tenta categorizar por palavras-chave
        if (!category) {
          unmappedItems.push(itemName);

          const lowerName = itemName.toLowerCase();
          if (
            lowerName.includes("burger") ||
            lowerName.includes("smash") ||
            lowerName.includes("red")
          ) {
            category = "Lanches";
          } else if (
            lowerName.includes("batata") ||
            lowerName.includes("frita") ||
            lowerName.includes("porção")
          ) {
            category = "Acompanhamentos";
          } else if (
            lowerName.includes("coca") ||
            lowerName.includes("refrigerante") ||
            lowerName.includes("suco") ||
            lowerName.includes("água")
          ) {
            category = "Bebidas";
          } else if (
            lowerName.includes("sobremesa") ||
            lowerName.includes("doce")
          ) {
            category = "Sobremesas";
          } else {
            category = "Outros";
          }
        }

        sales[category] = (sales[category] || 0) + saleAmount;
        processedItems++;
      });
    });

    console.log("getSalesByCategory: Itens processados:", processedItems);
    if (unmappedItems.length > 0) {
      console.log("getSalesByCategory: Itens não mapeados:", unmappedItems);
    }
    console.log("getSalesByCategory: Vendas por categoria:", sales);

    // Se não houver dados, retorna categorias padrão com valor zero
    if (Object.keys(sales).length === 0) {
      console.log(
        "getSalesByCategory: Nenhuma venda encontrada, retornando categorias padrão"
      );
      return [
        { category: "Lanches", amount: 0 },
        { category: "Bebidas", amount: 0 },
        { category: "Acompanhamentos", amount: 0 },
        { category: "Sobremesas", amount: 0 },
      ];
    }

    const result = Object.entries(sales)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);

    console.log("getSalesByCategory: Resultado final:", result);

    return result;
  } catch (error) {
    console.error("Error calculating sales by category:", error);
    // Retorna array vazio em caso de erro
    return [];
  }
};

export const getActiveCustomers = async (days = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const aMonthAgo = date.toISOString();

  const { data, error } = await supabase
    .from("orders")
    .select("customer_id")
    .gte("created_at", aMonthAgo)
    .not("customer_id", "is", null);

  if (error) {
    console.error("Error fetching active customers:", error);
    throw error;
  }

  if (!data) return 0;

  const uniqueCustomers = new Set(data.map((order) => order.customer_id));
  return uniqueCustomers.size;
};

export const getRevenueGrowth = async () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const [currentWeekData, previousWeekData] = await Promise.all([
    supabase
      .from("orders")
      .select("total_amount")
      .gte("created_at", lastWeek.toISOString())
      .lt("created_at", today.toISOString()),
    supabase
      .from("orders")
      .select("total_amount")
      .gte("created_at", twoWeeksAgo.toISOString())
      .lt("created_at", lastWeek.toISOString()),
  ]);

  if (currentWeekData.error) throw currentWeekData.error;
  if (previousWeekData.error) throw previousWeekData.error;

  const currentRevenue =
    currentWeekData.data?.reduce(
      (sum, order) => sum + (order.total_amount || 0),
      0
    ) || 0;
  const previousRevenue =
    previousWeekData.data?.reduce(
      (sum, order) => sum + (order.total_amount || 0),
      0
    ) || 0;

  if (previousRevenue === 0) return 0;

  const growth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  return growth;
};

export const createCustomer = async (
  customer: Omit<Customer, "customer_id" | "created_at">
) => {
  const { data, error } = await supabase
    .from("customers")
    .insert([customer])
    .select()
    .single();

  if (error) {
    console.error("Error creating customer:", error);
    throw error;
  }

  return data;
};

export const updateCustomerBirthdayStatus = async (
  customerId: string,
  status: BirthdayStatus
) => {
  const { data, error } = await supabase
    .from("customers")
    .update({ birthday_status: status })
    .eq("customer_id", customerId)
    .select()
    .single();

  if (error) {
    console.error("Error updating customer birthday status:", error);
    throw error;
  }

  return data;
};

export const getCustomerByWhatsapp = async (
  whatsapp: string
): Promise<Customer | null> => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("whatsapp", whatsapp)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching customer by WhatsApp:", error);
    throw error;
  }

  return data || null;
};

export const getOrdersByCustomer = async (
  customerId: string
): Promise<Order[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      customer:customers ( name ),
      address:addresses ( street, number, city )
    `
    )
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders by customer:", error);
    throw error;
  }

  return data || [];
};

// Função para adicionar um novo item ao menu
export const addMenuItem = async (
  menuItem: Omit<MenuItem, "id" | "created_at">
) => {
  const { data, error } = await supabase
    .from("menu_items")
    .insert([menuItem])
    .select()
    .single();

  if (error) {
    console.error("Error adding menu item:", error);
    throw error;
  }

  return data;
};

// Função para atualizar um item do menu
export const updateMenuItem = async (
  id: string,
  updates: Partial<MenuItem>
) => {
  const { data, error } = await supabase
    .from("menu_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating menu item:", error);
    throw error;
  }

  return data;
};

// Função para deletar um item do menu
export const deleteMenuItem = async (id: string) => {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);

  if (error) {
    console.error("Error deleting menu item:", error);
    throw error;
  }
};

// Alias para compatibilidade
export const addCustomer = createCustomer;

// Função para atualizar status de presente do cliente (alias para compatibilidade)
export const updateCustomerGiftStatus = updateCustomerBirthdayStatus;

// Função para atualizar status de aniversário (alias)
export const updateBirthdayStatus = updateCustomerBirthdayStatus;

// Função para obter clientes com aniversário
export const getBirthdayCustomers = async () => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .not("birthday", "is", null)
    .order("birthday", { ascending: true });

  if (error) {
    console.error("Error fetching birthday customers:", error);
    throw error;
  }

  return data || [];
};

// Função para obter detalhes do cliente
export const getCustomerDetails = async (customerId: string) => {
  const orders = await getOrdersByCustomer(customerId);

  const totalOrders = orders.length;
  const totalSpent = orders.reduce(
    (sum, order) => sum + (order.total_amount || 0),
    0
  );

  // Análise de dias favoritos
  const dayCount: Record<string, number> = {};
  orders.forEach((order) => {
    const date = new Date(order.created_at);
    const dayName = date.toLocaleDateString("pt-BR", { weekday: "long" });
    dayCount[dayName] = (dayCount[dayName] || 0) + 1;
  });

  const favoriteDays = Object.entries(dayCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([day]) => day);

  return {
    totalOrders,
    totalSpent,
    favoriteDays,
  };
};
