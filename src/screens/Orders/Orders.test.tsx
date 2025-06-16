import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { vi } from "vitest";
import { Orders } from "./Orders";
import * as api from "../../services/api";
import { Order } from "../../types";

// Mock dos dados de pedidos
const mockOrders: Order[] = [
  {
    order_id: "1",
    created_at: new Date().toISOString(),
    status: "pending",
    total_amount: 100,
    order_type: "delivery",
    order_items: [
      { name: "Burger", quantity: 2, price: 25 },
      { name: "Fries", quantity: 1, price: 10 },
    ],
    customer: { name: "John Doe" },
    address: { street: "123 Main St", number: "1", city: "Anytown" },
  },
  {
    order_id: "2",
    created_at: new Date().toISOString(),
    status: "confirmed",
    total_amount: 50,
    order_type: "pickup",
    order_items: [{ name: "Pizza", quantity: 1, price: 50 }],
    customer: { name: "Jane Smith" },
    address: null,
  },
  {
    order_id: "3",
    created_at: new Date().toISOString(),
    status: "pending",
    total_amount: 25,
    order_type: "pickup",
    order_items: [{ name: "Coke", quantity: 1, price: 25 }],
    customer: { name: "Peter Jones" },
    address: null,
  },
];

// Mock das funções da API
vi.mock("../../services/api");
const mockedApi = vi.mocked(api);

describe("Orders Screen", () => {
  beforeEach(() => {
    // Resetar mocks antes de cada teste
    vi.resetAllMocks();
  });

  test("deve renderizar a lista de pedidos corretamente", async () => {
    // Configura o mock para getOrders
    mockedApi.getOrders.mockResolvedValue(mockOrders);

    render(<Orders />);

    // Verifica se o estado de carregamento é exibido
    expect(screen.getByText(/Carregando pedidos.../i)).toBeInTheDocument();

    // Aguarda a renderização dos pedidos
    await waitFor(() => {
      // Verifica se os cards de pedido estão na tela
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
      expect(screen.getByText(/Peter Jones/i)).toBeInTheDocument();
    });

    // Verifica se o estado de carregamento desapareceu
    expect(
      screen.queryByText(/Carregando pedidos.../i)
    ).not.toBeInTheDocument();
  });

  test("deve filtrar pedidos por tipo 'delivery'", async () => {
    mockedApi.getOrders.mockResolvedValue(mockOrders);
    render(<Orders />);

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    // Clica no filtro "Delivery"
    fireEvent.click(screen.getByRole("button", { name: /Delivery/i }));

    // Apenas o pedido de delivery deve ser visível
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.queryByText(/Jane Smith/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Peter Jones/i)).not.toBeInTheDocument();
  });

  test("deve filtrar pedidos por tipo 'retirada'", async () => {
    mockedApi.getOrders.mockResolvedValue(mockOrders);
    render(<Orders />);

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    // Clica no filtro "Retirada"
    fireEvent.click(screen.getByRole("button", { name: /Retirada/i }));

    // Apenas os pedidos de retirada devem ser visíveis
    expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
    expect(screen.getByText(/Peter Jones/i)).toBeInTheDocument();
  });

  test("deve filtrar pedidos por status 'pendentes'", async () => {
    mockedApi.getOrders.mockResolvedValue(mockOrders);
    render(<Orders />);

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    // Clica no filtro "Pendentes"
    fireEvent.click(screen.getByRole("button", { name: /Pendentes/i }));

    // Apenas os pedidos pendentes devem ser visíveis
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.queryByText(/Jane Smith/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Peter Jones/i)).toBeInTheDocument();
  });

  test("deve atualizar o status de um pedido", async () => {
    mockedApi.getOrders.mockResolvedValue(mockOrders);
    // Mock da função de atualização para retornar o pedido com o novo status
    mockedApi.updateOrderStatus.mockImplementation(
      async (orderId, newStatus) => {
        const order = mockOrders.find((o) => o.order_id === orderId);
        if (order) {
          return { ...order, status: newStatus };
        }
        throw new Error("Order not found");
      }
    );

    render(<Orders />);

    // Aguarda a renderização inicial
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    // Encontra o botão para atualizar o status do primeiro pedido (John Doe)
    // O próximo status de "pending" para "delivery" é "confirmed"
    const orderCard = screen
      .getByText(/John Doe/i)
      .closest('div[class*="bg-white"]') as HTMLElement;
    if (!orderCard) throw new Error("Card do pedido não encontrado");

    const updateButton = within(orderCard).getByRole("button", {
      name: /Marcar como Confirmado/i,
    });
    fireEvent.click(updateButton);

    // Verifica se a API foi chamada e aguarda a atualização da UI
    await waitFor(() => {
      expect(mockedApi.updateOrderStatus).toHaveBeenCalledWith(
        "1",
        "confirmed"
      );
      // A UI deve refletir a mudança. O botão de "Marcar como Confirmado" deve sumir
      // dentro do card específico.
      expect(
        within(orderCard).queryByRole("button", {
          name: /Marcar como Confirmado/i,
        })
      ).not.toBeInTheDocument();
    });

    // Verifica se o novo botão "Marcar como Preparando" apareceu no card.
    expect(
      await within(orderCard).findByRole("button", {
        name: /Marcar como Preparando/i,
      })
    ).toBeInTheDocument();
  });

  test("deve exibir mensagem de erro se a busca de pedidos falhar", async () => {
    const errorMessage = "Falha na conexão com a API";
    mockedApi.getOrders.mockRejectedValue(new Error(errorMessage));

    render(<Orders />);

    await waitFor(() => {
      expect(screen.getByText(/Ocorreu um erro:/i)).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(errorMessage, "i"))
      ).toBeInTheDocument();
    });
  });
});
