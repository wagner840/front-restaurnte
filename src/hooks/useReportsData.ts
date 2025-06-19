import { useQuery } from "@tanstack/react-query";
import { getAllReportsData } from "../services/reportService";

export const useAllReportsData = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["allReportsData", startDate, endDate],
    queryFn: () => getAllReportsData(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};
