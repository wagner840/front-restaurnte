import React from "react";
import { Order, OrderItemJson } from "../../types";
import { Button } from "../ui/button";
import { User, Hash, Truck, ShoppingBag } from "lucide-react";

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: Order["status"]) => void;
}

const getStatusInfo = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return {
        text: "Pendente",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    case "confirmed":
      return {
        text: "Confirmado",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      };
    case "preparing":
      return {
        text: "Preparando",
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      };
    case "out_for_delivery":
      return {
        text: "Em Entrega",
        color: "bg-cyan-100 text-cyan-800 border-cyan-200",
      };
    case "delivered":
      return {
        text: "Entregue",
        color: "bg-green-100 text-green-800 border-green-200",
      };
    case "completed":
      return {
        text: "Concluído",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      };
    case "cancelled":
      return {
        text: "Cancelado",
        color: "bg-red-100 text-red-800 border-red-200",
      };
    default:
      return {
        text: "Desconhecido",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      };
  }
};

const getNextStatus = (
  status: Order["status"],
  orderType: Order["order_type"]
): Order["status"] | null => {
  const deliveryFlow: Order["status"][] = [
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
    "completed",
  ];
  const pickupFlow: Order["status"][] = [
    "pending",
    "confirmed",
    "preparing",
    "completed",
  ];

  const flow = orderType === "delivery" ? deliveryFlow : pickupFlow;

  const currentIndex = flow.indexOf(status);
  if (currentIndex !== -1 && currentIndex < flow.length - 1) {
    return flow[currentIndex + 1];
  }
  return null;
};

// Função utilitária para extrair o nome do item de forma flexível
const getItemName = (item: any): string => {
  return (
    item.item_name ||
    item.name ||
    item.item ||
    item.product_name ||
    "Item sem nome"
  );
};

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onUpdateStatus,
}) => {
  const nextStatus = getNextStatus(order.status, order.order_type);
  const statusInfo = getStatusInfo(order.status);

  let items: OrderItemJson[] = [];
  if (typeof order.order_items === "string") {
    try {
      items = JSON.parse(order.order_items);
    } catch (e) {
      console.error("Failed to parse order_items:", e);
    }
  } else if (Array.isArray(order.order_items)) {
    items = order.order_items;
  }

  return (
    <div className="bg-white rounded-lg border border-[#e5e8ea] p-4 sm:p-6 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Hash size={16} className="text-[#607589]" />
            <span className="font-bold text-[#111416]">
              {order.order_id.substring(0, 8)}
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${statusInfo.color}`}
          >
            {statusInfo.text}
          </span>
        </div>
        <div className="w-full sm:w-auto text-left sm:text-right">
          <p className="text-xl font-bold text-[#111416]">
            R$ {(order.total_amount || 0).toFixed(2)}
          </p>
          <p className="text-sm text-[#607589]">
            {new Date(order.created_at).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {order.order_type === "delivery" ? (
            <Truck size={16} />
          ) : (
            <ShoppingBag size={16} />
          )}
          <span>
            {order.order_type === "delivery" ? "Delivery" : "Retirada"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <User size={16} className="text-[#607589]" />
          <span className="text-[#607589]">
            {order.customer?.name || "Cliente não identificado"}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4 flex-grow">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-start py-2 border-b border-[#e5e8ea] last:border-b-0 gap-2"
          >
            <div className="flex-grow">
              <span className="font-medium text-[#111416]">
                {item.quantity}x {getItemName(item)}
              </span>
              {item.notes && (
                <p className="text-sm text-[#607589] mt-1">Obs: {item.notes}</p>
              )}
              {item.details && (
                <p className="text-sm text-[#607589] mt-1">
                  Detalhes: {item.details}
                </p>
              )}
            </div>
            <span className="text-right text-[#607589] flex-shrink-0">
              R$ {(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        {nextStatus && (
          <Button
            onClick={() => onUpdateStatus(order.order_id, nextStatus)}
            className="w-full bg-[#0c7ff2] hover:bg-[#0c7ff2]/90"
          >
            Marcar como {getStatusInfo(nextStatus).text}
          </Button>
        )}
      </div>
    </div>
  );
};
