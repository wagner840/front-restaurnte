import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { OrderDetailsModal } from "../../components/orders/OrderDetailsModal";
import { getOrders } from "../../services/orderService";
import { Order, OrderStatus } from "../../types";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { OrderCard } from "../../components/orders/OrderCard";
import { OrderCardSkeleton } from "../../components/orders/OrderCardSkeleton";
import { CreateOrderModal } from "../../components/orders/CreateOrderModal";
import { useFilteredOrders } from "../../hooks/useFilteredOrders";
import { OrderFilters } from "../../components/orders/OrderFilters";
import { useRealtimeOrders } from "../../hooks/useRealtimeOrders";

export const Orders: React.FC = () => {
  const [orderTypeFilter, setOrderTypeFilter] = useState<
    "all" | "delivery" | "pickup"
  >("all");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useRealtimeOrders();

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    refetchInterval: 30000,
  });

  const filteredOrders = useFilteredOrders(
    orders,
    orderTypeFilter,
    statusFilter,
    searchTerm
  );

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

      <OrderFilters
        orderTypeFilter={orderTypeFilter}
        setOrderTypeFilter={setOrderTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div style={{ columnWidth: "320px", columnGap: "0.75rem" }}>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <OrderCardSkeleton key={index} />
          ))
        ) : (
          <AnimatePresence>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <motion.div
                  style={{ breakInside: "avoid", marginBottom: "0.75rem" }}
                  key={order.order_id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <OrderCard
                    order={order}
                    onClick={() => setSelectedOrder(order)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-10 text-center text-muted-foreground"
              >
                Nenhum pedido encontrado com os filtros selecionados.
              </motion.div>
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
