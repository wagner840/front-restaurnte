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
      const stats: any = Array.isArray(statsData) ? statsData[0] : statsData;

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
        await supabase.from("recent_orders_with_customer").select("*").limit(5);
      if (recentOrdersError) throw new Error(recentOrdersError.message);

      // Normaliza itens que podem vir como objeto JSON, array ou null
      const normalizeOrderItems = (value: any) => {
        let raw = value;
        if (typeof raw === "string") {
          try {
            raw = JSON.parse(raw);
          } catch {
            raw = [];
          }
        }
        if (Array.isArray(raw)) return raw;
        if (raw && typeof raw === "object") {
          if (Array.isArray((raw as any).items)) return (raw as any).items;
          return [raw];
        }
        return [];
      };

      const recent_orders = (recentOrdersData || []).map((p: any) => {
        const order_items = normalizeOrderItems(p.order_items).map(
          (item: any) => {
            const precoAcento = item?.["preço"]; // casos com acento
            const candidatesPrice = [
              item?.price,
              item?.unit_price,
              item?.valor,
              precoAcento,
            ];
            const priceNum = candidatesPrice.find(
              (v: any) => typeof v === "number"
            );
            const price =
              typeof priceNum === "number"
                ? priceNum
                : (() => {
                    const str = candidatesPrice.find(
                      (v: any) => typeof v === "string"
                    );
                    return str
                      ? Number(
                          String(str)
                            .replace(/[^0-9.,-]/g, "")
                            .replace(",", ".")
                        )
                      : 0;
                  })();

            const candidatesQty = [item?.quantity, item?.quantidade];
            const qtyNum = candidatesQty.find(
              (v: any) => typeof v === "number"
            );
            const quantity =
              typeof qtyNum === "number"
                ? qtyNum
                : Number(
                    candidatesQty.find((v: any) => typeof v === "string") || 1
                  );

            const fallbackFromNotes =
              item?.notes || item?.observacoes || item?.["observações"] || "";
            const name =
              item?.name ??
              item?.item_name ??
              item?.item ??
              (fallbackFromNotes ? String(fallbackFromNotes) : "Item");
            return {
              name,
              price,
              quantity:
                Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
              observation:
                name === fallbackFromNotes && fallbackFromNotes
                  ? undefined
                  : item?.notes || item?.observacoes || item?.["observações"],
            };
          }
        );

        return {
          ...p,
          order_items,
          customerName: p.customer_name || "Cliente Anônimo",
        } as Order;
      });

      return {
        orders_today: Number(stats?.orders_today) || 0,
        revenue_today: Number(stats?.revenue_today) || 0,
        active_orders: Number(stats?.active_orders) || 0,
        completion_rate: Number(stats?.completion_rate) || 0,
        revenue_growth: Number(stats?.revenue_growth) || 0,
        active_customers_30d: Number(stats?.active_customers_30d) || 0,
        top_selling_products: (topProductsData as any) || [],
        average_status_times: avgTimesData || [],
        recent_orders,
      };
    },
  });
};
