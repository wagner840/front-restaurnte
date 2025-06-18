import React, { useState } from "react";
import {
  useSalesByCategory,
  useSalesByProduct,
  useSalesByCustomer,
} from "../../hooks/useReportsData";
import { SalesByCategoryChart } from "../../components/reports/SalesByCategoryChart";
import { SalesByProductChart } from "../../components/reports/SalesByProductChart";
import { SalesByCustomerChart } from "../../components/reports/SalesByCustomerChart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";

const Reports: React.FC = () => {
  const getFirstDayOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
  };

  const getLastDayOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
  };

  const [startDate, setStartDate] = useState(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState(getLastDayOfMonth());

  const { data: salesCategory, isLoading: loadingCategory } =
    useSalesByCategory(startDate, endDate);
  const { data: salesProduct, isLoading: loadingProduct } = useSalesByProduct(
    startDate,
    endDate
  );
  const { data: salesCustomer, isLoading: loadingCustomer } =
    useSalesByCustomer(startDate, endDate);
  const salesByProductData = salesProduct
    ? salesProduct.map((item) => ({
        ...item,
        product: (item as any).product_name,
      }))
    : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">
            Visualize o desempenho de suas vendas.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Período</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="start-date" className="text-sm font-medium">
              Data de Início
            </label>
            <Input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="end-date" className="text-sm font-medium">
              Data de Fim
            </label>
            <Input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <SalesByCategoryChart
          data={salesCategory || []}
          isLoading={loadingCategory}
        />
        <SalesByProductChart
          data={salesByProductData}
          isLoading={loadingProduct}
        />
        <div className="lg:col-span-2">
          <SalesByCustomerChart
            data={salesCustomer || []}
            isLoading={loadingCustomer}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;
