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
  className?: string;
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

const cardVariants = {
  pulse: {
    scale: [0.8, 1, 1.05],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
  static: {
    scale: 1,
  },
};

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onClick,
  className,
}) => {
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
      variants={cardVariants}
      animate={order.status === "pending" ? "pulse" : "static"}
      onMouseEnter={handleMouseEnter}
      className={cn(
        "group relative flex flex-col rounded-lg border p-4",
        "bg-card text-card-foreground shadow-transition",
        "hover:shadow-lg transition-all duration-300",
        "border-l-4",
        status.borderColor,
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-grow items-start justify-between gap-4">
        <div className="flex flex-1 flex-col space-y-3">
          <div className="flex flex-wrap items-center gap-2">
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
          <div className="flex-grow space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {order.customerName || "Cliente não identificado"}
              </span>
            </div>

            <OrderItemsList items={order.order_items} />
          </div>

          <div className="mt-auto flex items-center justify-between border-t pt-2">
            <span className="text-sm font-medium">Total</span>
            <span className="text-lg font-bold">
              {formatCurrency(order.total_amount)}
            </span>
          </div>
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
