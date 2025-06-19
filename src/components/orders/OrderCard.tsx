import React from "react";
import { motion } from "framer-motion";
import { Order, OrderStatus } from "../../types";
import { Badge } from "../ui/badge";
import {
  User,
  Clock,
  AlertCircle,
  CheckCircle2,
  Truck,
  Package,
  PackageCheck,
  XCircle,
  MoreVertical,
  ChefHat,
} from "lucide-react";
import { cn, formatCurrency } from "../../lib/utils";
import { useUpdateOrderStatus } from "../../hooks/useUpdateOrderStatus";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
}

const statusConfig: {
  [key in OrderStatus]: {
    color: string;
    icon: React.ElementType;
    label: string;
    animation?: string;
    borderColor: string;
  };
} = {
  pending: {
    color: "bg-status-pending text-status-pending-foreground",
    icon: AlertCircle,
    label: "Pendente",
    animation: "animate-scale-attention",
    borderColor: "border-l-status-pending",
  },
  confirmed: {
    color: "bg-status-confirmed text-status-confirmed-foreground",
    icon: CheckCircle2,
    label: "Confirmado",
    borderColor: "border-l-status-confirmed",
  },
  preparing: {
    color: "bg-status-preparing text-status-preparing-foreground",
    icon: ChefHat,
    label: "Preparando",
    borderColor: "border-l-status-preparing",
  },
  out_for_delivery: {
    color: "bg-status-out_for_delivery text-status-out_for_delivery-foreground",
    icon: Truck,
    label: "Em Entrega",
    borderColor: "border-l-status-out_for_delivery",
  },
  delivered: {
    color: "bg-status-delivered text-status-delivered-foreground",
    icon: Package,
    label: "Entregue",
    borderColor: "border-l-status-delivered",
  },
  completed: {
    color: "bg-status-completed text-status-completed-foreground",
    icon: PackageCheck,
    label: "Concluído",
    borderColor: "border-l-status-completed",
  },
  cancelled: {
    color: "bg-status-cancelled text-status-cancelled-foreground",
    icon: XCircle,
    label: "Cancelado",
    borderColor: "border-l-status-cancelled",
  },
};

const allowedStatusTransitions: {
  [key in OrderStatus]?: { [type in "delivery" | "pickup"]?: OrderStatus[] };
} = {
  pending: {
    delivery: ["confirmed", "cancelled"],
    pickup: ["confirmed", "cancelled"],
  },
  confirmed: {
    delivery: ["preparing", "cancelled"],
    pickup: ["preparing", "cancelled"],
  },
  preparing: {
    delivery: ["out_for_delivery", "cancelled"],
    pickup: ["completed", "cancelled"],
  },
  out_for_delivery: { delivery: ["delivered", "cancelled"] },
  delivered: { delivery: ["completed"] },
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const status = statusConfig[order.status];
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (isPending) return;
    updateStatus({ orderId: order.order_id, newStatus });
  };

  const availableTransitions =
    allowedStatusTransitions[order.status]?.[order.order_type] || [];

  const orderTypeTag = (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            className={
              order.order_type === "delivery"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }
          >
            {order.order_type === "delivery" ? "Delivery" : "Retirada"}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <span>
            {order.order_type === "delivery"
              ? "Pedido para entrega no endereço do cliente."
              : "Pedido para retirada no balcão pelo cliente."}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        "group relative rounded-lg border p-4 min-h-[220px]", // Added min-h to prevent collapse
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
            <motion.div
              initial={false}
              animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
              transition={{ duration: 0.3 }}
            >
              <Badge
                className={cn(
                  "h-6 px-2 text-sm font-medium",
                  status.color,
                  "transition-colors duration-300"
                )}
              >
                <status.icon className="mr-1 h-4 w-4" />
                {status.label}
              </Badge>
            </motion.div>
            {orderTypeTag}
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

          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-1"
          >
            {Array.isArray(order.order_items) &&
              order.order_items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {item.quantity}x {item.name || item.item_name || item.item}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(item.price)}
                  </span>
                </motion.div>
              ))}
          </motion.div>

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

        {availableTransitions.length > 0 && (
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
              {Array.isArray(availableTransitions) &&
                availableTransitions.map((statusKey) => {
                  const statusInfo = statusConfig[statusKey as OrderStatus];
                  return (
                    <DropdownMenuItem
                      key={statusKey}
                      onClick={() =>
                        handleStatusChange(statusKey as OrderStatus)
                      }
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
        )}
      </div>
    </motion.div>
  );
};
