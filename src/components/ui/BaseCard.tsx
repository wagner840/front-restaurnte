import React from "react";
import { cn } from "../../lib/utils";
import { motion, HTMLMotionProps, AnimationProps } from "framer-motion";

// A interface combina as props de um elemento div padrão com as props de movimento do Framer.
// Isso garante que possamos passar tanto atributos HTML padrão quanto propriedades de animação.
interface BaseCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  isAnimated?: boolean; // Renomeado para clareza
}

const animatedProps: AnimationProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

export const BaseCard = React.forwardRef<HTMLDivElement, BaseCardProps>(
  ({ className, children, isAnimated = false, ...props }, ref) => {
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

    // O motion.div é inteligente o suficiente para lidar com as props.
    // Ele aplicará as props de animação e repassará as props de div padrão para o elemento DOM.
    // Quando isAnimated for false, as props de animação não serão passadas.
    return (
      <motion.div
        ref={ref}
        className={cardClasses}
        {...(isAnimated ? animatedProps : {})}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

BaseCard.displayName = "BaseCard";
