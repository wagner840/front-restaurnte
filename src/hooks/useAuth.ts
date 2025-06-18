import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { Session, User } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const session = await authService.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Erro ao obter sessão:", error);
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    const authListener = authService.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await authService.signIn({ email, password });
      setSession(data.session);
      setUser(data.session?.user ?? null);
      return data;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  };

  return {
    user,
    session,
    isLoading,
    login,
    logout,
    isAuthenticated: !!session?.access_token,
  };
};
