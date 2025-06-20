import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "./useToast";
import { User } from "@supabase/supabase-js";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { showToast } = useToast();

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  useEffect(() => {
    // Verifica o estado inicial da autenticação
    const checkInitialAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession(); // Acessa 'data' diretamente
        setIsAuthenticated(!!data?.session); // Usa optional chaining para acessar session
        setUser(data?.session?.user ?? null);
      } catch (error) {
        // Erro é silenciado intencionalmente
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialAuth();

    // Inscreve para mudanças no estado de autenticação
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // Corrige a desestruturação para obter 'data'
      // Mantém session aqui para o switch
      setUser(session?.user ?? null);
      if (process.env.NODE_ENV === "development") {
        // Silenciado para produção
      }

      switch (event) {
        case "SIGNED_IN":
          setIsAuthenticated(true);
          showToast("Login realizado com sucesso!", undefined, "success");
          // Adiciona um log para garantir que 'session' seja lido e satisfazer o TypeScript
          break;
        case "SIGNED_OUT":
          setIsAuthenticated(false);
          setUser(null);
          showToast("Logout realizado com sucesso!", undefined, "default");
          break;
        case "TOKEN_REFRESHED":
          // Não precisa fazer nada, apenas manter a sessão atualizada
          break;
        case "USER_UPDATED":
          showToast("Dados do usuário atualizados!", undefined, "success");
          break;
        // case "USER_REMOVED": // Removido pois não é um evento reconhecido pelo tipo AuthChangeEvent
        //   setIsAuthenticated(false);
        //   showToast("Conta removida com sucesso!", undefined, "default");
        //   break;
        case "PASSWORD_RECOVERY":
          showToast(
            "Recuperação de senha iniciada!",
            "Verifique seu email.",
            "warning"
          );
          break;
      }
    });

    return () => {
      data.subscription.unsubscribe(); // Acessa a subscription através de 'data'
    };
  }, [showToast]);

  return { isAuthenticated, isLoading, login, logout, user };
}
