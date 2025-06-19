import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./button";

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = "Ocorreu um Erro",
  message,
  onRetry,
}) => {
  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center bg-red-50 border border-red-200 p-6 rounded-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
          <p className="text-red-700 mb-4">{message}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="destructive">
              Tentar Novamente
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
