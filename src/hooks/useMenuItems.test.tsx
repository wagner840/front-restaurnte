import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
} from "./useMenuItems";
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../services/menuService";
import { toast } from "sonner";
import { MenuItem } from "../types";
import React from "react";

// Mock do serviço de menu
jest.mock("../services/menuService");
const mockedGetMenuItems = getMenuItems as jest.Mock;
const mockedAddMenuItem = addMenuItem as jest.Mock;
const mockedUpdateMenuItem = updateMenuItem as jest.Mock;
const mockedDeleteMenuItem = deleteMenuItem as jest.Mock;

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
        retry: false,
        gcTime: Infinity, // Prevent garbage collection during tests
      },
    },
  });

const wrapper =
  (client: QueryClient) =>
  ({ children }: { children: React.ReactNode }) =>
    <QueryClientProvider client={client}>{children}</QueryClientProvider>;

const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Pizza Margherita",
    description: "Classic pizza with tomato and mozzarella",
    price: 25.5,
    category: "Pizzas",
    image: null,
    available: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Spaghetti Carbonara",
    description: "Pasta with eggs, cheese, and bacon",
    price: 30.0,
    category: "Pastas",
    image: null,
    available: true,
    created_at: new Date().toISOString(),
  },
];

describe("useMenuItems Hooks", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe("useMenuItems", () => {
    it("should return a list of menu items on success", async () => {
      mockedGetMenuItems.mockResolvedValue(mockMenuItems);

      const { result } = renderHook(() => useMenuItems(), {
        wrapper: wrapper(queryClient),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockMenuItems);
      expect(result.current.isLoading).toBe(false);
    });

    it("should handle errors when fetching menu items", async () => {
      const mockError = new Error("Failed to fetch items");
      mockedGetMenuItems.mockRejectedValue(mockError);

      const { result } = renderHook(() => useMenuItems(), {
        wrapper: wrapper(queryClient),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(mockError);
    });
  });

  describe("useCreateMenuItem", () => {
    it("should call addMenuItem and invalidate queries on success", async () => {
      const newItem: Omit<MenuItem, "id" | "created_at"> = {
        name: "New Dish",
        description: "A brand new dish",
        price: 15,
        category: "New",
        image: null,
        available: true,
      };
      const createdItem = {
        ...newItem,
        id: "3",
        created_at: new Date().toISOString(),
      };
      mockedAddMenuItem.mockResolvedValue(createdItem);
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useCreateMenuItem(), {
        wrapper: wrapper(queryClient),
      });

      act(() => {
        result.current.mutate(newItem);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedAddMenuItem).toHaveBeenCalledWith(newItem);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["menuItems"],
      });
      expect(toast.success).toHaveBeenCalledWith("Item criado com sucesso!");
    });
  });

  describe("useUpdateMenuItem", () => {
    it("should call updateMenuItem and invalidate queries on success", async () => {
      const updates = { name: "Updated Pizza Name" };
      const updatedItem = { ...mockMenuItems[0], ...updates };
      mockedUpdateMenuItem.mockResolvedValue(updatedItem);
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useUpdateMenuItem(), {
        wrapper: wrapper(queryClient),
      });

      act(() => {
        result.current.mutate({ id: "1", updates });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedUpdateMenuItem).toHaveBeenCalledWith("1", updates);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["menuItems"],
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Item atualizado com sucesso!"
      );
    });
  });

  describe("useDeleteMenuItem", () => {
    it("should optimistically remove item and invalidate queries", async () => {
      mockedDeleteMenuItem.mockResolvedValue(undefined);
      queryClient.setQueryData(["menuItems"], mockMenuItems);
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useDeleteMenuItem(), {
        wrapper: wrapper(queryClient),
      });

      act(() => {
        result.current.mutate("1");
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Item excluído com sucesso!"
        );
      });

      // Check optimistic update
      const dataInCache = queryClient.getQueryData<MenuItem[]>(["menuItems"]);
      expect(dataInCache?.find((item) => item.id === "1")).toBeUndefined();
      expect(dataInCache?.length).toBe(1);

      await waitFor(() => {
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({
          queryKey: ["menuItems"],
        });
      });
    });

    it("should revert optimistic update on error", async () => {
      const mockError = new Error("Deletion failed");
      mockedDeleteMenuItem.mockRejectedValue(mockError);
      queryClient.setQueryData(["menuItems"], mockMenuItems);

      const { result } = renderHook(() => useDeleteMenuItem(), {
        wrapper: wrapper(queryClient),
      });

      act(() => {
        result.current.mutate("1");
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(toast.error).toHaveBeenCalledWith(
        `Falha ao excluir item: ${mockError.message}`
      );

      // Check if data is reverted
      const dataInCache = queryClient.getQueryData<MenuItem[]>(["menuItems"]);
      expect(dataInCache).toEqual(mockMenuItems);
    });
  });
});
