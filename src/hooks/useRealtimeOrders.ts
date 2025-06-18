import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Order } from "@/types";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export function useRealtimeOrders() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        async (payload: RealtimePostgresChangesPayload<Order>) => {
          // Invalidate and refetch orders query
          await queryClient.invalidateQueries({ queryKey: ["orders"] });

          // Show toast notification
          const event = payload.eventType;
          const status = (payload.new as Order)?.status;

          if (event === "INSERT") {
            toast.success("Novo pedido recebido!");
          } else if (event === "UPDATE" && status) {
            toast.info(`Pedido atualizado: ${status}`);
          } else if (event === "DELETE") {
            toast.error("Pedido removido");
          }
        }
      )
      .subscribe((status: string) => {
        if (status === "SUBSCRIBED") {
          setIsLoading(false);
        } else {
          setError(new Error("Falha ao conectar com o Supabase Realtime"));
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  return { isLoading, error };
}
