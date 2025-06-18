import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Customers } from "./Customers";
import { useCustomers, useCreateCustomer } from "../../hooks/useCustomers";
import { Customer } from "../../types";
import React from "react";

// Mock dos hooks
jest.mock("../../hooks/useCustomers");
const mockedUseCustomers = useCustomers as jest.Mock;
const mockedUseCreateCustomer = useCreateCustomer as jest.Mock;

const mockCustomers: Customer[] = [
  {
    customer_id: "1",
    name: "Alice Johnson",
    whatsapp: "11987654321",
    email: "alice@example.com",
    birthday: "1990-05-15",
    unique_code: "ALICE123",
    birthday_status: "eligible",
    created_at: new Date().toISOString(),
    last_contacted_at: null,
    Is_Gift_Used: null,
    whatsapp_chat_id: null,
  },
  {
    customer_id: "2",
    name: "Bob Williams",
    whatsapp: "21912345678",
    email: "bob@example.com",
    birthday: "1988-10-20",
    unique_code: "BOB456",
    birthday_status: "booked",
    created_at: new Date().toISOString(),
    last_contacted_at: null,
    Is_Gift_Used: null,
    whatsapp_chat_id: null,
  },
];

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
);

describe("Customers Screen", () => {
  const mockMutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseCreateCustomer.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  it("should display a loader while fetching customers", () => {
    mockedUseCustomers.mockReturnValue({ data: [], isLoading: true });
    render(<Customers />, { wrapper });
    expect(
      screen.getByRole("alert", { name: /carregando/i })
    ).toBeInTheDocument();
  });

  it("should display an error message if fetching fails", () => {
    mockedUseCustomers.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    });
    render(<Customers />, { wrapper });
    expect(
      screen.getByText("Falha ao carregar os clientes.")
    ).toBeInTheDocument();
  });

  it("should display a list of customers", () => {
    mockedUseCustomers.mockReturnValue({
      data: mockCustomers,
      isLoading: false,
    });
    render(<Customers />, { wrapper });
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
  });

  it("should filter customers based on search term", () => {
    mockedUseCustomers.mockReturnValue({
      data: mockCustomers,
      isLoading: false,
    });
    render(<Customers />, { wrapper });

    const searchInput = screen.getByPlaceholderText(/buscar clientes/i);
    fireEvent.change(searchInput, { target: { value: "Alice" } });

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.queryByText("Bob Williams")).not.toBeInTheDocument();
  });

  it("should open the AddCustomerModal when 'Adicionar Cliente' is clicked", () => {
    mockedUseCustomers.mockReturnValue({ data: [], isLoading: false });
    render(<Customers />, { wrapper });

    const addButton = screen.getByRole("button", {
      name: /adicionar cliente/i,
    });
    fireEvent.click(addButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Adicionar Novo Cliente")).toBeInTheDocument();
  });

  it("should submit the form in AddCustomerModal and call the mutation", async () => {
    mockedUseCustomers.mockReturnValue({ data: [], isLoading: false });
    mockMutateAsync.mockResolvedValue({}); // Simula sucesso na mutação

    render(<Customers />, { wrapper });

    // Abre o modal
    fireEvent.click(screen.getByRole("button", { name: /adicionar cliente/i }));

    // Preenche o formulário
    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: "Charlie Brown" },
    });
    fireEvent.change(screen.getByLabelText(/whatsapp/i), {
      target: { value: "31999998888" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "charlie@example.com" },
    });

    // Clica em salvar
    const saveButton = screen.getByRole("button", { name: /salvar cliente/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledTimes(1);
      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Charlie Brown",
          whatsapp: "31999998888",
          email: "charlie@example.com",
        }),
        expect.any(Object) // Opções da mutação
      );
    });
  });
});
