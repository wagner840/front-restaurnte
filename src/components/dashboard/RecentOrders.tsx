import React from "react";
import { motion } from "framer-motion";
import { format, differenceInMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronRight,
  Clock,
  Truck,
  CheckCircle,
  Package,
  Bike,
  AlertTriangle,
  ChefHat,
  PackageCheck,
  XCircle,
} from "lucide-react";
import { Order, OrderStatus } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import "./recent-orders-animations.css";

interface RecentOrdersProps {
  orders: Order[];
  onViewAllClick: () => void;
  isLoading?: boolean;
  averageStatusTimes: Array<{ status: string; avg_minutes: number }>;
}

const statusConfig: {
  [key in OrderStatus]: {
    label: string;
    icon: React.ElementType;
    variant: "default" | "secondary" | "destructive" | "outline";
    className: string;
    borderColor: string;
  };
} = {
  pending: {
    label: "Pendente",
    icon: Clock,
    variant: "outline",
    className: "bg-status-pending text-status-pending-foreground",
    borderColor: "border-l-status-pending",
  },
  confirmed: {
    label: "Confirmado",
    icon: CheckCircle,
    variant: "secondary",
    className: "bg-status-confirmed text-status-confirmed-foreground",
    borderColor: "border-l-status-confirmed",
  },
  preparing: {
    label: "Preparando",
    icon: ChefHat,
    variant: "default",
    className: "bg-status-preparing text-status-preparing-foreground",
    borderColor: "border-l-status-preparing",
  },
  out_for_delivery: {
    label: "Entregando",
    icon: Truck,
    variant: "default",
    className:
      "bg-status-out_for_delivery text-status-out_for_delivery-foreground",
    borderColor: "border-l-status-out_for_delivery",
  },
  delivered: {
    label: "Entregue",
    icon: Package,
    variant: "secondary",
    className: "bg-status-delivered text-status-delivered-foreground",
    borderColor: "border-l-status-delivered",
  },
  completed: {
    label: "Concluído",
    icon: PackageCheck,
    variant: "secondary",
    className: "bg-status-completed text-status-completed-foreground",
    borderColor: "border-l-status-completed",
  },
  cancelled: {
    label: "Cancelado",
    icon: XCircle,
    variant: "destructive",
    className: "bg-status-cancelled text-status-cancelled-foreground",
    borderColor: "border-l-status-cancelled",
  },
};

const orderTypeConfig = {
  delivery: { label: "Entrega", icon: Bike },
  pickup: { label: "Retirada", icon: Package },
};

export const RecentOrders: React.FC<RecentOrdersProps> = ({
  orders,
  onViewAllClick,
  isLoading = false,
  averageStatusTimes,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Pedidos Recentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const avgTimesMap = new Map(
    averageStatusTimes.map((t) => [t.status, t.avg_minutes])
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Pedidos Recentes
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAllClick}
          className="hover:bg-primary/10 hover:text-primary"
        >
          Ver todos
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {orders.map((order) => (
              <RecentOrderRow
                key={order.order_id}
                order={order}
                avgTimesMap={avgTimesMap}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface RecentOrderRowProps {
  order: Order;
  avgTimesMap: Map<string, number>;
}

const cardVariants = {
  pulse: {
    scale: [0.9, 1.03, 1],
    boxShadow: [
      "0px 0px 0px rgba(255, 221, 0, 0)",
      "0px 0px 10px rgba(255, 198, 10, 0.952)",
      "0px 0px 10px rgb(255, 198, 10, 0.952)",
    ],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
  static: {
    scale: 1,
    boxShadow: "0px 0px 0px rgba(255, 221, 0, 0)",
  },
};

const RecentOrderRow: React.FC<RecentOrderRowProps> = ({
  order,
  avgTimesMap,
}) => {
  const statusInfo = statusConfig[order.status];
  const orderTypeInfo = orderTypeConfig[order.order_type];
  const StatusIcon = statusInfo.icon;
  const OrderTypeIcon = orderTypeInfo.icon;

  const itemSummary =
    Array.isArray(order.order_items) && order.order_items.length > 0
      ? order.order_items
          .map((item) => {
            const nome = item.name || item.item_name || item.item;
            if (!nome) return null;
            return `${item.quantity}x ${nome}`;
          })
          .filter(Boolean)
          .slice(0, 2)
          .join(", ") +
        (order.order_items.length > 2
          ? ` e mais ${order.order_items.length - 2} item(s)`
          : "")
      : "Pedido vazio";

  const timeInCurrentStatus = differenceInMinutes(
    new Date(),
    new Date(order.last_updated_at)
  );
  const avgTime = avgTimesMap.get(order.status) ?? 0;
  const isDelayed = avgTime > 0 && timeInCurrentStatus > avgTime * 1.25;

  return (
    <motion.div
      variants={cardVariants}
      animate={"static"}
      className={cn(
        "flex items-start justify-between p-4 rounded-lg border",
        "transition-all duration-200 ease-in-out",
        "hover:bg-accent/5 hover:border-primary/20",
        isDelayed ? "border-red-500 bg-red-500/5" : "border-border"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center",
            statusInfo.className
          )}
        >
          <StatusIcon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-foreground">{order.customerName}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {itemSummary}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Badge
              variant={statusInfo.variant}
              className={cn("transition-colors", statusInfo.className)}
            >
              {statusInfo.label}
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-background/50"
            >
              <OrderTypeIcon className="h-3 w-3" />
              {orderTypeInfo.label}
            </Badge>
            {isDelayed && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Atrasado
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-lg font-bold text-foreground">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(order.total_amount)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {format(new Date(order.created_at), "dd/MM/yyyy HH:mm", {
            locale: ptBR,
          })}
        </p>
      </div>
    </motion.div>
  );
};
