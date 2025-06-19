import React from "react";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "../../lib/utils";
import { OrderStatus } from "../../types";
import { statusConfig } from "../../services/orderLogicService";

interface OrderFiltersProps {
  orderTypeFilter: "all" | "delivery" | "pickup";
  setOrderTypeFilter: (type: "all" | "delivery" | "pickup") => void;
  statusFilter: OrderStatus | "all";
  setStatusFilter: (status: OrderStatus | "all") => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  orderTypeFilter,
  setOrderTypeFilter,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3">Filtros</CardTitle>
        <CardDescription>Filtre os pedidos por tipo e status.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["all", "delivery", "pickup"] as const).map((type) => (
            <motion.div
              key={type}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant={orderTypeFilter === type ? "default" : "outline"}
                onClick={() => setOrderTypeFilter(type)}
                className={cn({
                  "bg-primary-vibrant hover:bg-primary-vibrant/90":
                    orderTypeFilter === type,
                })}
              >
                {type === "all"
                  ? "Todos"
                  : type === "delivery"
                  ? "Delivery"
                  : "Retirada"}
              </Button>
            </motion.div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge
              variant={statusFilter === "all" ? "default" : "outline"}
              className={cn("cursor-pointer", {
                "bg-secondary-action hover:bg-secondary-action/90":
                  statusFilter === "all",
              })}
              onClick={() => setStatusFilter("all")}
            >
              Todos
            </Badge>
          </motion.div>
          {Object.entries(statusConfig)
            .filter(([status]) => {
              if (orderTypeFilter === "pickup") {
                return !["out_for_delivery", "delivered"].includes(status);
              }
              return true;
            })
            .map(([status, { label }]) => (
              <motion.div
                key={status}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Badge
                  variant={statusFilter === status ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    statusFilter === status &&
                      "bg-primary-vibrant text-primary-foreground hover:bg-primary-vibrant/90"
                  )}
                  onClick={() =>
                    setStatusFilter(
                      status === statusFilter ? "all" : (status as OrderStatus)
                    )
                  }
                >
                  {label}
                </Badge>
              </motion.div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
