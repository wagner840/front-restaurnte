import { useQuery } from "@tanstack/react-query";
import {
  getSalesByCategory,
  getSalesByProduct,
  getSalesByCustomer,
} from "../services/reportService";

export const useSalesByCategory = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["salesByCategory", startDate, endDate],
    queryFn: () => getSalesByCategory(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

export const useSalesByProduct = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["salesByProduct", startDate, endDate],
    queryFn: () => getSalesByProduct(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

export const useSalesByCustomer = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["salesByCustomer", startDate, endDate],
    queryFn: () => getSalesByCustomer(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};
