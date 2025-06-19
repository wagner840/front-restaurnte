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
import Reports from "../Reports/Reports";
import { Settings as SettingsScreen } from "../Settings/Settings";

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
        return <Reports />;
      case "settings":
        return <SettingsScreen />;
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
