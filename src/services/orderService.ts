import { supabase } from "../lib/supabaseClient";
import { Order } from "../types";

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
