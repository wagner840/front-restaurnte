import { useEffect } from "react";
import { useToast } from "./useToast";
import { subscribeToOrders } from "../services/orderService";
import { useAuth } from "./useAuth";
import { playNotificationSound } from '../lib/sounds';
import { useTheme } from '../contexts/ThemeContext';

export function useRealtimeOrders() {
  const { showPendingOrderToast } = useToast();
  const { user } = useAuth();
  const { soundEnabled } = useTheme();

  useEffect(() => {
    if (!user) return;

    const channel = subscribeToOrders(user.id, (payload) => {
      const { eventType, new: newOrder } = payload;

      if (eventType === "INSERT" && newOrder.status === "pending") {
        showPendingOrderToast(
          newOrder.customerName || "Cliente não identificado"
        );
        if (soundEnabled) {
          playNotificationSound();
        }
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [user, showPendingOrderToast, soundEnabled]);
}
