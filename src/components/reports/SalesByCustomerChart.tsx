import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface SalesByCustomerData {
  customer_name: string;
  total_sales: number;
}

interface SalesByCustomerChartProps {
  data: SalesByCustomerData[];
  isLoading?: boolean;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const SalesByCustomerChart: React.FC<SalesByCustomerChartProps> = ({
  data,
  isLoading,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[400px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Clientes por Vendas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total_sales"
              nameKey="customer_name"
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 100 : 150}
              fill="#8884d8"
              labelLine={!isMobile}
              label={
                isMobile
                  ? false
                  : (entry) =>
                      `${entry.customer_name} (${formatCurrency(
                        entry.total_sales
                      )})`
              }
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Este gráfico mostra a proporção de vendas entre os 10 principais
          clientes.
        </p>
      </CardContent>
    </Card>
  );
};
