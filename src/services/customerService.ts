import { supabase } from "../lib/supabaseClient";
import { Customer, BirthdayStatus } from "../types";
import { getOrdersByCustomer } from "./orderService";

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
