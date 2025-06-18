import React from "react";
import { MenuItem } from "../../types";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
    <Card className="flex flex-col h-full">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <Badge variant={item.available ? "default" : "destructive"}>
            {item.available ? "Disponível" : "Indisponível"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="text-muted-foreground text-sm">{item.description}</p>
      </CardContent>
      <CardFooter className="p-4 flex items-center justify-between">
        <span className="text-xl font-bold text-primary">
          R$ {item.price.toFixed(2).replace(".", ",")}
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(item)}
            aria-label="Editar item"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item.id)}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            aria-label="Deletar item"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
