import { useMemo } from "react";
import { Order, OrderStatus } from "../types";

const statusPriority: Record<OrderStatus, number> = {
  pending: 1,
  confirmed: 2,
  preparing: 3,
  out_for_delivery: 4,
  delivered: 5,
  completed: 6,
  cancelled: 7,
};

export const useFilteredOrders = (
  orders: Order[],
  orderTypeFilter: "all" | "delivery" | "pickup",
  statusFilter: OrderStatus | "all",
  searchTerm: string
) => {
  const filteredAndSortedOrders = useMemo(() => {
    return orders
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
  }, [orders, orderTypeFilter, statusFilter, searchTerm]);

  return filteredAndSortedOrders;
};
