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

interface FunnelData {
  status: string;
  value: number;
}

interface FunnelChartProps {
  data: FunnelData[];
  title: string;
}

const statusTranslations: { [key: string]: string } = {
  pending: "Pendente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  out_for_delivery: "Em Rota",
  delivered: "Entregue",
  completed: "Concluído",
  cancelled: "Cancelado",
};

export const FunnelChart: React.FC<FunnelChartProps> = ({ data, title }) => {
  const translatedData = data.map((item) => ({
    ...item,
    status: statusTranslations[item.status] || item.status,
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
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="status" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" name="Pedidos">
              <LabelList dataKey="value" position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Este gráfico mostra a quantidade de pedidos em cada etapa do funil.
        </p>
      </CardContent>
    </Card>
  );
};
