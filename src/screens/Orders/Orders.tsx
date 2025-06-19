import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { OrderDetailsModal } from "../../components/orders/OrderDetailsModal";
import { getOrders } from "../../services/orderService";
import { Order, OrderStatus } from "../../types";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { cn } from "../../lib/utils";
import { OrderCard } from "../../components/orders/OrderCard";
import { OrderCardSkeleton } from "../../components/orders/OrderCardSkeleton";
import { CreateOrderModal } from "../../components/orders/CreateOrderModal";

const statusMap: Record<
  OrderStatus,
  { text: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { text: "Pendente", variant: "outline" },
  confirmed: { text: "Confirmado", variant: "default" },
  preparing: { text: "Preparando", variant: "default" },
  out_for_delivery: { text: "Em Entrega", variant: "default" },
  delivered: { text: "Entregue", variant: "default" },
  completed: { text: "Concluído", variant: "secondary" },
  cancelled: { text: "Cancelado", variant: "destructive" },
};

export const Orders: React.FC = () => {
  const [orderTypeFilter, setOrderTypeFilter] = useState<
    "all" | "delivery" | "pickup"
  >("all");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });

  const filteredOrders = orders
    .filter((order) => {
      const matchesType =
        orderTypeFilter === "all" || order.order_type === orderTypeFilter;
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesSearch =
        searchTerm === "" ||
        order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesType && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (statusFilter === "all") {
        const statusPriority: Record<OrderStatus, number> = {
          pending: 1,
          confirmed: 2,
          preparing: 3,
          out_for_delivery: 4,
          delivered: 5,
          completed: 6,
          cancelled: 7,
        };

        if (statusPriority[a.status] < statusPriority[b.status]) {
          return -1;
        }
        if (statusPriority[a.status] > statusPriority[b.status]) {
          return 1;
        }
      }
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center p-2">
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive">
            Erro ao carregar pedidos
          </p>
          <p className="text-sm text-muted-foreground">
            Tente novamente mais tarde
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-h1">Pedidos</h1>
          <Button onClick={() => setCreateModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Pedido
          </Button>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-h3">Filtros</CardTitle>
          <CardDescription>
            Filtre os pedidos por tipo e status.
          </CardDescription>
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
            {Object.entries(statusMap)
              .filter(([status]) => {
                if (orderTypeFilter === "pickup") {
                  return !["out_for_delivery", "delivered"].includes(status);
                }
                return true;
              })
              .map(([status, { text }]) => (
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
                        status === statusFilter
                          ? "all"
                          : (status as OrderStatus)
                      )
                    }
                  >
                    {text}
                  </Badge>
                </motion.div>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <OrderCardSkeleton key={index} />
          ))
        ) : (
          <AnimatePresence>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <motion.div
                  key={order.order_id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <OrderCard
                    order={order}
                    onClick={() => setSelectedOrder(order)}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                Nenhum pedido encontrado com os filtros selecionados.
              </div>
            )}
          </AnimatePresence>
        )}
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
};
