import { supabase } from "../lib/supabaseClient";
import { Order } from "../types";
import { toast } from "sonner";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type OrderStatus = Order["status"];

// Função auxiliar para tratamento de erros
const handleError = (error: unknown, message: string): never => {
  const errorMessage =
    error instanceof Error ? error.message : "Erro desconhecido";
  toast.error(`${message}: ${errorMessage}`);
  throw new Error(errorMessage);
};

// Função auxiliar para formatar dados do pedido
const formatOrderData = (order: any): Order => {
  const customer = order.customers;
  const delivery_address = order.addresses;

  // Normaliza os itens do pedido para garantir consistência
  const normalizedOrderItems = Array.isArray(order.order_items)
    ? order.order_items.map((item: any) => ({
        name:
          item.menu_items?.name ||
          item.name ||
          item.item_name ||
          item.item ||
          "Item não especificado",
        price:
          typeof item.menu_items?.price === "number"
            ? item.menu_items.price
            : typeof item.price === "number"
            ? item.price
            : 0,
        quantity: typeof item.quantity === "number" ? item.quantity : 1,
      }))
    : [];

  return {
    order_id: order.order_id,
    customer_id: order.customer_id || null,
    delivery_address_id: delivery_address?.address_id || null,
    order_items: normalizedOrderItems,
    order_type: order.order_type,
    status: order.status,
    subtotal_amount:
      typeof order.subtotal_amount === "number"
        ? order.subtotal_amount
        : order.total_amount,
    shipping_cost:
      typeof order.shipping_cost === "number" ? order.shipping_cost : 0,
    total_amount: order.total_amount,
    pending_reminder_sent: order.pending_reminder_sent ?? false,
    created_at: order.created_at,
    last_updated_at: order.last_updated_at ?? order.created_at,
    customerName: customer?.name || "Pedido #" + order.order_id.slice(-4),
  };
};

const ORDER_SELECT_QUERY = `
  *,
  customers(*),
  addresses(*)
`;

const ORDER_ITEMS_SELECT_QUERY = `
  *,
  order_items (
    quantity,
    menu_items (
      name,
      price
    )
  ),
  customers(*),
  addresses(*)
`;

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT_QUERY)
    .order("created_at", { ascending: false });

  if (error) {
    handleError(error, "Erro ao carregar pedidos");
  }

  return data?.map(formatOrderData) || [];
}

export async function getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT_QUERY)
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) {
    handleError(error, "Erro ao carregar pedidos");
  }

  return data?.map(formatOrderData) || [];
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .update({ status, last_updated_at: new Date().toISOString() })
    .eq("order_id", orderId)
    .select(ORDER_SELECT_QUERY)
    .single();

  if (error) {
    handleError(error, "Erro ao atualizar status do pedido");
  }

  if (!data) {
    throw new Error("Pedido não encontrado ou erro ao atualizar.");
  }

  return formatOrderData(data);
}

export const createOrder = async (
  orderData: Omit<Order, "order_id" | "created_at" | "customer_name">
): Promise<Order> => {
  const { data, error } = await supabase
    .from("orders")
    .insert([orderData])
    .select(ORDER_ITEMS_SELECT_QUERY)
    .single();

  if (error) {
    handleError(error, "Erro ao criar pedido");
  }
  if (!data) {
    throw new Error("Erro ao criar pedido: dados não retornados");
  }

  toast.success("Pedido criado com sucesso!");
  return formatOrderData(data);
};

export const getOrdersByCustomer = async (
  customerId: string
): Promise<Order[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_ITEMS_SELECT_QUERY)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    handleError(error, "Erro ao buscar pedidos do cliente");
  }

  return data?.map(formatOrderData) || [];
};

export const getOrderDetails = async (orderId: string): Promise<Order> => {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_ITEMS_SELECT_QUERY)
    .eq("order_id", orderId)
    .single();

  if (error) {
    handleError(error, "Erro ao buscar detalhes do pedido");
  }
  if (!data) {
    throw new Error("Pedido não encontrado");
  }

  return formatOrderData(data);
};

export const subscribeToOrders = (
  userId: string,
  callback: (payload: RealtimePostgresChangesPayload<any>) => void
) => {
  const channel = supabase
    .channel(`realtime:orders:user_id=${userId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
