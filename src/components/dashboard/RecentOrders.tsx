import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronRight,
  AlertCircle,
  Check,
  Clock,
  Truck,
  CheckCircle,
} from "lucide-react";
import { OrderStatus } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

interface RecentOrdersProps {
  orders: Array<{
    order_id: string;
    customer_name: string;
    total_amount: number;
    status: OrderStatus;
    created_at: string;
  }>;
  onViewAllClick: () => void;
  isLoading?: boolean;
}

const statusConfig = {
  pending: {
    label: "Pendente",
    icon: Clock,
    variant: "outline",
  },
  preparing: {
    label: "Preparando",
    icon: AlertCircle,
    variant: "default",
  },
  out_for_delivery: {
    label: "Entregando",
    icon: Truck,
    variant: "default",
  },
  delivered: {
    label: "Entregue",
    icon: Check,
    variant: "secondary",
  },
  confirmed: {
    label: "Confirmado",
    icon: CheckCircle,
    variant: "secondary",
  },
  cancelled: {
    label: "Cancelado",
    icon: AlertCircle,
    variant: "destructive",
  },
  completed: {
    label: "Concluído",
    icon: CheckCircle,
    variant: "secondary",
  },
} as const;

export const RecentOrders: React.FC<RecentOrdersProps> = ({
  orders,
  onViewAllClick,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pedidos Recentes</CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewAllClick}>
          Ver todos
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              return (
                <div
                  key={order.order_id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{order.customer_name}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <status.icon className="mr-1 h-4 w-4" />
                      <Badge variant={status.variant as any}>
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(order.total_amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(order.created_at), "PPp", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
