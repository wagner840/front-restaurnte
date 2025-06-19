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

interface OrderTypeComparisonData {
  type: string;
  value: number;
}

interface OrderTypeComparisonChartProps {
  data: OrderTypeComparisonData[];
  title: string;
}

export const OrderTypeComparisonChart: React.FC<
  OrderTypeComparisonChartProps
> = ({ data, title }) => {
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
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d">
              <LabelList dataKey="value" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
