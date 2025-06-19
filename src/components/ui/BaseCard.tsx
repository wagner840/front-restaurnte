import React from "react";
import { cn } from "../../lib/utils";
import { Card } from "./card";
import { motion } from "framer-motion";

// O Card original usa React.HTMLAttributes<HTMLDivElement>, então vamos estender isso.
interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animate?: boolean;
}

export const BaseCard = React.forwardRef<HTMLDivElement, BaseCardProps>(
  ({ className, children, animate = false, ...props }, ref) => {
    const CardComponent = animate ? motion(Card) : Card;

    const animationProps = animate
      ? {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, ease: "easeOut" },
        }
      : {};

    return (
      <CardComponent
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          "bg-card text-card-foreground",
          "border border-border/50",
          "shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)]",
          "hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.2)]",
          "hover:border-primary/20",
          "rounded-xl",
          "transition-all duration-300 ease-in-out",
          className
        )}
        {...animationProps}
        {...props}
      >
        {children}
      </CardComponent>
    );
  }
);

BaseCard.displayName = "BaseCard";
