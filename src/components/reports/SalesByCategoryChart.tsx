import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export interface SalesByCategoryData {
  category: string;
  total_sales: number;
}

interface SalesByCategoryChartProps {
  data: SalesByCategoryData[];
  isLoading?: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-4 rounded-lg shadow-lg border">
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-muted-foreground">
          Vendas: {formatCurrency(payload[0].value as number)}
        </p>
      </div>
    );
  }
  return null;
};

export const SalesByCategoryChart: React.FC<SalesByCategoryChartProps> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vendas por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={() => "Vendas Totais"} />
            <Bar
              dataKey="total_sales"
              name="Vendas"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Este gráfico mostra o total de vendas (R$) por categoria de produto no
          período selecionado.
        </p>
      </CardContent>
    </Card>
  );
};
