import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "../services/orderService";
import { Order, OrderStatus } from "../types";
import { useToast } from "./useToast";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useToast();

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
    onSuccess: () => {
      showSuccessToast("Status do pedido atualizado com sucesso!");
    },
    onError: (err, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(["orders"], context.previousOrders);
      }
      showErrorToast("Falha ao atualizar status", err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // Invalida o cache dos produtos mais vendidos para atualizar automaticamente
      queryClient.invalidateQueries({ queryKey: ["topSellingProducts"] });
    },
  });
};
