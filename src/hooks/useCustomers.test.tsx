import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCustomers, useCreateCustomer } from "./useCustomers";
import { getCustomers, createCustomer } from "../services/customerService";
import { toast } from "sonner";
import { Customer } from "../types";
import React from "react";

// Mock do serviço de cliente
jest.mock("../services/customerService");
const mockedGetCustomers = getCustomers as jest.Mock;
const mockedCreateCustomer = createCustomer as jest.Mock;

// Mock do 'sonner' para toasts
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Desativa retentativas para testes
      },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe("useCustomers Hooks", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("useCustomers", () => {
    it("should return a list of customers on success", async () => {
      const mockCustomers: Customer[] = [
        {
          customer_id: "1",
          name: "John Doe",
          whatsapp: "1234567890",
          email: "john.doe@example.com",
          birthday: "1990-01-01",
          unique_code: "UNIQUE123",
          birthday_status: "eligible",
          created_at: new Date().toISOString(),
          last_contacted_at: null,
          Is_Gift_Used: null,
          whatsapp_chat_id: null,
        },
        {
          customer_id: "2",
          name: "Jane Smith",
          whatsapp: "0987654321",
          email: "jane.smith@example.com",
          birthday: "1992-02-02",
          unique_code: "UNIQUE456",
          birthday_status: "eligible",
          created_at: new Date().toISOString(),
          last_contacted_at: null,
          Is_Gift_Used: null,
          whatsapp_chat_id: null,
        },
      ];
      mockedGetCustomers.mockResolvedValue(mockCustomers);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockCustomers);
      expect(result.current.isLoading).toBe(false);
      expect(mockedGetCustomers).toHaveBeenCalledTimes(1);
    });

    it("should return isLoading as true initially", () => {
      mockedGetCustomers.mockResolvedValue([]);
      const { result } = renderHook(() => useCustomers(), { wrapper });
      expect(result.current.isLoading).toBe(true);
    });

    it("should handle errors when fetching customers", async () => {
      const mockError = new Error("Failed to fetch");
      mockedGetCustomers.mockRejectedValue(mockError);

      const { result } = renderHook(() => useCustomers(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("useCreateCustomer", () => {
    it("should call createCustomer and invalidate queries on success", async () => {
      const queryClient = createTestQueryClient();
      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const newCustomer: Omit<Customer, "customer_id" | "created_at"> = {
        name: "New Customer",
        whatsapp: "1122334455",
        email: "new@test.com",
        birthday: null,
        unique_code: "NEW123",
        birthday_status: "eligible",
        last_contacted_at: null,
        Is_Gift_Used: null,
        whatsapp_chat_id: null,
      };
      const createdCustomer: Customer = {
        ...newCustomer,
        customer_id: "3",
        created_at: new Date().toISOString(),
      };
      mockedCreateCustomer.mockResolvedValue(createdCustomer);
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useCreateCustomer(), {
        wrapper: customWrapper,
      });

      result.current.mutate(newCustomer);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedCreateCustomer).toHaveBeenCalledWith(newCustomer);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["customers"],
      });
      expect(toast.success).toHaveBeenCalledWith("Cliente criado com sucesso!");
    });

    it("should show an error toast on mutation failure", async () => {
      const mockError = new Error("Creation failed");
      mockedCreateCustomer.mockRejectedValue(mockError);
      const newCustomer: Omit<Customer, "customer_id" | "created_at"> = {
        name: "New Customer",
        whatsapp: "1122334455",
        email: "new@test.com",
        birthday: null,
        unique_code: "NEW123",
        birthday_status: "eligible",
        last_contacted_at: null,
        Is_Gift_Used: null,
        whatsapp_chat_id: null,
      };

      const { result } = renderHook(() => useCreateCustomer(), { wrapper });

      result.current.mutate(newCustomer);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(toast.error).toHaveBeenCalledWith(
        `Falha ao criar cliente: ${mockError.message}`
      );
    });
  });
});
