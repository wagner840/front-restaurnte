import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";

export interface DashboardData {
  novosClientesHoje: number;
  pedidosAbertos: number;
  avaliacaoMedia: number;
  topProduto: { nome: string; vendas: number } | null;
  produtosMaisVendidos: Array<{ nome: string; vendas: number }>;
  distribuicaoPedidos: Array<{ status: string; value: number }>;
  ultimosPedidos: Array<{
    order_id: string;
    customerName: string;
    total_amount: number;
    status: string;
    created_at: string;
  }>;
}

export const useDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      // Novos clientes hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: novosClientesHoje } = await supabase
        .from("customers")
        .select("customer_id", { count: "exact", head: true })
        .gte("created_at", today.toISOString());

      // Pedidos em aberto
      const { count: pedidosAbertos } = await supabase
        .from("orders")
        .select("order_id", { count: "exact", head: true })
        .in("status", [
          "pending",
          "confirmed",
          "preparing",
          "out_for_delivery",
        ]);

      // Distribuição de pedidos por status
      const { data: pedidosStatusData } = await supabase
        .from("orders")
        .select("status")
        .neq("status", "completed");
      const statusMap: Record<string, number> = {};
      (pedidosStatusData || []).forEach((p) => {
        statusMap[p.status] = (statusMap[p.status] || 0) + 1;
      });
      const distribuicaoPedidos = Object.entries(statusMap).map(
        ([status, value]) => ({ status, value })
      );

      // Produtos mais vendidos (top 5)
      const { data: salesData } = await supabase
        .from("sales_report_view")
        .select("category, created_at, sale_value");
      // Agrupar por produto (categoria)
      const produtoMap: Record<string, number> = {};
      (salesData || []).forEach((s) => {
        produtoMap[s.category] =
          (produtoMap[s.category] || 0) + Number(s.sale_value);
      });
      const produtosMaisVendidos = Object.entries(produtoMap)
        .map(([nome, vendas]) => ({ nome, vendas }))
        .sort((a, b) => b.vendas - a.vendas)
        .slice(0, 5);
      const topProduto = produtosMaisVendidos[0] || null;

      // Avaliação média (mock, pois não há tabela de feedbacks)
      const avaliacaoMedia = 4.7;

      // Últimos pedidos reais (5 mais recentes)
      const { data: ultimosPedidosData } = await supabase
        .from("orders")
        .select(
          `order_id, created_at, status, total_amount, customer:customers (name)`
        )
        .order("created_at", { ascending: false })
        .limit(5);
      const ultimosPedidos = (ultimosPedidosData || []).map((p) => ({
        order_id: p.order_id,
        customerName: p.customer?.name || "Cliente Anônimo",
        total_amount: p.total_amount,
        status: p.status,
        created_at: p.created_at,
      }));

      return {
        novosClientesHoje: novosClientesHoje || 0,
        pedidosAbertos: pedidosAbertos || 0,
        avaliacaoMedia,
        topProduto,
        produtosMaisVendidos,
        distribuicaoPedidos,
        ultimosPedidos,
      };
    },
  });
};
