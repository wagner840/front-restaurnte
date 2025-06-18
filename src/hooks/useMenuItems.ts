import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../services/menuService";
import { MenuItem } from "../types";
import { toast } from "sonner";

export const useMenuItems = () => {
  return useQuery<MenuItem[], Error>({
    queryKey: ["menuItems"],
    queryFn: getMenuItems,
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation<MenuItem, Error, Omit<MenuItem, "id" | "created_at">>({
    mutationFn: addMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success("Item criado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Falha ao criar item: ${error.message}`);
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation<
    MenuItem,
    Error,
    { id: string; updates: Partial<Omit<MenuItem, "id" | "created_at">> }
  >({
    mutationFn: (variables) => updateMenuItem(variables.id, variables.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success("Item atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Falha ao atualizar item: ${error.message}`);
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    string,
    { previousMenuItems: MenuItem[] | undefined }
  >({
    mutationFn: deleteMenuItem,
    onMutate: async (deletedItemId) => {
      await queryClient.cancelQueries({ queryKey: ["menuItems"] });

      const previousMenuItems = queryClient.getQueryData<MenuItem[]>([
        "menuItems",
      ]);

      queryClient.setQueryData<MenuItem[]>(["menuItems"], (old) =>
        old ? old.filter((item) => item.id !== deletedItemId) : []
      );

      toast.success("Item excluído com sucesso!");

      return { previousMenuItems };
    },
    onError: (err, _deletedItemId, context) => {
      if (context?.previousMenuItems) {
        queryClient.setQueryData(["menuItems"], context.previousMenuItems);
      }
      toast.error(`Falha ao excluir item: ${err.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
};
