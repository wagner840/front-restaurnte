import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

/**
 * Busca todos os dados de relatórios de uma vez.
 */
export const getAllReportsData = async (
  startDate?: string,
  endDate?: string
) => {
  const { data, error } = await supabase.rpc("get_all_reports_data", {
    p_start_date: startDate,
    p_end_date: endDate,
  });

  if (error) {
    toast.error("Erro ao buscar dados consolidados de relatórios.");
    console.error("Erro detalhado:", error);
    throw error;
  }

  return data;
};
