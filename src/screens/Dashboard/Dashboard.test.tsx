import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { Dashboard } from "./Dashboard";
import * as api from "../../services/api";
import { Order, DashboardStats } from "../../types";
import { SalesByCategoryData } from "../../components/dashboard/SalesByCategoryChart";

// Mock das funções da API
vi.mock("../../services/api");

const mockStats: DashboardStats = {
  totalOrders: 10,
  revenue: 1500.5,
  activeOrders: 3,
  completedOrders: 7,
};

const mockOrders: Order[] = [
  {
    order_id: "1",
    customer: { name: "João Silva" },
    total_amount: 150.0,
    status: "completed",
    created_at: new Date().toISOString(),
    order_items: [
      { item_name: "Hambúrguer", quantity: 2, price: 25.0, name: "Hambúrguer" },
    ],
    order_type: "delivery",
    address: { street: "Rua A", number: "123", city: "Cidade" },
  },
  {
    order_id: "2",
    customer: { name: "Maria Oliveira" },
    total_amount: 80.0,
    status: "pending",
    created_at: new Date().toISOString(),
    order_items: [
      { item_name: "Pizza", quantity: 1, price: 40.0, name: "Pizza" },
    ],
    order_type: "pickup",
    address: null,
  },
];

const mockSalesByCategory: SalesByCategoryData[] = [
  { category: "Lanches", amount: 1200 },
  { category: "Bebidas", amount: 300.5 },
];

describe("Dashboard", () => {
  beforeEach(() => {
    // Resetar mocks antes de cada teste
    vi.resetAllMocks();

    // Configurar o retorno mockado para cada função da API
    vi.spyOn(api, "getDashboardStats").mockResolvedValue(mockStats);
    vi.spyOn(api, "getOrders").mockResolvedValue(mockOrders);
    vi.spyOn(api, "getSalesByCategory").mockResolvedValue(mockSalesByCategory);
    vi.spyOn(api, "getActiveCustomers").mockResolvedValue(25);
    vi.spyOn(api, "getRevenueGrowth").mockResolvedValue(15.5);
  });

  it("deve renderizar os cards de estatísticas com os dados corretos", async () => {
    render(<Dashboard onTabChange={vi.fn()} />);

    // Espera que o loading desapareça
    await waitFor(() => {
      expect(
        screen.queryByText(/Carregando dados do dashboard.../i)
      ).not.toBeInTheDocument();
    });

    // Verifica os StatsCards
    expect(screen.getByText("Pedidos Hoje")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();

    expect(screen.getByText("Receita Hoje")).toBeInTheDocument();
    expect(screen.getByText("R$ 1500.50")).toBeInTheDocument();

    expect(screen.getByText("Pedidos Ativos")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    expect(screen.getByText("Taxa de Conclusão")).toBeInTheDocument();
    // (7 / 10) * 100 = 70%
    expect(screen.getByText("70%")).toBeInTheDocument();
  });

  it("deve renderizar a lista de pedidos recentes", async () => {
    render(<Dashboard onTabChange={vi.fn()} />);

    await waitFor(() => {
      expect(
        screen.queryByText(/Carregando dados do dashboard.../i)
      ).not.toBeInTheDocument();
    });

    // Verifica se o componente de pedidos recentes está na tela
    expect(screen.getByText("Pedidos Recentes")).toBeInTheDocument();

    // Verifica se os pedidos mockados são exibidos
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Maria Oliveira")).toBeInTheDocument();
  });

  it("deve renderizar o gráfico de vendas por categoria", async () => {
    render(<Dashboard onTabChange={vi.fn()} />);

    await waitFor(() => {
      expect(
        screen.queryByText(/Carregando dados do dashboard.../i)
      ).not.toBeInTheDocument();
    });

    // Verifica se o título do gráfico está visível
    expect(screen.getByText("Vendas por Categoria")).toBeInTheDocument();
  });
});
