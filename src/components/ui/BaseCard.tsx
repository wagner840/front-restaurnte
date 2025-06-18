import React from "react";
import { cn } from "../../lib/utils";
import { Card } from "./card";

// O Card original usa React.HTMLAttributes<HTMLDivElement>, então vamos estender isso.
interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const BaseCard = React.forwardRef<HTMLDivElement, BaseCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "border-l-4 bg-card text-card-foreground shadow-lg rounded-xl transition-all duration-300",
          "dark:bg-slate-900 dark:border-slate-700",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

BaseCard.displayName = "BaseCard";
