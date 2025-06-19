import React from "react";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import { statusConfig } from "../../services/orderLogicService";
import { OrderStatus } from "../../types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
}) => {
  const config = statusConfig[status];

  return (
    <motion.div
      initial={false}
      animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
      transition={{ duration: 0.3 }}
    >
      <Badge
        className={cn(
          "h-6 px-2 text-sm font-medium",
          config.color,
          "transition-colors duration-300"
        )}
      >
        <config.icon className="mr-1 h-4 w-4" />
        {config.label}
      </Badge>
    </motion.div>
  );
};
