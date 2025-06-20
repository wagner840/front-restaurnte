import React, { useState } from "react";
import {
  useAllReportsData,
  useGlobalReportMetrics,
  useSalesOverTime,
} from "../../hooks/useReportsData";
import { SalesByProductChart } from "../../components/reports/SalesByProductChart";
import { SalesByCustomerChart } from "../../components/reports/SalesByCustomerChart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { FunnelChart } from "../../components/reports/FunnelChart";
import { OrderTypeComparisonChart } from "../../components/reports/OrderTypeComparisonChart";
import { Skeleton } from "../../components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, User, Calendar } from "lucide-react";
import { SalesOverTimeChart } from "@/components/reports/SalesOverTimeChart";

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
  const [activeChart, setActiveChart] = useState("salesOverTime");

  const { data: reportsData, isLoading: isLoadingPeriodData } =
    useAllReportsData(startDate, endDate);
  const { data: globalMetrics, isLoading: isLoadingGlobalData } =
    useGlobalReportMetrics();
  const { data: salesOverTimeData, isLoading: isLoadingSalesOverTime } =
    useSalesOverTime(startDate, endDate);

  const renderChart = () => {
    switch (activeChart) {
      case "salesOverTime":
        return (
          <SalesOverTimeChart
            data={salesOverTimeData || []}
            isLoading={isLoadingSalesOverTime}
          />
        );
      case "salesByProduct":
        return (
          <SalesByProductChart
            data={reportsData?.salesByProduct || []}
            isLoading={isLoadingPeriodData}
          />
        );
      case "salesByCustomer":
        return (
          <SalesByCustomerChart
            data={reportsData?.salesByCustomer || []}
            isLoading={isLoadingPeriodData}
          />
        );
      case "funnelDelivery":
        return (
          <FunnelChart
            title="Funil de Conversão - Delivery"
            data={reportsData?.funnelDelivery || []}
          />
        );
      case "funnelRetirada":
        return (
          <FunnelChart
            title="Funil de Conversão - Retirada"
            data={reportsData?.funnelRetirada || []}
          />
        );
      case "orderTypeComparison":
        return (
          <OrderTypeComparisonChart
            title="Comparativo de Pedidos"
            data={reportsData?.orderTypeComparison || []}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">
        Dashboard de Relatórios
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Métricas Globais</CardTitle>
          <CardDescription>
            Visão geral de todo o período de operação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingGlobalData ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Renda Total
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {formatCurrency(globalMetrics?.[0]?.total_revenue || 0)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <Calendar className="h-8 w-8 text-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Dia de Maior Venda
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {globalMetrics?.[0]?.top_selling_day || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <User className="h-8 w-8 text-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Cliente Destaque
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {globalMetrics?.[0]?.top_customer_name || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Detalhados por Período</CardTitle>
          <CardDescription>
            Selecione um período e um tipo de gráfico para análise.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <div className="grid flex-1 min-w-[200px] items-center gap-1.5">
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
            <div className="grid flex-1 min-w-[200px] items-center gap-1.5">
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
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeChart === "salesOverTime" ? "default" : "outline"}
              onClick={() => setActiveChart("salesOverTime")}
            >
              Vendas ao Longo do Tempo
            </Button>
            <Button
              variant={activeChart === "salesByProduct" ? "default" : "outline"}
              onClick={() => setActiveChart("salesByProduct")}
            >
              Vendas por Produto
            </Button>
            <Button
              variant={
                activeChart === "salesByCustomer" ? "default" : "outline"
              }
              onClick={() => setActiveChart("salesByCustomer")}
            >
              Vendas por Cliente
            </Button>
            <Button
              variant={activeChart === "funnelDelivery" ? "default" : "outline"}
              onClick={() => setActiveChart("funnelDelivery")}
            >
              Funil (Delivery)
            </Button>
            <Button
              variant={activeChart === "funnelRetirada" ? "default" : "outline"}
              onClick={() => setActiveChart("funnelRetirada")}
            >
              Funil (Retirada)
            </Button>
            <Button
              variant={
                activeChart === "orderTypeComparison" ? "default" : "outline"
              }
              onClick={() => setActiveChart("orderTypeComparison")}
            >
              Comparativo de Pedidos
            </Button>
          </div>
          <div className="mt-4">{renderChart()}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
