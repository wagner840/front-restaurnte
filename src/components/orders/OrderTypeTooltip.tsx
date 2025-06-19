import React from "react";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface OrderTypeTooltipProps {
  orderType: "delivery" | "pickup";
}

export const OrderTypeTooltip: React.FC<OrderTypeTooltipProps> = ({
  orderType,
}) => {
  const isDelivery = orderType === "delivery";
  const tooltipText = isDelivery
    ? "Pedido para entrega no endereço do cliente."
    : "Pedido para retirada no balcão pelo cliente.";
  const badgeClass = isDelivery
    ? "bg-blue-100 text-blue-800"
    : "bg-green-100 text-green-800";
  const badgeText = isDelivery ? "Delivery" : "Retirada";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={badgeClass}>{badgeText}</Badge>
        </TooltipTrigger>
        <TooltipContent>
          <span>{tooltipText}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
