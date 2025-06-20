import React, { useEffect, useRef } from "react";
import { LogOut, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { usePendingOrders } from "../../hooks/usePendingOrders";
import { Badge } from "../ui/badge";

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
  const { data: pendingOrdersCount } = usePendingOrders();
  // IDs das abas que devem ser desabilitadas
  const disabledTabs: string[] = [];

  // Ref para o primeiro item focável na sidebar
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Gerenciamento de foco quando a sidebar abre/fecha
  useEffect(() => {
    if (isOpen && firstFocusableRef.current) {
      // Foca no primeiro elemento quando abre (mobile)
      firstFocusableRef.current.focus();
    }
  }, [isOpen]);

  // Gerenciamento de teclas para fechar com Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap para modal em mobile
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) return;

    const focusableElements = sidebarRef.current?.querySelectorAll(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    if (event.key === "Tab") {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  return (
    <>
      {/* Skip link para acessibilidade */}
      <a
        href="#main-content"
        className="skip-link"
        onFocus={(e) => (e.target.style.transform = "translateY(0%)")}
        onBlur={(e) => (e.target.style.transform = "translateY(-100%)")}
      >
        Pular para o conteúdo principal
      </a>

      {/* Overlay para fechar o menu em telas mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden backdrop-blur-sm",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Conteúdo da Sidebar */}
      <nav
        ref={sidebarRef}
        className={cn(
          "fixed top-0 left-0 h-full bg-white border-r border-gray-200 flex flex-col shadow-lg z-40",
          "transition-transform duration-300 ease-in-out",
          "w-64", // Largura padrão
          // Comportamento em mobile: desliza para fora da tela
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Comportamento em desktop: sempre visível e estático
          "md:translate-x-0 md:relative"
        )}
        aria-label="Menu de navegação principal"
        role="navigation"
        onKeyDown={handleKeyDown}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center"
              role="img"
              aria-label="Logo do RestaurantePro"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
                className="w-6 h-6"
                aria-hidden="true"
              >
                <path d="M8 13H16L22 9L16 5H8V3L6 5V19L8 21V13Z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">
                RestaurantePro
              </h1>
              <p className="text-xs text-gray-500">Sistema de Gestão</p>
            </div>
          </div>
          {/* Botão de fechar visível apenas em mobile */}
          <button
            ref={firstFocusableRef}
            onClick={onClose}
            className="md:hidden text-gray-500 hover:text-gray-800 accessible-button"
            aria-label="Fechar menu de navegação"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 p-4">
          <ul className="space-y-1" role="menubar" aria-label="Menu principal">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isDisabled = disabledTabs.includes(item.id);
              const isActive = activeTab === item.id;

              return (
                <li key={item.id} role="none">
                  <button
                    ref={
                      index === 0 && !firstFocusableRef.current
                        ? firstFocusableRef
                        : undefined
                    }
                    onClick={() => {
                      if (!isDisabled) {
                        onTabChange(item.id);
                        onClose(); // Fecha a sidebar ao trocar de aba no mobile
                      }
                    }}
                    disabled={isDisabled}
                    role="menuitem"
                    aria-current={isActive ? "page" : undefined}
                    aria-disabled={isDisabled}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                      "sidebar-nav accessible-button",
                      isActive
                        ? "bg-orange-50 text-orange-600 font-semibold"
                        : "text-gray-600",
                      isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50 hover:text-gray-900 focus-visible:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} aria-hidden="true" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.id === "orders" &&
                      typeof pendingOrdersCount === "number" &&
                      pendingOrdersCount > 0 && (
                        <Badge variant="destructive" className="animate-pulse">
                          {pendingOrdersCount}
                        </Badge>
                      )}
                    {isDisabled && (
                      <span className="sr-only">(em desenvolvimento)</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={async () => {
              await onLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors accessible-button"
            aria-label="Fazer logout do sistema"
          >
            <LogOut size={20} aria-hidden="true" />
            <span className="font-medium">Sair do Sistema</span>
          </button>
        </div>
      </nav>
    </>
  );
};
