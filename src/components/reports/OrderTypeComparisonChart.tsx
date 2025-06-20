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

interface OrderTypeComparison {
  order_type: "delivery" | "pickup";
  count: number;
}

interface OrderTypeComparisonChartProps {
  data: OrderTypeComparison[];
  title: string;
}

const typeTranslations: { [key: string]: string } = {
  delivery: "Delivery",
  pickup: "Retirada",
};

export const OrderTypeComparisonChart: React.FC<
  OrderTypeComparisonChartProps
> = ({ data, title }) => {
  const translatedData = data.map((item) => ({
    ...item,
    order_type: typeTranslations[item.order_type] || item.order_type,
  }));

  return (
    <Card role="region" aria-label={title}>
      <CardHeader>
        <CardTitle
          className="text-foreground"
          style={{ color: "#222", fontWeight: 700 }}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={translatedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="order_type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" name="Pedidos">
              <LabelList dataKey="count" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Este gráfico compara a quantidade de pedidos entre Delivery e
          Retirada.
        </p>
      </CardContent>
    </Card>
  );
};
