import { supabase } from "../lib/supabaseClient";
import {
  Customer,
  BirthdayStatus,
  CustomerAnalyticsData,
  CustomerDetails,
} from "../types";
import { toast } from "sonner";

export const getCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase.from("customers").select("*");

  if (error) {
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
      return null;
    }
    throw error;
  }

  return data;
};

export const getBirthdayCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase.rpc("get_birthday_customers");

  if (error) {
    throw error;
  }

  return data || [];
};

export const getCustomerDetails = async (
  customerId: string
): Promise<CustomerDetails> => {
  if (!customerId) {
    throw new Error("O ID do cliente é obrigatório.");
  }

  try {
    const { data, error } = await supabase
      .rpc("get_customer_analytics", { p_customer_id: customerId })
      .single<CustomerAnalyticsData>();

    if (error) {
      toast.error("Falha ao carregar os detalhes do cliente.");
      throw error;
    }

    if (!data) {
      throw new Error("Nenhuma análise encontrada para este cliente.");
    }

    // Mapeia de snake_case (banco) para camelCase (frontend)
    return {
      totalOrders: data.total_orders,
      totalSpent: data.total_spent,
      averageTicket: data.average_ticket,
      mostFrequentDay: data.most_frequent_day,
      favoriteProducts: data.top_products,
      lastOrderDate: data.last_order_date,
    };
  } catch (error) {
    toast.error("Ocorreu um erro inesperado ao buscar os detalhes.");
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
      return null;
    }
    throw error;
  }

  return data;
};

// Aliases para compatibilidade
export const addCustomer = createCustomer;
export const updateCustomerGiftStatus = updateCustomerBirthdayStatus;
export const updateBirthdayStatus = updateCustomerBirthdayStatus;
