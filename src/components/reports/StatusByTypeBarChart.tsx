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
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface StatusByTypeData {
  status: string;
  Delivery: number;
  Retirada: number;
}

interface StatusByTypeBarChartProps {
  data: StatusByTypeData[];
  title: string;
}

export const StatusByTypeBarChart: React.FC<StatusByTypeBarChartProps> = ({
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
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Delivery" fill="#8884d8">
              <LabelList dataKey="Delivery" position="top" />
            </Bar>
            <Bar dataKey="Retirada" fill="#82ca9d">
              <LabelList dataKey="Retirada" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
