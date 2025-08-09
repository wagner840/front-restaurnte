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

    if (!data) {
      toast.error("Dados do dashboard não encontrados na resposta.");
      throw new Error("Dados do dashboard não encontrados");
    }

    // Compatibilidade: a função no banco retorna um JSON único.
    // Em ambientes antigos, pode retornar um array com um registro.
    const stats: any = Array.isArray(data) ? data[0] : data;
    const mappedData: DashboardStats = {
      ordersToday: Number(stats.orders_today) || 0,
      revenueToday: Number(stats.revenue_today) || 0,
      activeOrders: Number(stats.active_orders) || 0,
      completionRate: Number(stats.completion_rate) || 0,
      revenueGrowth: Number(stats.revenue_growth) || 0,
      activeCustomers30d: Number(stats.active_customers_30d) || 0,
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
