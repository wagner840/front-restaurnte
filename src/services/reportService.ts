import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

/**
 * Busca todos os dados de relatórios de uma vez.
 */
import { AllReportsData } from "../types";

export const getAllReportsData = async (
  startDate?: string,
  endDate?: string
): Promise<AllReportsData> => {
  if (!startDate || !endDate) {
    return Promise.reject(
      new Error("As datas de início e fim são obrigatórias.")
    );
  }

  const { data, error } = await supabase.rpc("get_all_reports_data", {
    p_start_date: startDate,
    p_end_date: endDate,
  });

  if (error) {
    toast.error("Erro ao buscar dados consolidados de relatórios.");
    throw error;
  }

  return data as AllReportsData;
};

export const getGlobalReportMetrics = async () => {
  const { data, error } = await supabase.rpc("get_global_report_metrics");

  if (error) {
    toast.error("Erro ao buscar métricas globais de relatórios.");
    throw error;
  }

  return data;
};

export const getSalesOverTime = async (
  startDate?: string,
  endDate?: string
) => {
  const { data, error } = await supabase.rpc("get_sales_over_time", {
    p_start_date: startDate,
    p_end_date: endDate,
  });

  if (error) {
    toast.error("Erro ao buscar vendas ao longo do tempo.");
    throw error;
  }

  return data;
};
