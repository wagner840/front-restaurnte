import React from "react";
import { MenuItem } from "../../types";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
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
    <div
      className="bg-card rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col h-full"
      data-testid="menu-item-card"
    >
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-gray-500">{item.category}</p>
            <Badge
              className={`${
                item.available ? "bg-green-500" : "bg-red-500"
              } text-white`}
            >
              {item.available ? "Disponível" : "Indisponível"}
            </Badge>
          </div>
          <h3
            className="text-lg font-semibold text-foreground truncate"
            title={item.name}
          >
            {item.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1 h-10 overflow-hidden">
            {item.description}
          </p>
        </div>

        <div className="mt-4">
          <p className="text-xl font-bold text-gray-900 mb-4">
            R$ {item.price.toFixed(2).replace(".", ",")}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item)}
              className="w-full"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(item.id)}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
