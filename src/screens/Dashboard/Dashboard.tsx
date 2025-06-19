import React from "react";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { RecentOrders } from "../../components/dashboard/RecentOrders";
import { ShoppingBag, DollarSign, Clock, CheckCircle } from "lucide-react";
import { useDashboardData } from "../../hooks/useDashboardData";
import { DashboardSkeleton } from "../../components/ui/skeleton";
import { TopSellingProducts } from "../../components/dashboard/TopSellingProducts";
import { QuickStats } from "../../components/dashboard/QuickStats";
import { ErrorDisplay } from "../../components/ui/ErrorDisplay";

export const Dashboard: React.FC<{ onTabChange: (tab: string) => void }> = ({
  onTabChange,
}) => {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Erro ao Carregar Dashboard"
        message={error.message}
        onRetry={() => window.location.reload()}
      />
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
            <QuickStats
              revenueGrowth={data?.revenue_growth ?? 0}
              activeCustomers={data?.active_customers_30d ?? 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
