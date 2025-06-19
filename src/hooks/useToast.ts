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
    (
      title: string,
      description?: string,
      variant: "default" | "success" | "warning" | "destructive" = "default",
      options: ToastOptions = { playSound: false }
    ) => {
      if (options.playSound && soundEnabled) {
        playNotificationSound();
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
    (customerName: string) => {
      showToast(
        "Novo Pedido Pendente!",
        `${customerName || "Cliente não identificado"} fez um novo pedido.`,
        "warning",
        { playSound: true }
      );
    },
    [showToast]
  );

  const showSuccessToast = useCallback(
    (message: string, description?: string) => {
      showToast(message, description, "success");
    },
    [showToast]
  );

  const showErrorToast = useCallback(
    (message: string, description?: string) => {
      showToast(message, description, "destructive");
    },
    [showToast]
  );

  const showWarningToast = useCallback(
    (message: string, description?: string) => {
      showToast(message, description, "warning");
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
