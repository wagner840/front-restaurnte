import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 8,
  className,
}) => {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <Loader2 className={`h-${size} w-${size} animate-spin text-primary`} />
    </div>
  );
};
