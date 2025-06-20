import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import { Order, OrderStatus } from "../types";

export interface DashboardData {
  orders_today: number;
  revenue_today: number;
  active_orders: number;
  completion_rate: number;
  revenue_growth: number;
  active_customers_30d: number;
  top_selling_products: Array<{ product_name: string; total_quantity: number }>;
  average_status_times: Array<{ status: OrderStatus; avg_minutes: number }>;
  recent_orders: Order[];
}

export const useDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      // 1. Chamar a função de estatísticas abrangentes
      const { data: statsData, error: statsError } = await supabase.rpc(
        "get_comprehensive_dashboard_stats"
      );
      if (statsError) throw new Error(statsError.message);
      const stats = statsData[0];

      // 2. Chamar a função de produtos mais vendidos
      const { data: topProductsData, error: topProductsError } =
        await supabase.rpc("get_top_selling_products", { limit_count: 5 });
      if (topProductsError) throw new Error(topProductsError.message);

      // 3. Chamar a função de tempo médio por status (TEMPORARIAMENTE DESATIVADO)
      // const { data: avgTimesData, error: avgTimesError } = await supabase.rpc(
      //   "get_average_status_time"
      // );
      // if (avgTimesError) throw new Error(avgTimesError.message);
      const avgTimesData: { status: OrderStatus; avg_minutes: number }[] = []; // Retorna um array vazio enquanto a função não existe

      // 4. Buscar os últimos pedidos
      const { data: recentOrdersData, error: recentOrdersError } =
        await supabase
          .from("orders")
          .select(`*, customer:customers (name)`)
          .order("created_at", { ascending: false })
          .limit(5);
      if (recentOrdersError) throw new Error(recentOrdersError.message);

      const recent_orders = (recentOrdersData || []).map((p) => {
        const customer = Array.isArray(p.customer) ? p.customer[0] : p.customer;
        return {
          ...p,
          customerName: customer?.name || "Cliente Anônimo",
        };
      }) as Order[];

      return {
        orders_today: stats.orders_today || 0,
        revenue_today: stats.revenue_today || 0,
        active_orders: stats.active_orders || 0,
        completion_rate: stats.completion_rate || 0,
        revenue_growth: stats.revenue_growth || 0,
        active_customers_30d: stats.active_customers_30d || 0,
        top_selling_products: topProductsData || [],
        average_status_times: avgTimesData || [],
        recent_orders,
      };
    },
  });
};
