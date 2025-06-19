import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "./useToast";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Verifica o estado inicial da autenticação
    const checkInitialAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialAuth();

    // Inscreve para mudanças no estado de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (process.env.NODE_ENV === "development") {
        console.debug("Evento de autenticação:", event);
      }

      switch (event) {
        case "SIGNED_IN":
          setIsAuthenticated(true);
          showToast("Login realizado com sucesso!", undefined, "success");
          break;
        case "SIGNED_OUT":
          setIsAuthenticated(false);
          showToast("Logout realizado com sucesso!", undefined, "default");
          break;
        case "TOKEN_REFRESHED":
          // Não precisa fazer nada, apenas manter a sessão atualizada
          break;
        case "USER_UPDATED":
          showToast("Dados do usuário atualizados!", undefined, "success");
          break;
        case "USER_DELETED":
          setIsAuthenticated(false);
          showToast("Conta removida com sucesso!", undefined, "default");
          break;
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
      subscription.unsubscribe();
    };
  }, [showToast]);

  return { isAuthenticated, isLoading };
}
