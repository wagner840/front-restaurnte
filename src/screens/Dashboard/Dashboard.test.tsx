import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Dashboard } from "./Dashboard";
import { useDashboardData } from "../../hooks/useDashboardData";
import { DashboardStats } from "../../types";
import React from "react";

// Mock do hook useDashboardData
jest.mock("../../hooks/useDashboardData");
const mockedUseDashboardData = useDashboardData as jest.Mock;

// Mock dos componentes filhos para focar no teste do Dashboard
jest.mock("../../components/dashboard/StatsCard", () => ({
  StatsCard: ({ title, value }: { title: string; value: string | number }) => (
    <div data-testid="stats-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  ),
}));

jest.mock("../../components/dashboard/SalesByCategoryChart", () => ({
  SalesByCategoryChart: ({ isLoading }: { isLoading: boolean }) => (
    <div data-testid="sales-chart">
      {isLoading ? "Loading Chart..." : "Chart Data"}
    </div>
  ),
}));

jest.mock("../../components/dashboard/RecentOrders", () => ({
  RecentOrders: ({ isLoading }: { isLoading: boolean }) => (
    <div data-testid="recent-orders">
      {isLoading ? "Loading Orders..." : "Orders List"}
    </div>
  ),
}));

const mockDashboardData: DashboardStats = {
  totalSales: 12500.5,
  totalOrders: 342,
  averageTicket: 36.55,
  activeCustomers: 150,
  salesTrend: 12.5,
  salesByCategory: [{ category: "Pizzas", amount: 8000, quantity: 150 }],
  recentOrders: [
    {
      order_id: "1",
      customer_name: "John Doe",
      total_amount: 50,
      status: "completed",
      created_at: new Date().toISOString(),
    },
  ],
};

const renderDashboard = () => {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
};

describe("Dashboard Screen", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display skeletons while loading", () => {
    mockedUseDashboardData.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    renderDashboard();

    // Verifica se os skeletons dos cards de estatísticas estão presentes
    const statSkeletons = screen.getAllByRole("generic", { name: "" });
    expect(
      statSkeletons.filter((s) => s.classList.contains("h-32")).length
    ).toBe(4);

    // Verifica se os componentes de gráfico e pedidos recentes mostram o estado de carregamento
    expect(screen.getByTestId("sales-chart")).toHaveTextContent(
      "Loading Chart..."
    );
    expect(screen.getByTestId("recent-orders")).toHaveTextContent(
      "Loading Orders..."
    );
  });

  it("should display dashboard data on successful fetch", () => {
    mockedUseDashboardData.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    });

    renderDashboard();

    // Verifica se os cards de estatísticas são renderizados com os dados corretos
    expect(screen.getByText("Vendas Totais")).toBeInTheDocument();
    expect(screen.getByText("R$ 12.500,50")).toBeInTheDocument();

    expect(screen.getByText("Pedidos")).toBeInTheDocument();
    expect(screen.getByText("342")).toBeInTheDocument();

    // Verifica se os componentes de gráfico e pedidos recentes renderizam seus dados
    expect(screen.getByTestId("sales-chart")).toHaveTextContent("Chart Data");
    expect(screen.getByTestId("recent-orders")).toHaveTextContent(
      "Orders List"
    );
  });

  it("should display zeroed or empty states when data is not available", () => {
    mockedUseDashboardData.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Failed to fetch"), // Simula um erro
    });

    renderDashboard();

    // Mesmo com erro, o componente deve renderizar com valores padrão
    expect(screen.getByText("Vendas Totais")).toBeInTheDocument();
    expect(screen.getByText("R$ 0,00")).toBeInTheDocument();

    expect(screen.getByText("Pedidos")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();

    expect(screen.getByTestId("sales-chart")).toHaveTextContent("Chart Data");
    expect(screen.getByTestId("recent-orders")).toHaveTextContent(
      "Orders List"
    );
  });
});
