import { useQuery } from "@tanstack/react-query";
import { getAllReportsData } from "../services/reportService";

export const useAllReportsData = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["allReportsData", startDate, endDate],
    queryFn: () => getAllReportsData(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

import { getGlobalReportMetrics } from "../services/reportService";

export const useGlobalReportMetrics = () => {
  return useQuery({
    queryKey: ["globalReportMetrics"],
    queryFn: getGlobalReportMetrics,
  });
};

import { getSalesOverTime } from "../services/reportService";

export const useSalesOverTime = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["salesOverTime", startDate, endDate],
    queryFn: () => getSalesOverTime(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};
