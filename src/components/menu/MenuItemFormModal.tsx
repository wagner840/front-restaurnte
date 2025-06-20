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
  const [image, setImage] = useState<string | null>(null);
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
        setDescription(item.description ?? "");
        setPrice(item.price);
        setCategory(item.category ?? "");
        setImage(item.image);
      } else {
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setImage(null);
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
      image,
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
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white p-3 rounded shadow w-full max-w-xs relative"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          aria-label="Fechar modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
        <h2 className="text-lg font-bold mb-2 text-center">
          {isEditMode ? "Editar Item" : "Adicionar Item"}
        </h2>
        {(formError ||
          createMenuItemMutation.isError ||
          updateMenuItemMutation.isError) && (
          <p className="text-red-500 text-xs mb-2 text-center">
            {formError ||
              createMenuItemMutation.error?.message ||
              updateMenuItemMutation.error?.message}
          </p>
        )}
        <div className="space-y-2">
          <div>
            <input
              id="name"
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-8 px-2 border rounded text-sm"
              autoFocus
            />
          </div>
          <div>
            <input
              id="price"
              type="number"
              placeholder="Preço"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value === "" ? "" : parseFloat(e.target.value)
                )
              }
              className="w-full h-8 px-2 border rounded text-sm"
            />
          </div>
          <div>
            <input
              id="category"
              type="text"
              placeholder="Categoria"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-8 px-2 border rounded text-sm"
            />
          </div>
          <div>
            <input
              id="image"
              type="text"
              placeholder="URL da Imagem (opcional)"
              value={image ?? ""}
              onChange={(e) => setImage(e.target.value)}
              className="w-full h-8 px-2 border rounded text-sm"
            />
          </div>
          <div>
            <button
              type="button"
              className="text-xs text-blue-600 underline mb-1"
              onClick={() =>
                setDescription((d) =>
                  d === undefined ? "" : d === "" ? "(descrição)" : ""
                )
              }
            >
              {description ? "Ocultar descrição" : "Adicionar descrição"}
            </button>
            {description !== undefined && description !== "" && (
              <textarea
                id="description"
                placeholder="Descrição (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-2 py-1 border rounded text-xs min-h-[32px]"
                rows={2}
              />
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100"
            type="button"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            disabled={isSaving}
            type="button"
          >
            {isSaving ? "Salvando..." : isEditMode ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemFormModal;
