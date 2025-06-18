import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDashboardData } from "./useDashboardData";
import { getDashboardStats } from "../services/dashboardService";
import { DashboardStats } from "../types";
import React from "react";

// Mock do serviço de dashboard
jest.mock("../services/dashboardService");
const mockedGetDashboardStats = getDashboardStats as jest.Mock;

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

const mockDashboardData: DashboardStats = {
  totalSales: 5000,
  totalOrders: 100,
  averageTicket: 50,
  activeCustomers: 20,
  salesTrend: 15,
  salesByCategory: [
    { category: "Pizzas", amount: 3000, quantity: 60 },
    { category: "Bebidas", amount: 2000, quantity: 40 },
  ],
  recentOrders: [
    {
      order_id: "1",
      customer_name: "John Doe",
      total_amount: 75.5,
      status: "completed",
      created_at: new Date().toISOString(),
    },
  ],
};

describe("useDashboardData", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return dashboard stats on success", async () => {
    mockedGetDashboardStats.mockResolvedValue(mockDashboardData);

    const { result } = renderHook(() => useDashboardData(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.data).toBeDefined());

    expect(result.current.data).toEqual(mockDashboardData);
    expect(result.current.error).toBe(null);
  });

  it("should return isLoading as true initially", () => {
    mockedGetDashboardStats.mockResolvedValue(mockDashboardData);
    const { result } = renderHook(() => useDashboardData(), { wrapper });
    expect(result.current.isLoading).toBe(true);
  });

  it("should handle errors when fetching dashboard data", async () => {
    const mockError = new Error("Failed to fetch dashboard data");
    mockedGetDashboardStats.mockRejectedValue(mockError);

    const { result } = renderHook(() => useDashboardData(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.error).not.toBe(null));

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeUndefined();
  });
});
