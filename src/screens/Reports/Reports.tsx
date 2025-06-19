import React, { useState } from "react";
import { useAllReportsData } from "../../hooks/useReportsData";
import { SalesByCategoryChart } from "../../components/reports/SalesByCategoryChart";
import { SalesByProductChart } from "../../components/reports/SalesByProductChart";
import { SalesByCustomerChart } from "../../components/reports/SalesByCustomerChart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { FunnelChart } from "../../components/reports/FunnelChart";
import { OrderTypeComparisonChart } from "../../components/reports/OrderTypeComparisonChart";
import { StatusByTypeBarChart } from "../../components/reports/StatusByTypeBarChart";
import { StatusTimeAreaChart } from "../../components/reports/StatusTimeAreaChart";
import { Skeleton } from "../../components/ui/skeleton";
import { Progress } from "../../components/ui/progress";

const Reports: React.FC = () => {
  const getFirstDayOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
  };

  const getLastDayOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
  };

  const [startDate, setStartDate] = useState(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState(getLastDayOfMonth());

  const { data: reportsData, isLoading } = useAllReportsData(
    startDate,
    endDate
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">
            Visualize o desempenho de suas vendas.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Período</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="start-date" className="text-sm font-medium">
              Data de Início
            </label>
            <Input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="end-date" className="text-sm font-medium">
              Data de Fim
            </label>
            <Input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 mt-8">
          <div className="col-span-2 flex flex-col items-center justify-center gap-4 py-12">
            <Progress
              value={60}
              className="w-1/2"
              aria-label="Carregando gráficos"
            />
            <Skeleton className="w-full h-[300px]" />
            <span className="text-muted-foreground">
              Carregando relatórios...
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <SalesByCategoryChart
              data={reportsData?.salesByCategory || []}
              isLoading={isLoading}
            />
            <SalesByProductChart
              data={reportsData?.salesByProduct || []}
              isLoading={isLoading}
            />
            <div className="lg:col-span-2">
              <SalesByCustomerChart
                data={reportsData?.salesByCustomer || []}
                isLoading={isLoading}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 mt-8">
            <div aria-label="Funil de Conversão Delivery" tabIndex={0}>
              <FunnelChart
                title="Funil de Conversão - Delivery"
                data={reportsData?.funnelDelivery || []}
              />
            </div>
            <div aria-label="Funil de Conversão Retirada" tabIndex={0}>
              <FunnelChart
                title="Funil de Conversão - Retirada"
                data={reportsData?.funnelRetirada || []}
              />
            </div>
            <div aria-label="Comparativo Delivery vs Retirada" tabIndex={0}>
              <OrderTypeComparisonChart
                title="Comparativo de Pedidos Delivery vs Retirada"
                data={reportsData?.orderTypeComparison || []}
              />
            </div>
            <div aria-label="Pedidos por Status e Tipo" tabIndex={0}>
              <StatusByTypeBarChart
                title="Pedidos por Status e Tipo"
                data={reportsData?.statusByTypeCounts || []}
              />
            </div>
            <div aria-label="Tempo Médio por Status" tabIndex={0}>
              <StatusTimeAreaChart
                title="Tempo Médio em Minutos por Status (Delivery x Retirada)"
                data={reportsData?.averageStatusTimeByType || []}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
