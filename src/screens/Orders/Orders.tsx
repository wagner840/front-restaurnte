import React, { useState, useEffect } from "react";
import { OrderCard } from "../../components/orders/OrderCard";
import { getOrders, updateOrderStatus } from "../../services/api";
import { Order } from "../../types";

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderTypeFilter, setOrderTypeFilter] = useState<
    "all" | "delivery" | "pickup"
  >("all");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">(
    "all"
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrders();
        setOrders(data);
      } catch (err: any) {
        console.error("Erro detalhado ao buscar pedidos:", err);
        setError(
          `Falha ao carregar os pedidos: ${err.message || "Erro desconhecido."}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) =>
          order.order_id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const filteredOrders = orders
    .filter(
      (order) =>
        orderTypeFilter === "all" || order.order_type === orderTypeFilter
    )
    .filter((order) => statusFilter === "all" || order.status === statusFilter);

  const statusCounts = orders.reduce((acc, order) => {
    if (orderTypeFilter === "all" || order.order_type === orderTypeFilter) {
      acc[order.status] = (acc[order.status] || 0) + 1;
      acc.all = (acc.all || 0) + 1;
    }
    return acc;
  }, {} as Record<Order["status"] | "all", number>);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111416] mb-2">Pedidos</h1>
        <p className="text-[#607589]">
          Gerencie todos os pedidos do restaurante
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filtro de Tipo de Pedido */}
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-gray-500">
            Tipo de Pedido
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "Todos" },
              { key: "delivery", label: "Delivery" },
              { key: "pickup", label: "Retirada" },
            ].map((type) => (
              <button
                key={type.key}
                onClick={() => setOrderTypeFilter(type.key as any)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  orderTypeFilter === type.key
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-800 hover:opacity-80"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtro de Status do Pedido */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-gray-500">
          Status do Pedido
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "Todos" },
            { key: "pending", label: "Pendentes" },
            { key: "confirmed", label: "Confirmados" },
            { key: "preparing", label: "Preparando" },
            { key: "out_for_delivery", label: "Em Entrega" },
            { key: "delivered", label: "Entregues" },
            { key: "completed", label: "Concluídos" },
            { key: "cancelled", label: "Cancelados" },
          ].map((status) => (
            <button
              key={status.key}
              onClick={() => setStatusFilter(status.key as any)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === status.key
                  ? "bg-[#0c7ff2] text-white"
                  : "bg-gray-100 text-gray-800 hover:opacity-80"
              }`}
            >
              {status.label} (
              {statusCounts[status.key as keyof typeof statusCounts] || 0})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-[#607589] text-lg">Carregando pedidos...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-semibold">Ocorreu um erro:</p>
          <p className="text-red-500 mt-2">{error}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#607589] text-lg">Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.order_id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};
