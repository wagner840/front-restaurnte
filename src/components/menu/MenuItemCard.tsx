import React from "react";
import { MenuItem } from "../../types";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg border border-[#e5e8ea] overflow-hidden flex flex-col h-full">
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-base sm:text-lg text-[#111416]">
            {item.name}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              item.available
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {item.available ? "Disponível" : "Indisponível"}
          </span>
        </div>
        <p className="text-[#607589] text-sm mb-4 flex-grow">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <span className="text-lg sm:text-xl font-bold text-[#0c7ff2]">
            R$ {item.price.toFixed(2)}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item)}
              className="p-2"
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(item.id)}
              className="p-2 text-red-600 hover:bg-red-100 hover:text-red-700"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
