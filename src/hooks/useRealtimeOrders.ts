import { useEffect } from "react";
import { useToast } from "./useToast";
import { subscribeToOrders } from "../services/orderService";
import { useAuth } from "./useAuth";
import { useQueryClient } from "@tanstack/react-query";

export function useRealtimeOrders() {
  const { showPendingOrderToast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const channel = subscribeToOrders(user.id, (payload) => {
      const { eventType, new: newOrder } = payload;

      if (eventType === "INSERT" && newOrder.status === "pending") {
        showPendingOrderToast(
          newOrder.customerName || "Cliente não identificado"
        );
      }

      // Invalida o cache dos produtos mais vendidos quando há mudanças em pedidos
      if (eventType === "INSERT" || eventType === "UPDATE") {
        queryClient.invalidateQueries({ queryKey: ["topSellingProducts"] });
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [user, showPendingOrderToast, queryClient]);
}
