import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] hover:bg-primary/90 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.2)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_2px_10px_-3px_rgba(220,38,38,0.1)] hover:bg-destructive/90 hover:shadow-[0_8px_30px_-12px_rgba(220,38,38,0.2)]",
        outline:
          "border border-input bg-background/50 hover:bg-accent/10 hover:text-accent-foreground hover:border-primary/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-primary/5 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        success:
          "bg-green-600 text-white shadow-[0_2px_10px_-3px_rgba(22,163,74,0.1)] hover:bg-green-700 hover:shadow-[0_8px_30px_-12px_rgba(22,163,74,0.2)]",
        warning:
          "bg-yellow-500 text-white shadow-[0_2px_10px_-3px_rgba(234,179,8,0.1)] hover:bg-yellow-600 hover:shadow-[0_8px_30px_-12px_rgba(234,179,8,0.2)]",
        info: "bg-blue-600 text-white shadow-[0_2px_10px_-3px_rgba(37,99,235,0.1)] hover:bg-blue-700 hover:shadow-[0_8px_30px_-12px_rgba(37,99,235,0.2)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  contrast?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, contrast, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          contrast &&
            "bg-black text-white border border-white hover:bg-gray-900"
        )}
        ref={ref}
        aria-label={
          props["aria-label"] || props.children?.toString() || "Botão"
        }
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
