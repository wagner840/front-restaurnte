import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomers,
  createCustomer,
  getCustomerDetails,
  getBirthdayCustomers,
} from "../services/customerService";
import { Customer, CustomerDetails } from "../types";
import { toast } from "sonner";

export const useCustomers = () => {
  return useQuery<Customer[], Error>({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });
};

export const useBirthdayCustomers = () => {
  return useQuery<Customer[], Error>({
    queryKey: ["birthdayCustomers"],
    queryFn: getBirthdayCustomers,
    initialData: [], // Garante que o valor seja sempre um array
  });
};

export const useCustomerDetails = (customerId: string | null) => {
  return useQuery<CustomerDetails, Error>({
    queryKey: ["customerDetails", customerId],
    queryFn: () => getCustomerDetails(customerId!),
    enabled: !!customerId,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Customer,
    Error,
    Omit<Customer, "customer_id" | "created_at">
  >({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente criado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Falha ao criar cliente: ${error.message}`);
    },
  });
};
