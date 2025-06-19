import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15",
        secondary:
          "bg-secondary/10 text-secondary-foreground border-secondary/20 hover:bg-secondary/15",
        destructive:
          "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15",
        outline:
          "border-border bg-background/50 text-foreground hover:border-primary/50 hover:text-primary",
        success:
          "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
        warning:
          "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
        info: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
        pending:
          "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
        preparing: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
        delivering:
          "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
        completed:
          "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
        cancelled: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
      },
      size: {
        default: "px-2.5 py-1 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
