import { OrderStatus } from "../types";
import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Truck,
  Package,
  PackageCheck,
  XCircle,
  ChefHat,
} from "lucide-react";

export const statusConfig: {
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

export const allowedStatusTransitions: {
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
