import React from "react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { OrderStatus } from "../../types";
import {
  statusConfig,
  allowedStatusTransitions,
} from "../../services/orderLogicService";

interface OrderStatusActionsProps {
  order: {
    status: OrderStatus;
    order_type: "delivery" | "pickup";
    order_id: string;
  };
  onStatusChange: (newStatus: OrderStatus) => void;
  isPending: boolean;
}

export const OrderStatusActions: React.FC<OrderStatusActionsProps> = ({
  order,
  onStatusChange,
  isPending,
}) => {
  const availableTransitions =
    allowedStatusTransitions[order.status]?.[order.order_type] || [];

  if (availableTransitions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full p-2 hover:bg-muted transition-colors duration-200"
          disabled={isPending}
        >
          <MoreVertical className="h-5 w-5" />
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mudar Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableTransitions.map((statusKey) => {
          const statusInfo = statusConfig[statusKey as OrderStatus];
          return (
            <DropdownMenuItem
              key={statusKey}
              onClick={() => onStatusChange(statusKey as OrderStatus)}
              className="transition-colors duration-200 hover:bg-accent"
              disabled={isPending}
            >
              <statusInfo.icon className="mr-2 h-4 w-4" />
              {statusInfo.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
