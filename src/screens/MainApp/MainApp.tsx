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

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onTabChange={setActiveTab} />;
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
                Relatórios
              </h1>
              <p className="text-gray-600 mb-8">
                Análise detalhada do desempenho do seu restaurante
              </p>
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Em desenvolvimento
                </h3>
                <p className="text-gray-500">
                  Relatórios avançados estarão disponíveis em breve.
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
                Configurações
              </h1>
              <p className="text-gray-600 mb-8">
                Personalize as configurações do seu restaurante
              </p>
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Em desenvolvimento
                </h3>
                <p className="text-gray-500">
                  Painel de configurações estará disponível em breve.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
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
        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
};
