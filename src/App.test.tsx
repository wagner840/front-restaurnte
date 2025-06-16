import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { App } from "./App";
import { useAuth } from "./hooks/useAuth";

// Mock do hook useAuth e dos componentes filhos para isolar o teste do App
vi.mock("./hooks/useAuth");
vi.mock("./screens/Login", () => ({
  Login: () => <div>Login Screen</div>,
}));
vi.mock("./screens/MainApp/MainApp", () => ({
  MainApp: () => <div>Main App</div>,
}));

const mockUseAuth = useAuth as any;

describe("App Component", () => {
  it("deve renderizar a tela de Login se não estiver autenticado", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    render(<App />);
    expect(screen.getByText("Login Screen")).toBeInTheDocument();
  });

  it("deve renderizar a MainApp se estiver autenticado", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    render(<App />);
    expect(screen.getByText("Main App")).toBeInTheDocument();
  });

  it('deve renderizar a mensagem de "Carregando..." enquanto isLoading for true', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    render(<App />);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });
});
