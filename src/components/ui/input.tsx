import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  contrast?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, leftIcon, rightIcon, error, contrast, ...props },
    ref
  ) => {
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground/70 transition-colors">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border bg-background/50 px-3 py-2 text-sm transition-all duration-200",
            "placeholder:text-muted-foreground/60",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            error
              ? "border-destructive/50 focus-visible:ring-destructive/30"
              : "border-input hover:border-primary/30",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            contrast &&
              "bg-background text-foreground border-border placeholder:text-muted-foreground",
            className
          )}
          aria-label={
            props["aria-label"] || props.placeholder || "Campo de entrada"
          }
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground/70 transition-colors">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
