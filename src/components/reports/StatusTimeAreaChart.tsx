import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface StatusTimeData {
  status: string;
  Delivery: number;
  Retirada: number;
}

interface StatusTimeAreaChartProps {
  data: StatusTimeData[];
  title: string;
}

export const StatusTimeAreaChart: React.FC<StatusTimeAreaChartProps> = ({
  data,
  title,
}) => {
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
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="Delivery"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            >
              <LabelList dataKey="Delivery" position="top" />
            </Area>
            <Area
              type="monotone"
              dataKey="Retirada"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
            >
              <LabelList dataKey="Retirada" position="top" />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
