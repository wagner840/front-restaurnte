import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface SalesByProductData {
  product_name: string;
  total_sales: number;
}

interface SalesByProductChartProps {
  data: SalesByProductData[];
  isLoading?: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const SalesByProductChart: React.FC<SalesByProductChartProps> = ({
  data,
  isLoading,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Produtos Mais Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[400px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card role="region" aria-label="Gráfico de vendas por produto">
      <CardHeader>
        <CardTitle
          className="text-foreground"
          style={{ color: "#222", fontWeight: 700 }}
        >
          Top 10 Produtos Mais Vendidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: isMobile ? 10 : 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={formatCurrency} />
            <YAxis
              dataKey="product_name"
              type="category"
              width={isMobile ? 100 : 150}
              interval={0}
            />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Bar dataKey="total_sales" fill="#8884d8" name="Vendas">
              <LabelList
                dataKey="total_sales"
                position="right"
                formatter={(value: number) => formatCurrency(value)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Este gráfico exibe os 10 produtos mais vendidos (em R$) no período
          selecionado.
        </p>
      </CardContent>
    </Card>
  );
};
