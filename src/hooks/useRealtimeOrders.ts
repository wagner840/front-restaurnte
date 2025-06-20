import { useEffect } from "react";
import { useToast } from "./useToast";
import { subscribeToOrders } from "../services/orderService";
import { useAuth } from "./useAuth";

export function useRealtimeOrders() {
  const { showPendingOrderToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = subscribeToOrders(user.id, async (payload) => {
      const { eventType, new: newOrder } = payload;

      if (eventType === "INSERT" && newOrder.status === "pending") {
        try {
          await showPendingOrderToast(
            newOrder.customerName || "Cliente não identificado"
          );
        } catch (error) {
          console.error('Erro ao mostrar toast de pedido pendente:', error);
        }
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [user, showPendingOrderToast]);
}
