import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "../services/orderService";
import { Order, OrderStatus } from "../types";
import { toast } from "sonner";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Order,
    Error,
    { orderId: string; newStatus: OrderStatus },
    { previousOrders: Order[] | undefined }
  >({
    mutationFn: ({ orderId, newStatus }) =>
      updateOrderStatus(orderId, newStatus),
    onMutate: async ({ orderId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });

      const previousOrders = queryClient.getQueryData<Order[]>(["orders"]);

      queryClient.setQueryData<Order[]>(["orders"], (old) =>
        old
          ? old.map((order) =>
              order.order_id === orderId
                ? { ...order, status: newStatus }
                : order
            )
          : []
      );

      return { previousOrders };
    },
    onError: (err, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(["orders"], context.previousOrders);
      }
      toast.error(`Falha ao atualizar status: ${err.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
