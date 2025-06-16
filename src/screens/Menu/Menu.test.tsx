import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { Menu } from "./Menu";
import * as menuService from "../../services/menuService";
import { supabase } from "../../lib/supabaseClient";
import { MenuItem } from "../../types";
import { vi, Mock } from "vitest";

// Mock para a API de serviços
vi.mock("../../services/menuService");

// Mock para o Supabase
vi.mock("../../lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
  },
}));

const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Hambúrguer Clássico",
    description: "Pão, carne e queijo",
    price: 25.5,
    category: "Lanches",
    image: null,
    available: true,
  },
  {
    id: "2",
    name: "Batata Frita",
    description: "Porção de batatas crocantes",
    price: 15.0,
    category: "Acompanhamentos",
    image: null,
    available: true,
  },
  {
    id: "3",
    name: "Refrigerante",
    description: "Lata 350ml",
    price: 8.0,
    category: "Bebidas",
    image: null,
    available: true,
  },
];

describe("Menu Screen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (menuService.getMenuItems as Mock).mockResolvedValue([...mockMenuItems]);
  });

  test("deve renderizar a lista de itens do cardápio", async () => {
    render(<Menu />);
    await waitFor(() => {
      expect(screen.getByText("Hambúrguer Clássico")).toBeInTheDocument();
      expect(screen.getByText("Batata Frita")).toBeInTheDocument();
      expect(screen.getByText("Refrigerante")).toBeInTheDocument();
    });
  });

  test("deve filtrar itens por termo de busca", async () => {
    render(<Menu />);
    await waitFor(() =>
      expect(screen.getByText("Hambúrguer Clássico")).toBeInTheDocument()
    );
    const searchInput = screen.getByPlaceholderText("Buscar itens...");
    fireEvent.change(searchInput, { target: { value: "Hambúrguer" } });
    expect(screen.getByText("Hambúrguer Clássico")).toBeInTheDocument();
    expect(screen.queryByText("Batata Frita")).not.toBeInTheDocument();
  });

  test("deve filtrar itens por categoria", async () => {
    render(<Menu />);
    await waitFor(() =>
      expect(screen.getByText("Hambúrguer Clássico")).toBeInTheDocument()
    );
    const categorySelect = screen.getByRole("combobox");
    fireEvent.change(categorySelect, { target: { value: "Bebidas" } });
    expect(screen.getByText("Refrigerante")).toBeInTheDocument();
    expect(screen.queryByText("Hambúrguer Clássico")).not.toBeInTheDocument();
  });

  test("deve abrir o modal para adicionar um novo item", async () => {
    render(<Menu />);
    await waitFor(() =>
      expect(screen.getByText("Hambúrguer Clássico")).toBeInTheDocument()
    );
    const addButton = screen.getByText("Adicionar Item");
    fireEvent.click(addButton);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /adicionar item/i })
    ).toBeInTheDocument();
  });

  test("deve criar um novo item do cardápio", async () => {
    const newItem: MenuItem = {
      id: "4",
      name: "Pizza de Calabresa",
      description: "Molho, queijo e calabresa",
      price: 45.0,
      category: "Pizzas",
      image: null,
      available: true,
    };

    const fromMock = supabase.from as Mock;
    fromMock.mockImplementation(() => ({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: newItem, error: null }),
    }));

    render(<Menu />);
    await waitFor(() =>
      expect(screen.getByText("Hambúrguer Clássico")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole("button", { name: /adicionar item/i }));

    const dialog = await screen.findByRole("dialog");

    fireEvent.change(within(dialog).getByLabelText("Nome"), {
      target: { value: newItem.name },
    });
    fireEvent.change(within(dialog).getByLabelText("Descrição"), {
      target: { value: newItem.description },
    });
    fireEvent.change(within(dialog).getByLabelText("Preço"), {
      target: { value: newItem.price.toString() },
    });
    fireEvent.change(within(dialog).getByLabelText("Categoria"), {
      target: { value: newItem.category },
    });

    fireEvent.click(
      within(dialog).getByRole("button", { name: "Adicionar Item" })
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.getByText("Pizza de Calabresa")).toBeInTheDocument();
    });
  });

  test("deve editar um item do cardápio existente", async () => {
    const updatedItem: MenuItem = { ...mockMenuItems[0], price: 28.0 };

    const fromMock = supabase.from as Mock;
    fromMock.mockImplementation(() => ({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: updatedItem, error: null }),
    }));

    render(<Menu />);
    await waitFor(() =>
      expect(screen.getByText("Hambúrguer Clássico")).toBeInTheDocument()
    );

    const editButtons = await screen.findAllByRole("button", {
      name: /editar item/i,
    });
    fireEvent.click(editButtons[0]);

    const dialog = await screen.findByRole("dialog");

    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByRole("heading", { name: /editar item/i })
    ).toBeInTheDocument();

    const priceInput = within(dialog).getByLabelText("Preço");
    fireEvent.change(priceInput, { target: { value: "28.0" } });

    fireEvent.click(within(dialog).getByText("Salvar Alterações"));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.getByText("R$ 28.00")).toBeInTheDocument();
      expect(screen.queryByText("R$ 25.50")).not.toBeInTheDocument();
    });
  });

  test("deve deletar um item do cardápio (da UI)", async () => {
    render(<Menu />);
    await waitFor(() =>
      expect(screen.getByText("Hambúrguer Clássico")).toBeInTheDocument()
    );

    const deleteButtons = await screen.findAllByRole("button", {
      name: /deletar item/i,
    });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText("Hambúrguer Clássico")).not.toBeInTheDocument();
    });
  });
});
