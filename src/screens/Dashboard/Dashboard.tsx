import React from "react";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { RecentOrders } from "../../components/dashboard/RecentOrders";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { useDashboardData } from "../../hooks/useDashboardData";
import { DashboardSkeleton } from "../../components/ui/skeleton";
import { TopSellingProducts } from "../../components/dashboard/TopSellingProducts";

export const Dashboard: React.FC<{ onTabChange: (tab: string) => void }> = ({
  onTabChange,
}) => {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center bg-red-50 border border-red-200 p-6 rounded-xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Erro ao Carregar Dashboard
            </h3>
            <p className="text-red-700 mb-4">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <p className="text-gray-600 text-sm md:text-base">
            Bem-vindo de volta! Aqui está o resumo do seu restaurante hoje.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <StatsCard
            title="Pedidos Hoje"
            value={data?.orders_today ?? 0}
            icon={ShoppingBag}
          />
          <StatsCard
            title="Receita Hoje"
            value={`R$ ${(data?.revenue_today ?? 0).toFixed(2)}`}
            icon={DollarSign}
          />
          <StatsCard
            title="Pedidos Ativos"
            value={data?.active_orders ?? 0}
            icon={Clock}
          />
          <StatsCard
            title="Taxa de Conclusão"
            value={`${(data?.completion_rate ?? 0).toFixed(0)}%`}
            icon={CheckCircle}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentOrders
              orders={data?.recent_orders || []}
              averageStatusTimes={data?.average_status_times || []}
              onViewAllClick={() => onTabChange("orders")}
            />
          </div>

          <div className="space-y-6">
            <TopSellingProducts products={data?.top_selling_products || []} />

            <div className="bg-card rounded-xl border p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">
                Estatísticas Rápidas
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Crescimento
                      </p>
                      <p className="text-xs text-muted-foreground">
                        vs. 7 dias atrás
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-base md:text-lg font-bold ${
                      (data?.revenue_growth ?? 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {(data?.revenue_growth ?? 0) >= 0 ? "+" : ""}
                    {(data?.revenue_growth ?? 0).toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Clientes Ativos
                      </p>
                      <p className="text-xs text-muted-foreground">
                        últimos 30 dias
                      </p>
                    </div>
                  </div>
                  <span className="text-base md:text-lg font-bold text-foreground">
                    {data?.active_customers_30d ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
