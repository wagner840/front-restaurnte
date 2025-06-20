import { useCallback } from "react";
import { toast } from "sonner";
import { playNotificationSound } from "../lib/sounds";
import { useTheme } from "../contexts/ThemeContext";

interface ToastOptions {
  playSound?: boolean;
}

export function useToast() {
  const { soundEnabled } = useTheme();

  const showToast = useCallback(
    async (
      title: string,
      description?: string,
      variant: "default" | "success" | "warning" | "destructive" = "default",
      options: ToastOptions = { playSound: false }
    ) => {
      if (options.playSound && soundEnabled) {
        try {
          const soundPlayed = await playNotificationSound();
          if (!soundPlayed) {
            console.warn('Som de notificação não pôde ser reproduzido');
          }
        } catch (error) {
          console.error('Erro ao tentar reproduzir som:', error);
        }
      }

      const toastAction = {
        success: toast.success,
        warning: toast.warning,
        destructive: toast.error,
        default: toast,
      };

      toastAction[variant](title, {
        description,
        duration: variant === "warning" ? 6000 : 4000,
      });
    },
    [soundEnabled]
  );

  const showPendingOrderToast = useCallback(
    async (customerName: string) => {
      await showToast(
        "Novo Pedido Pendente!",
        `${customerName || "Cliente não identificado"} fez um novo pedido.`,
        "warning",
        { playSound: true }
      );
    },
    [showToast]
  );

  const showSuccessToast = useCallback(
    async (message: string, description?: string) => {
      await showToast(message, description, "success");
    },
    [showToast]
  );

  const showErrorToast = useCallback(
    async (message: string, description?: string) => {
      await showToast(message, description, "destructive");
    },
    [showToast]
  );

  const showWarningToast = useCallback(
    async (message: string, description?: string) => {
      await showToast(message, description, "warning");
    },
    [showToast]
  );

  return {
    showToast,
    showPendingOrderToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
  };
}
