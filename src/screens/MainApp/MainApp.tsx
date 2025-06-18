import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Settings,
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  Cake,
} from "lucide-react";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";
import { Dashboard } from "../Dashboard/Dashboard";
import { Menu } from "../Menu/Menu";
import { Orders } from "../Orders/Orders";
import { Customers } from "../Customers/Customers";
import { BirthdaysScreen } from "../Birthdays/Birthdays";
import { useAuth } from "../../hooks/useAuth";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "menu", label: "Cardápio", icon: UtensilsCrossed },
  { id: "orders", label: "Pedidos", icon: ShoppingBag },
  { id: "customers", label: "Clientes", icon: Users },
  { id: "birthdays", label: "Aniversários", icon: Cake },
  { id: "analytics", label: "Relatórios", icon: BarChart3 },
  { id: "settings", label: "Configurações", icon: Settings },
];

export const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  // Função melhorada para gerenciar mudanças de aba
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Atualiza o título da página dinamicamente
    const activeMenuItem = menuItems.find((item) => item.id === tab);
    if (activeMenuItem) {
      document.title = `${activeMenuItem.label} - RestaurantePro`;
    }
  };

  // Atualiza o título na primeira renderização
  useEffect(() => {
    const activeMenuItem = menuItems.find((item) => item.id === activeTab);
    if (activeMenuItem) {
      document.title = `${activeMenuItem.label} - RestaurantePro`;
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onTabChange={handleTabChange} />;
      case "menu":
        return <Menu />;
      case "orders":
        return <Orders />;
      case "customers":
        return <Customers />;
      case "birthdays":
        return <BirthdaysScreen />;
      case "analytics":
        return (
          <div className="p-4 md:p-8">
            <div className="max-w-4xl">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Relatórios e Análises
              </h1>
              <p className="text-gray-600 mb-8">
                Análise detalhada do desempenho do seu restaurante
              </p>
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Funcionalidade em Desenvolvimento
                </h3>
                <p className="text-gray-500">
                  Os relatórios avançados de vendas, performance e análises
                  detalhadas estarão disponíveis em breve.
                </p>
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="p-4 md:p-8">
            <div className="max-w-4xl">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Configurações do Sistema
              </h1>
              <p className="text-gray-600 mb-8">
                Personalize as configurações do seu restaurante e sistema
              </p>
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Funcionalidade em Desenvolvimento
                </h3>
                <p className="text-gray-500">
                  O painel de configurações para personalização do sistema,
                  dados do restaurante e preferências estará disponível em
                  breve.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard onTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={logout}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menuItems={menuItems}
      />
      <div className="flex-1 flex flex-col">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          activeTab={activeTab}
          menuItems={menuItems}
        />
        <main
          id="main-content"
          className="flex-1 overflow-auto"
          role="main"
          aria-label="Conteúdo principal"
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
