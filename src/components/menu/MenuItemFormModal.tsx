import React, { useState, useEffect, MouseEvent } from "react";
import { MenuItem } from "../../types";
import { useCreateMenuItem, useUpdateMenuItem } from "../../hooks/useMenuItems";

interface MenuItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: MenuItem | null;
}

const MenuItemFormModal: React.FC<MenuItemFormModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const createMenuItemMutation = useCreateMenuItem();
  const updateMenuItemMutation = useUpdateMenuItem();

  const isEditMode = item != null;
  const isSaving =
    createMenuItemMutation.isPending || updateMenuItemMutation.isPending;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && item) {
        setName(item.name);
        setDescription(item.description);
        setPrice(item.price);
        setCategory(item.category);
      } else {
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
      }
      setFormError(null);
    }
  }, [isOpen, item, isEditMode]);

  const handleSave = async () => {
    if (!name || price === "" || !category) {
      setFormError("Nome, Preço e Categoria são obrigatórios.");
      return;
    }
    setFormError(null);

    const menuItemData = {
      name,
      description,
      price: Number(price),
      category,
      available: item?.available ?? true,
    };

    const mutationOptions = {
      onSuccess: () => {
        onClose();
      },
      onError: (error: Error) => {
        setFormError(error.message || "Ocorreu uma falha. Tente novamente.");
      },
    };

    if (isEditMode && item) {
      updateMenuItemMutation.mutate(
        { id: item.id, updates: menuItemData },
        mutationOptions
      );
    } else {
      createMenuItemMutation.mutate(menuItemData, mutationOptions);
    }
  };

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          aria-label="Fechar modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isEditMode ? "Editar Item" : "Adicionar Item"}
        </h2>
        {(formError ||
          createMenuItemMutation.isError ||
          updateMenuItemMutation.isError) && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {formError ||
              createMenuItemMutation.error?.message ||
              updateMenuItemMutation.error?.message}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome
            </label>
            <input
              id="name"
              type="text"
              placeholder="Nome do item"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descrição
            </label>
            <textarea
              id="description"
              placeholder="Descrição do item"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Preço
            </label>
            <input
              id="price"
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value === "" ? "" : parseFloat(e.target.value)
                )
              }
              className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Categoria
            </label>
            <input
              id="category"
              type="text"
              placeholder="Categoria do item"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            disabled={isSaving}
          >
            {isSaving
              ? "Salvando..."
              : isEditMode
              ? "Salvar Alterações"
              : "Adicionar Item"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemFormModal;
