import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Login } from "./Login";
import { useAuth } from "../../hooks/useAuth";

// Mock do hook useAuth
vi.mock("../../hooks/useAuth");

const mockLogin = vi.fn();

describe("Login Screen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockResolvedValue(undefined); // Garante que sempre retorne uma Promise

    (useAuth as any).mockReturnValue({
      login: mockLogin,
      user: null,
      isAuthenticated: false,
    });
  });

  it("deve renderizar o formulário de login", () => {
    render(<Login />);
    expect(screen.getByPlaceholderText("seu@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Entrar/i })).toBeInTheDocument();
  });

  it("deve chamar a função de login ao submeter o formulário", async () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const loginButton = screen.getByRole("button", { name: /Entrar/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("deve exibir uma mensagem de erro em caso de falha no login", async () => {
    const errorMessage = "Credenciais inválidas";
    mockLogin.mockRejectedValue(new Error(errorMessage));

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("deve desabilitar o botão de login durante o envio", async () => {
    mockLogin.mockImplementation(() => {
      return new Promise((resolve) => setTimeout(resolve, 150)); // Aumenta o tempo para garantir a detecção
    });

    render(<Login />);

    const loginButton = screen.getByRole("button", { name: /Entrar/i });

    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password" },
    });

    fireEvent.click(loginButton);

    // Aguarda o botão ser desabilitado e o texto mudar
    await waitFor(() => {
      expect(loginButton).toBeDisabled();
      expect(screen.getByText(/Entrando.../i)).toBeInTheDocument();
    });

    // Aguarda o botão ser habilitado novamente após a conclusão
    await waitFor(
      () => {
        expect(loginButton).not.toBeDisabled();
      },
      { timeout: 500 }
    );
  });
});
