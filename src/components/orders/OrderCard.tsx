import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { cn, formatCurrency, formatDate } from "../../lib/utils";
import { CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { BaseCard } from "../ui/BaseCard";

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onClick?: () => void;
}

const statusFlow: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "completed",
  "cancelled",
];

const getStatusInfo = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return {
        text: "Pendente",
        icon: AlertCircle,
        badgeClass: "bg-status-pending text-status-pending-foreground",
        borderColorClass: "border-status-pending",
      };
    case "confirmed":
      return {
        text: "Confirmado",
        icon: Package,
        badgeClass: "bg-status-confirmed text-status-confirmed-foreground",
        borderColorClass: "border-status-confirmed",
      };
    case "preparing":
      return {
        text: "Preparando",
        icon: ChefHat,
        badgeClass: "bg-status-preparing text-status-preparing-foreground",
        borderColorClass: "border-status-preparing",
      };
    case "out_for_delivery":
      return {
        text: "Em Entrega",
        icon: Truck,
        badgeClass:
          "bg-status-out_for_delivery text-status-out_for_delivery-foreground",
        borderColorClass: "border-status-out_for_delivery",
      };
    case "delivered":
      return {
        text: "Entregue",
        icon: PackageCheck,
        badgeClass: "bg-status-delivered text-status-delivered-foreground",
        borderColorClass: "border-status-delivered",
      };
    case "completed":
      return {
        text: "Concluído",
        icon: CheckCircle2,
        badgeClass: "bg-status-completed text-status-completed-foreground",
        borderColorClass: "border-status-completed",
      };
    case "cancelled":
      return {
        text: "Cancelado",
        icon: XCircle,
        badgeClass: "bg-status-cancelled text-status-cancelled-foreground",
        borderColorClass: "border-status-cancelled",
      };
    default:
      return {
        text: "Desconhecido",
        icon: AlertCircle,
        badgeClass: "bg-gray-500 text-white",
        borderColorClass: "border-gray-500",
      };
  }
};

const getOrderAge = (createdAt: string): string => {
  const orderDate = new Date(createdAt);
  const now = new Date();
  const diffMinutes = Math.floor(
    (now.getTime() - orderDate.getTime()) / (1000 * 60)
  );

  if (diffMinutes < 1) return "Agora";
  if (diffMinutes < 60) return `${diffMinutes}min`;
  const hours = Math.floor(diffMinutes / 60);
  return `${hours}h${diffMinutes % 60}min`;
};

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onUpdateStatus,
  onClick,
}) => {
  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;
  const orderAge = getOrderAge(order.created_at);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleStatusChange = (e: React.MouseEvent, newStatus: OrderStatus) => {
    e.stopPropagation();
    onUpdateStatus(order.order_id, newStatus);
  };

  const OrderTypeIcon = order.order_type === "delivery" ? Truck : Package;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3, boxShadow: "0 10px 20px -5px rgba(0,0,0,0.1)" }}
    >
      <BaseCard
        onClick={onClick}
        className={cn(
          "flex flex-col justify-between h-full",
          "focus:ring-2 focus:ring-primary focus:ring-offset-2",
          statusInfo.borderColorClass,
          order.status === "pending" && "animate-pulse-subtle",
          onClick && "cursor-pointer"
        )}
      >
        <CardHeader className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <DropdownMenu onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Badge
                    className={cn(
                      "cursor-pointer whitespace-nowrap transition-colors hover:bg-opacity-80",
                      statusInfo.badgeClass
                    )}
                  >
                    <StatusIcon className="w-4 h-4 mr-1.5" />
                    {statusInfo.text}
                  </Badge>
                </DropdownMenuTrigger>
                <AnimatePresence>
                  {isMenuOpen && (
                    <DropdownMenuContent
                      asChild
                      forceMount
                      onClick={(e) => e.stopPropagation()}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                      >
                        {statusFlow.map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={(e) => handleStatusChange(e, status)}
                            disabled={order.status === status}
                          >
                            {getStatusInfo(status).text}
                          </DropdownMenuItem>
                        ))}
                      </motion.div>
                    </DropdownMenuContent>
                  )}
                </AnimatePresence>
              </DropdownMenu>
              <Badge variant="secondary">
                <Clock className="w-4 h-4 mr-1" />
                {orderAge}
              </Badge>
            </div>
            <Badge variant="outline" className="flex items-center gap-1.5">
              <OrderTypeIcon className="w-4 h-4" />
              {order.order_type === "delivery" ? "Delivery" : "Retirada"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{formatDate(order.created_at)}</span>
            </div>
            {order.customerName && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-lg font-semibold">
                  {order.customerName}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-sm font-medium text-muted-foreground">
              Itens:
            </h4>
            <div className="space-y-1">
              {(order.order_items || []).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-muted-foreground">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-2 border-t flex justify-between items-center">
          <span className="text-lg font-bold">
            {formatCurrency(order.total_amount)}
          </span>
          <motion.div whileHover={{ scale: 1.2, color: "hsl(var(--primary))" }}>
            <MoreVertical
              className="w-5 h-5 text-muted-foreground"
              aria-label="Mais ações"
            />
          </motion.div>
        </CardFooter>
      </BaseCard>
    </motion.div>
  );
};
