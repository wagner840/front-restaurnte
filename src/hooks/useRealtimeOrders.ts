import { useEffect } from "react";
import { useToast } from "./useToast";
import { subscribeToOrders } from "../services/orderService";
import { useAuth } from "./useAuth";

export function useRealtimeOrders() {
  const { showPendingOrderToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = subscribeToOrders(user.id, (payload) => {
      const { eventType, new: newOrder } = payload;

      if (eventType === "INSERT" && newOrder.status === "pending") {
        showPendingOrderToast(
          newOrder.customerName || "Cliente não identificado"
        );
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [user, showPendingOrderToast]);
}
