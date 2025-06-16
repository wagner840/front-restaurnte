import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuth } from "./useAuth";
import { supabase } from "../lib/supabaseClient";

// Mock do cliente Supabase
vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

const mockUser = { id: "1", email: "test@example.com" };
const mockSession = { access_token: "token", user: mockUser };

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar o estado inicial corretamente", async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBe(null);
    expect(result.current.session).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("deve buscar a sessão e definir o usuário na inicialização", async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: mockSession },
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.session).not.toBeNull();
    });

    expect(supabase.auth.getSession).toHaveBeenCalled();
    expect(result.current.session).toEqual(mockSession);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it("deve realizar o login com sucesso", async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    // O estado é atualizado pelo onAuthStateChange, vamos simulá-lo
    const authCallback = (supabase.auth.onAuthStateChange as any).mock
      .calls[0][0];
    act(() => {
      authCallback("SIGNED_IN", mockSession);
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
    });
    expect(result.current.session).toEqual(mockSession);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("deve realizar o logout com sucesso", async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: mockSession },
    });
    (supabase.auth.signOut as any).mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.logout();
    });

    // O estado é atualizado pelo onAuthStateChange, vamos simulá-lo
    const authCallback = (supabase.auth.onAuthStateChange as any).mock
      .calls[0][0];
    act(() => {
      authCallback("SIGNED_OUT", null);
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(result.current.session).toBe(null);
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });
});
