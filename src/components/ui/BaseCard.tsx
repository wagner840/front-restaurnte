import React from "react";
import { cn } from "../../lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

// Usando HTMLMotionProps, garantimos a compatibilidade com todas as props do framer-motion
// e também com os atributos HTML padrão, já que o próprio tipo do framer-motion lida com os conflitos.
interface BaseCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  animate?: boolean;
}

export const BaseCard = React.forwardRef<HTMLDivElement, BaseCardProps>(
  ({ className, children, animate: isAnimated = false, ...props }, ref) => {
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

    if (isAnimated) {
      return (
        <motion.div
          ref={ref}
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

    // Para a versão não animada, removemos as props específicas do framer-motion
    // para evitar que o React reclame de propriedades desconhecidas em um elemento div.
    const {
      initial,
      animate,
      exit,
      variants,
      transition,
      whileHover,
      whileTap,
      whileFocus,
      whileInView,
      onAnimationStart,
      onAnimationComplete,
      onUpdate,
      ...restProps
    } = props;

    return (
      <div ref={ref} className={cardClasses} {...restProps}>
        {children}
      </div>
    );
  }
);

BaseCard.displayName = "BaseCard";
