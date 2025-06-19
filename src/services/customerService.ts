import { supabase } from "../lib/supabaseClient";
import { Customer, BirthdayStatus } from "../types";
import { getOrdersByCustomer } from "./orderService";
import { toast } from "sonner";

export const getCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase.from("customers").select("*");

  if (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }

  return data || [];
};

export const createCustomer = async (
  customer: Omit<Customer, "customer_id" | "created_at">
): Promise<Customer> => {
  const { data, error } = await supabase
    .from("customers")
    .insert(customer)
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
): Promise<Customer> => {
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

  if (error) {
    if (error.code === "PGRST116") {
      // No rows found
      return null;
    }
    console.error("Error fetching customer by WhatsApp:", error);
    throw error;
  }

  return data;
};

export const getBirthdayCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase.rpc("get_birthday_customers");

  if (error) {
    console.error("Error fetching birthday customers:", error);
    throw error;
  }

  return data || [];
};

export const getCustomerDetails = async (customerId: string) => {
  try {
    // Busca os dados básicos do cliente
    const { data: customerData, error: customerError } = await supabase
      .from("customers")
      .select("*")
      .eq("customer_id", customerId)
      .single();

    if (customerError) {
      toast.error("Erro ao carregar dados do cliente");
      throw customerError;
    }

    // Busca os pedidos do cliente
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

    // Análise de produtos favoritos
    const productCount: Record<string, number> = {};
    orders.forEach((order) => {
      order.order_items.forEach((item) => {
        const productName = item.name;
        productCount[productName] =
          (productCount[productName] || 0) + item.quantity;
      });
    });

    const favoriteProducts = Object.entries(productCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([product, quantity]) => ({ product, quantity }));

    // Análise de horários favoritos
    const hourCount: Record<number, number> = {};
    orders.forEach((order) => {
      const date = new Date(order.created_at);
      const hour = date.getHours();
      hourCount[hour] = (hourCount[hour] || 0) + 1;
    });

    const favoriteHours = Object.entries(hourCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    // Calcula o ticket médio
    const averageTicket = totalOrders > 0 ? totalSpent / totalOrders : 0;

    // Retorna os dados completos
    return {
      customer: customerData,
      totalOrders,
      totalSpent,
      averageTicket,
      favoriteDays,
      favoriteProducts,
      favoriteHours,
      lastOrder: orders[0] || null,
      recentOrders: orders.slice(0, 5),
      orderFrequency:
        totalOrders > 0
          ? (Date.now() -
              new Date(orders[orders.length - 1].created_at).getTime()) /
            (totalOrders * 86400000)
          : 0, // Média de dias entre pedidos
    };
  } catch (error) {
    console.error("Erro ao carregar detalhes do cliente:", error);
    toast.error("Erro ao carregar detalhes do cliente");
    throw error;
  }
};

export const getCustomerById = async (
  customerId: string
): Promise<Customer | null> => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("customer_id", customerId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows found
      return null;
    }
    console.error("Error fetching customer by ID:", error);
    throw error;
  }

  return data;
};

// Aliases para compatibilidade
export const addCustomer = createCustomer;
export const updateCustomerGiftStatus = updateCustomerBirthdayStatus;
export const updateBirthdayStatus = updateCustomerBirthdayStatus;
