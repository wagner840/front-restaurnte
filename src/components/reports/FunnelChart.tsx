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

interface FunnelStep {
  category: string;
  value: number;
}

interface FunnelChartProps {
  data: FunnelStep[];
  title: string;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({ data, title }) => {
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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="category" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8">
              <LabelList dataKey="value" position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
