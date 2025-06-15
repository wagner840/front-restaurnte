import React from "react";
import { LogOut, X } from "lucide-react";
import { cn } from "../../lib/utils";

// Definindo a interface para um item de menu.
interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[]; // Recebe os itens do menu como prop
}

/**
 * Sidebar de navegação.
 * Em mobile, é um menu lateral que desliza para dentro e para fora da tela.
 * Em telas maiores (md+), é um painel lateral fixo e sempre visível.
 */
export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  isOpen,
  onClose,
  menuItems,
}) => {
  // IDs das abas que devem ser desabilitadas
  const disabledTabs = ["analytics", "settings"];

  return (
    <>
      {/* Overlay para fechar o menu em telas mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden backdrop-blur-sm",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Conteúdo da Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full bg-white border-r border-gray-200 flex flex-col shadow-lg z-40",
          "transition-transform duration-300 ease-in-out",
          "w-64", // Largura padrão
          // Comportamento em mobile: desliza para fora da tela
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Comportamento em desktop: sempre visível e estático
          "md:translate-x-0 md:relative"
        )}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              {/* O ícone pode ser dinâmico ou fixo, dependendo da preferência */}
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">
                RestaurantePro
              </h1>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
          {/* Botão de fechar visível apenas em mobile */}
          <button
            onClick={onClose}
            className="md:hidden text-gray-500 hover:text-gray-800"
            aria-label="Fechar menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isDisabled = disabledTabs.includes(item.id);

              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (!isDisabled) {
                        onTabChange(item.id);
                        onClose(); // Fecha a sidebar ao trocar de aba no mobile
                      }
                    }}
                    disabled={isDisabled}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                      activeTab === item.id
                        ? "bg-orange-50 text-orange-600 font-semibold"
                        : "text-gray-600",
                      isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>
    </>
  );
};
