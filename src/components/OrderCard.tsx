import { motion } from "framer-motion";
import { Clock, Phone, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  formatCurrency,
  formatDate,
  formatPhoneNumber,
  getStatusColor,
} from "@/lib/utils";
import { Order, OrderItemJson, Customer } from "@/types";
import { cn } from "@/lib/utils";
import { getCustomerById } from "../services/customerService";
import { useEffect, useState } from "react";

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: Order["status"]) => void;
  onClick?: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onStatusChange,
  onClick,
}) => {
  const statusColor = getStatusColor(order.status);
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (order.customer_id) {
      getCustomerById(order.customer_id).then(setCustomer);
    }
  }, [order.customer_id]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "bg-white rounded-lg shadow-md p-6 space-y-4",
        order.status === "pending" && "animate-pulse-subtle",
        onClick && "cursor-pointer"
      )}
      onClick={handleClick}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={statusColor}>
              {order.status}
            </Badge>
            <span className="text-sm text-gray-500">
              <Clock className="inline-block w-4 h-4 mr-1" />
              {formatDate(order.created_at)}
            </span>
          </div>
          <Dialog>
            <Button variant="outline" className="text-sm">
              Ver detalhes
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Detalhes do Pedido</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>
                      {customer?.name ||
                        order.customerName ||
                        "Não identificado"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Phone className="w-4 h-4" />
                    <span>
                      {customer?.whatsapp
                        ? formatPhoneNumber(customer.whatsapp)
                        : "Não informado"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Itens do Pedido</h4>
                  <ul className="space-y-2">
                    {(order.order_items || []).map((item, index) => (
                      <li
                        key={item.name}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-gray-500">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Atualizar Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(order.order_id, "confirmed");
                      }}
                      disabled={order.status !== "pending"}
                    >
                      Confirmar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(order.order_id, "preparing");
                      }}
                      disabled={order.status !== "confirmed"}
                    >
                      Preparando
                    </Button>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(order.order_id, "out_for_delivery");
                      }}
                      disabled={order.status !== "preparing"}
                    >
                      Em Entrega
                    </Button>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(order.order_id, "delivered");
                      }}
                      disabled={order.status !== "out_for_delivery"}
                    >
                      Entregue
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {order.order_type === "delivery" && (
          <div className="mt-2 text-xs text-muted-foreground">
            <span>Endereço de entrega: </span>
            {order.delivery_address_id || "Não informado"}
          </div>
        )}
        <div className="mt-2 text-xs text-muted-foreground">
          <span>Itens: </span>
          {order.order_items.map((item, idx) => (
            <span key={item.name}>
              {item.quantity}x {item.name}
              {idx < order.order_items.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          <span>Cliente: </span>
          {customer?.name || order.customerName || "Não identificado"}
        </div>
        <div className="flex items-center justify-between pt-4 border-t">
          <span className="font-medium">Total</span>
          <span className="font-medium">
            {formatCurrency(order.total_amount)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
