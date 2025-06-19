import React from "react";
import { motion } from "framer-motion";
import { Order, OrderStatus } from "../../types";
import { User, Clock } from "lucide-react";
import { cn, formatCurrency } from "../../lib/utils";
import { useUpdateOrderStatus } from "../../hooks/useUpdateOrderStatus";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabaseClient";
import { statusConfig } from "../../services/orderLogicService";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderTypeTooltip } from "./OrderTypeTooltip";
import { OrderItemsList } from "./OrderItemsList";
import { OrderStatusActions } from "./OrderStatusActions";

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
}

const markAsViewed = async (orderId: string) => {
  const { error } = await supabase
    .from("orders")
    .update({ viewed_at: new Date().toISOString() })
    .eq("order_id", orderId);

  if (error) {
    throw new Error(error.message);
  }
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const queryClient = useQueryClient();
  const status = statusConfig[order.status];
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const markAsViewedMutation = useMutation({
    mutationFn: markAsViewed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingOrdersCount"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleMouseEnter = () => {
    if (order.status === "pending" && !order.viewed_at) {
      markAsViewedMutation.mutate(order.order_id);
    }
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (isPending) return;
    updateStatus({ orderId: order.order_id, newStatus });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      onMouseEnter={handleMouseEnter}
      className={cn(
        "group relative rounded-lg border p-4 min-h-[220px]",
        "bg-card text-card-foreground shadow-transition",
        "hover:shadow-lg transition-all duration-300",
        "border-l-4",
        status.borderColor,
        order.status === "pending" ? status.animation : "",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <OrderStatusBadge status={order.status} />
            <OrderTypeTooltip orderType={order.order_type} />
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              {new Date(order.created_at).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {order.customerName || "Cliente não identificado"}
            </span>
          </div>

          <OrderItemsList items={order.order_items} />

          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between border-t pt-2"
          >
            <span className="text-sm font-medium">Total</span>
            <span className="text-lg font-bold">
              {formatCurrency(order.total_amount)}
            </span>
          </motion.div>
        </div>

        <OrderStatusActions
          order={order}
          onStatusChange={handleStatusChange}
          isPending={isPending}
        />
      </div>
    </motion.div>
  );
};
