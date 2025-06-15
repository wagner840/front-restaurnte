import React from "react";
import { Menu } from "lucide-react";

// Adicionando a definição do tipo MenuItem para ser usada nas props
interface MenuItem {
  id: string;
  label: string;
  // O ícone não é usado aqui, mas faz parte do objeto
}

interface HeaderProps {
  onMenuClick: () => void;
  activeTab: string;
  menuItems: MenuItem[];
}

/**
 * Header principal da aplicação.
 * Exibe o título da página ativa e o botão de menu em telas mobile.
 */
export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  activeTab,
  menuItems,
}) => {
  // Encontra o label da aba ativa para exibir como título
  const activeLabel =
    menuItems.find((item) => item.id === activeTab)?.label || "Dashboard";

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20 md:justify-end">
      {/* Título da página visível em todas as telas */}
      <div className="flex items-center gap-3">
        <h1 className="font-bold text-lg text-gray-900">{activeLabel}</h1>
      </div>

      {/* Botão de menu visível apenas em telas pequenas */}
      <button
        onClick={onMenuClick}
        className="text-gray-600 hover:text-gray-900 md:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={24} />
      </button>
    </header>
  );
};
