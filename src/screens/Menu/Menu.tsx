import React, { useState, useMemo } from "react";
import { MenuItemCard } from "../../components/menu/MenuItemCard";
import MenuItemFormModal from "../../components/menu/MenuItemFormModal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus, Search } from "lucide-react";
import { MenuItem } from "../../types";
import { useMenuItems, useDeleteMenuItem } from "../../hooks/useMenuItems";
import { Skeleton } from "../../components/ui/skeleton";

const MenuSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
    {Array.from({ length: 10 }).map((_, index) => (
      <div
        key={index}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <Skeleton className="h-48 w-full" />
        <div className="p-4">
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-6 w-2/3 mb-2" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const Menu: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: items = [], isLoading, isError } = useMenuItems();
  const deleteMenuItemMutation = useDeleteMenuItem();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const categories = useMemo(() => {
    if (!items) return [];
    return [...new Set(items.map((item: MenuItem) => item.category))];
  }, [items]);

  const handleOpenModalForAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const filteredItems = useMemo(() => {
    if (!items) return [];
    return items.filter((item: MenuItem) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMenuItemMutation.mutate(id);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cardápio</h1>
          <p className="text-gray-600">Gerencie os itens do seu cardápio</p>
        </div>
        <Button
          onClick={handleOpenModalForAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
        >
          <Plus size={20} className="mr-2" />
          Adicionar Item
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-10 px-3 text-sm border rounded-md bg-white w-full sm:w-auto"
        >
          <option value="all">Todas as Categorias</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        {isLoading ? (
          <MenuSkeleton />
        ) : isError ? (
          <div className="text-center py-12 text-red-600 bg-red-50 p-4 rounded-lg">
            <p className="font-semibold">Ocorreu um erro</p>
            <p>Falha ao carregar o cardápio. Tente novamente mais tarde.</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nenhum item encontrado.</p>
            <p className="text-sm text-gray-500">
              Tente ajustar sua busca ou filtros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <MenuItemFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={editingItem}
      />
    </div>
  );
};
