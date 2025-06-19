import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";

const fetchPendingOrdersCount = async () => {
  const { count, error } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")
    .is("viewed_at", null); // Assumindo que temos uma coluna 'viewed_at'

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
};

export const usePendingOrders = () => {
  return useQuery({
    queryKey: ["pendingOrdersCount"],
    queryFn: fetchPendingOrdersCount,
    refetchInterval: 15000, // Atualiza a cada 15 segundos
  });
};
