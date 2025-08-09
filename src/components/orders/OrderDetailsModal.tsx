import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Order, OrderStatus } from "../../types";
import { Badge, badgeVariants } from "../ui/badge";
import { Button } from "../ui/button";
import { VariantProps } from "class-variance-authority";
import {
  User,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Package,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../lib/utils";
import { useUpdateOrderStatus } from "../../hooks/useUpdateOrderStatus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;

  onClose: () => void;
}

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

const getStatusInfo = (
  status: OrderStatus
): { text: string; variant: BadgeVariant; icon: React.ElementType } => {
  switch (status) {
    case "pending":
      return { text: "Pendente", variant: "warning", icon: AlertCircle };
    case "confirmed":
      return { text: "Confirmado", variant: "info", icon: Package };
    case "preparing":
      return { text: "Preparando", variant: "info", icon: Package };
    case "out_for_delivery":
      return { text: "Em Entrega", variant: "info", icon: Truck };
    case "delivered":
      return { text: "Entregue", variant: "success", icon: PackageCheck };
    case "completed":
      return { text: "Concluído", variant: "success", icon: CheckCircle2 };
    case "cancelled":
      return { text: "Cancelado", variant: "destructive", icon: XCircle };
    default:
      return { text: "Desconhecido", variant: "secondary", icon: AlertCircle };
  }
};

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,

  onClose,
}) => {
  if (!order) return null;

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StatusIcon className="h-5 w-5" />
            Pedido #{String(order.order_id).substring(0, 8)}
          </DialogTitle>
          <DialogDescription>
            Detalhes do pedido e informações do cliente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-center gap-2">
            <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
            <span className="text-sm text-muted-foreground">
              {formatDate(order.created_at)}
            </span>
          </div>

          <div className="grid gap-2" data-testid="order-details-modal">
            <h3 className="font-semibold">Informações do Cliente</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {order.customerName ? (
                  <span>{order.customerName}</span>
                ) : (
                  <span className="text-muted-foreground">
                    Cliente não identificado
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Select
                  value={order.status}
                  onValueChange={(value) =>
                    updateStatus({
                      orderId: String(order.order_id),
                      newStatus: value as OrderStatus,
                    })
                  }
                  disabled={isPending}
                >
                  <SelectTrigger className="w-48 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="preparing">Preparando</SelectItem>
                    <SelectItem value="out_for_delivery">Em Entrega</SelectItem>
                    <SelectItem value="delivered">Entregue</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {order.order_type === "delivery" && (
            <div className="space-y-2">
              <h4 className="font-medium">Endereço de Entrega</h4>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <span className="text-sm">
                  {order.delivery_address
                    ? `${order.delivery_address.street}, ${order.delivery_address.number} - ${order.delivery_address.neighborhood}`
                    : "Não informado"}
                </span>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <h3 className="font-semibold">Itens do Pedido</h3>
            <div className="grid gap-2">
              {order.order_items.map((item, index) => {
                const itemName = item.name || item.item_name || item.item;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.quantity}x</span>
                      <span>{itemName}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center justify-between border-t pt-2 font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
