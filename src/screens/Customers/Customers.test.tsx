import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { Customers } from "./Customers";
import * as customerService from "../../services/customerService";
import { Customer, CustomerDetails } from "../../types";
import { vi, Mock } from "vitest";

// Mock para a API de serviços
vi.mock("../../services/customerService");

const mockCustomers: Customer[] = [
  {
    customer_id: "1",
    name: "João Silva",
    email: "joao.silva@example.com",
    whatsapp: "11999998888",
    created_at: new Date().toISOString(),
    birthday: "1990-01-15",
    unique_code: "JS123",
    birthday_status: "eligible",
    last_contacted_at: null,
    Is_Gift_Used: "Não",
    whatsapp_chat_id: null,
  },
  {
    customer_id: "2",
    name: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    whatsapp: "21988887777",
    created_at: new Date().toISOString(),
    birthday: "1985-05-20",
    unique_code: "MO456",
    birthday_status: "completed",
    last_contacted_at: null,
    Is_Gift_Used: "Sim",
    whatsapp_chat_id: null,
  },
];

const mockCustomerDetails: CustomerDetails = {
  totalOrders: 5,
  totalSpent: 450.75,
  favoriteDays: ["Sexta-feira", "Sábado"],
};

const newCustomer: Customer = {
  customer_id: "3",
  name: "Carlos Pereira",
  email: "carlos.p@example.com",
  whatsapp: "31977776666",
  created_at: new Date().toISOString(),
  birthday: "1992-03-10",
  unique_code: "CP789",
  birthday_status: "eligible",
  last_contacted_at: null,
  Is_Gift_Used: "Não",
  whatsapp_chat_id: null,
};

describe("Customers Screen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (customerService.getCustomers as Mock).mockResolvedValue([
      ...mockCustomers,
    ]);
    (customerService.getCustomerDetails as Mock).mockResolvedValue(
      mockCustomerDetails
    );
    (customerService.addCustomer as Mock).mockResolvedValue(newCustomer);
  });

  test("deve renderizar a lista de clientes", async () => {
    render(<Customers />);
    await waitFor(() => {
      expect(screen.getByText("João Silva")).toBeInTheDocument();
      expect(screen.getByText("Maria Oliveira")).toBeInTheDocument();
    });
  });

  test("deve filtrar clientes por nome", async () => {
    render(<Customers />);
    await waitFor(() =>
      expect(screen.getByText("João Silva")).toBeInTheDocument()
    );

    const searchInput = screen.getByPlaceholderText(
      "Buscar clientes por nome ou e-mail..."
    );
    fireEvent.change(searchInput, { target: { value: "João" } });

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.queryByText("Maria Oliveira")).not.toBeInTheDocument();
  });

  test("deve filtrar clientes por e-mail", async () => {
    render(<Customers />);
    await waitFor(() =>
      expect(screen.getByText("João Silva")).toBeInTheDocument()
    );

    const searchInput = screen.getByPlaceholderText(
      "Buscar clientes por nome ou e-mail..."
    );
    fireEvent.change(searchInput, {
      target: { value: "maria.oliveira@example.com" },
    });

    expect(screen.getByText("Maria Oliveira")).toBeInTheDocument();
    expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
  });

  test("deve abrir o modal, adicionar um novo cliente e exibi-lo na lista", async () => {
    // Mock a chamada getCustomers para retornar a nova lista após a adição
    (customerService.getCustomers as Mock)
      .mockResolvedValueOnce([...mockCustomers])
      .mockResolvedValueOnce([...mockCustomers, newCustomer]);

    render(<Customers />);
    await waitFor(() =>
      expect(screen.getByText("João Silva")).toBeInTheDocument()
    );

    // Abrir o modal
    const addButton = screen.getByRole("button", {
      name: /adicionar cliente/i,
    });
    fireEvent.click(addButton);

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByRole("heading", { name: /adicionar novo cliente/i })
    ).toBeInTheDocument();

    // Preencher o formulário
    fireEvent.change(within(dialog).getByLabelText("Nome"), {
      target: { value: newCustomer.name },
    });
    fireEvent.change(within(dialog).getByLabelText("WhatsApp"), {
      target: { value: newCustomer.whatsapp },
    });
    fireEvent.change(within(dialog).getByLabelText(/email/i), {
      target: { value: newCustomer.email as string },
    });

    // Salvar
    const saveButton = within(dialog).getByRole("button", {
      name: /salvar cliente/i,
    });
    fireEvent.click(saveButton);

    // Verificar se o novo cliente aparece na lista
    await waitFor(() => {
      expect(screen.getByText("Carlos Pereira")).toBeInTheDocument();
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("deve abrir o modal de detalhes do cliente e exibir as informações", async () => {
    render(<Customers />);
    await waitFor(() =>
      expect(screen.getByText("João Silva")).toBeInTheDocument()
    );

    // Encontrar todos os botões "Ver Detalhes"
    const detailButtons = screen.getAllByRole("button", {
      name: /ver detalhes/i,
    });
    fireEvent.click(detailButtons[0]); // Clica no botão do primeiro cliente (João Silva)

    // Esperar o modal de detalhes aparecer
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    // Verificar se os detalhes mockados são exibidos
    await waitFor(() => {
      expect(
        within(dialog).getByText(mockCustomerDetails.totalOrders.toString())
      ).toBeInTheDocument();
      expect(
        within(dialog).getByText(
          `R$ ${mockCustomerDetails.totalSpent.toFixed(2)}`
        )
      ).toBeInTheDocument();
      expect(
        within(dialog).getByText(mockCustomerDetails.favoriteDays[0])
      ).toBeInTheDocument();
    });
  });
});
