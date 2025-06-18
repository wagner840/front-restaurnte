import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Menu } from "./Menu";
import {
  useMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
} from "../../hooks/useMenuItems";
import { MenuItem } from "../../types";
import React from "react";

// Mock dos hooks
jest.mock("../../hooks/useMenuItems");
const mockedUseMenuItems = useMenuItems as jest.Mock;
const mockedUseCreateMenuItem = useCreateMenuItem as jest.Mock;
const mockedUseUpdateMenuItem = useUpdateMenuItem as jest.Mock;
const mockedUseDeleteMenuItem = useDeleteMenuItem as jest.Mock;

// Mock do componente filho para facilitar a interação
jest.mock("../../components/menu/MenuItemCard", () => ({
  MenuItemCard: ({
    item,
    onEdit,
    onDelete,
  }: {
    item: MenuItem;
    onEdit: (item: MenuItem) => void;
    onDelete: (id: string) => void;
  }) => (
    <div data-testid={`menu-item-${item.id}`}>
      <h4>{item.name}</h4>
      <p>{item.category}</p>
      <button onClick={() => onEdit(item)}>Edit</button>
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </div>
  ),
}));

const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Pizza Calabresa",
    description: "Mussarela, calabresa e cebola",
    price: 45,
    category: "Pizzas",
    image: null,
    available: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Suco de Laranja",
    description: "Natural, 500ml",
    price: 8,
    category: "Bebidas",
    image: null,
    available: true,
    created_at: new Date().toISOString(),
  },
];

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
);

describe("Menu Screen", () => {
  const mockCreateMutate = jest.fn();
  const mockUpdateMutate = jest.fn();
  const mockDeleteMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseMenuItems.mockReturnValue({
      data: mockMenuItems,
      isLoading: false,
      isError: false,
    });
    mockedUseCreateMenuItem.mockReturnValue({
      mutate: mockCreateMutate,
      isPending: false,
    });
    mockedUseUpdateMenuItem.mockReturnValue({
      mutate: mockUpdateMutate,
      isPending: false,
    });
    mockedUseDeleteMenuItem.mockReturnValue({
      mutate: mockDeleteMutate,
      isPending: false,
    });
  });

  it("should display menu items", () => {
    render(<Menu />, { wrapper });
    expect(screen.getByText("Pizza Calabresa")).toBeInTheDocument();
    expect(screen.getByText("Suco de Laranja")).toBeInTheDocument();
  });

  it("should filter items by search term", () => {
    render(<Menu />, { wrapper });
    const searchInput = screen.getByPlaceholderText(/buscar itens/i);
    fireEvent.change(searchInput, { target: { value: "Pizza" } });
    expect(screen.getByText("Pizza Calabresa")).toBeInTheDocument();
    expect(screen.queryByText("Suco de Laranja")).not.toBeInTheDocument();
  });

  it("should filter items by category", () => {
    render(<Menu />, { wrapper });
    const categorySelect = screen.getByRole("combobox");
    fireEvent.change(categorySelect, { target: { value: "Bebidas" } });
    expect(screen.queryByText("Pizza Calabresa")).not.toBeInTheDocument();
    expect(screen.getByText("Suco de Laranja")).toBeInTheDocument();
  });

  it("should open modal to add a new item", async () => {
    render(<Menu />, { wrapper });
    fireEvent.click(screen.getByRole("button", { name: /adicionar item/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("Nome do item"), {
      target: { value: "Nova Torta" },
    });
    fireEvent.change(screen.getByPlaceholderText("0.00"), {
      target: { value: "25" },
    });
    fireEvent.change(screen.getByPlaceholderText("Categoria do item"), {
      target: { value: "Sobremesas" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Adicionar Item" }));

    expect(mockCreateMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Nova Torta",
        price: 25,
        category: "Sobremesas",
      }),
      expect.any(Object)
    );
  });

  it("should open modal to edit an item", async () => {
    render(<Menu />, { wrapper });
    const editButton = screen.getAllByRole("button", { name: "Edit" })[0];
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Pizza Calabresa")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("Nome do item"), {
      target: { value: "Pizza Calabresa Especial" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar Alterações" }));

    expect(mockUpdateMutate).toHaveBeenCalledWith(
      {
        id: "1",
        updates: expect.objectContaining({ name: "Pizza Calabresa Especial" }),
      },
      expect.any(Object)
    );
  });

  it("should call delete mutation when delete is clicked", () => {
    render(<Menu />, { wrapper });
    const deleteButton = screen.getAllByRole("button", { name: "Delete" })[0];
    fireEvent.click(deleteButton);
    expect(mockDeleteMutate).toHaveBeenCalledWith("1");
  });
});
