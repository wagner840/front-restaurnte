import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface SalesOverTimeData {
  sale_date: string;
  total_sales: number;
}

interface SalesOverTimeChartProps {
  data: SalesOverTimeData[];
  isLoading?: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
};

export const SalesOverTimeChart: React.FC<SalesOverTimeChartProps> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vendas ao Longo do Tempo</CardTitle>
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
        <CardTitle>Vendas ao Longo do Tempo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sale_date" tickFormatter={formatDate} />
            <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
            <Tooltip
              labelFormatter={formatDate}
              formatter={(value) => formatCurrency(value as number)}
            />
            <Legend formatter={() => "Vendas Totais"} />
            <Line
              type="monotone"
              dataKey="total_sales"
              name="Vendas"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Este gráfico mostra a evolução das vendas diárias (em R$) no período
          selecionado.
        </p>
      </CardContent>
    </Card>
  );
};
