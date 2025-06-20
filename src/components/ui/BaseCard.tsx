import React from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

// O Card original usa React.HTMLAttributes<HTMLDivElement>, então vamos estender isso.
interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animate?: boolean;
}

export const BaseCard = React.forwardRef<HTMLDivElement, BaseCardProps>(
  ({ className, children, animate = false, ...props }, ref) => {
    const cardClasses = cn(
      "relative overflow-hidden",
      "bg-card text-card-foreground",
      "border border-border/50",
      "shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)]",
      "hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.2)]",
      "hover:border-primary/20",
      "rounded-xl",
      "transition-all duration-300 ease-in-out",
      className
    );

    if (animate) {
      return (
        <motion.div
          ref={ref as React.Ref<HTMLDivElement>}
          className={cardClasses}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={cardClasses} {...props}>
        {children}
      </div>
    );
  }
);

BaseCard.displayName = "BaseCard";
