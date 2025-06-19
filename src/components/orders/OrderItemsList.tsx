import React from "react";
import { motion } from "framer-motion";
import { OrderItemJson } from "../../types";
import { formatCurrency } from "../../lib/utils";

interface OrderItemsListProps {
  items: OrderItemJson[];
}

export const OrderItemsList: React.FC<OrderItemsListProps> = ({ items }) => {
  if (!Array.isArray(items)) {
    return null;
  }

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-1"
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between text-sm"
        >
          <span>
            {item.quantity}x {item.name || item.item_name || item.item}
          </span>
          <span className="font-medium">{formatCurrency(item.price)}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};
