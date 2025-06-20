import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { DashboardStats } from "../types";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const { data, error } = await supabase.rpc(
      "get_comprehensive_dashboard_stats"
    );

    if (error) {
      if (error instanceof Error) {
        toast.error("Erro ao buscar dados do dashboard: " + error.message);
      }
      throw error;
    }

    if (!data || data.length === 0) {
      toast.error("Dados do dashboard não encontrados na resposta.");
      throw new Error("Dados do dashboard não encontrados");
    }

    const stats = data[0];
    const mappedData: DashboardStats = {
      ordersToday: stats.orders_today || 0,
      revenueToday: stats.revenue_today || 0,
      activeOrders: stats.active_orders || 0,
      completionRate: stats.completion_rate || 0,
      revenueGrowth: stats.revenue_growth || 0,
      activeCustomers30d: stats.active_customers_30d || 0,
    };

    return mappedData;
  } catch (error) {
    toast.error(
      "Erro ao carregar dados do dashboard. Tente novamente mais tarde."
    );
    return {
      ordersToday: 0,
      revenueToday: 0,
      activeOrders: 0,
      completionRate: 0,
      revenueGrowth: 0,
      activeCustomers30d: 0,
    };
  }
};
