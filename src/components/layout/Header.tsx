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
    <header
      className="bg-card border-b p-4 flex items-center justify-between sticky top-0 z-20"
      role="banner"
    >
      {/* Título da página visível em todas as telas */}
      <div className="flex items-center gap-4">
        <h1
          className="font-bold text-lg text-foreground"
          id="page-title"
          aria-live="polite"
        >
          {activeLabel}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Botão de menu visível apenas em telas pequenas */}
        <button
          onClick={onMenuClick}
          className="text-foreground hover:text-primary md:hidden accessible-button"
          aria-label={`Abrir menu de navegação. Página atual: ${activeLabel}`}
          aria-expanded="false"
          aria-controls="sidebar-navigation"
        >
          <Menu size={24} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};
