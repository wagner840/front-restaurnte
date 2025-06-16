import React, { useState, useEffect } from "react";
import { Customer } from "../../types";
import {
  X,
  User,
  Phone,
  Mail,
  ShoppingCart,
  DollarSign,
  Calendar,
  Gift,
} from "lucide-react";
import { updateCustomerGiftStatus } from "../../services/api";

interface CustomerDetails {
  totalOrders: number;
  totalSpent: number;
  favoriteDays: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  details: CustomerDetails | null;
  isLoading: boolean;
  onCustomerUpdate: (updatedCustomer: Customer) => void;
}

export const CustomerDetailModal: React.FC<Props> = ({
  isOpen,
  onClose,
  customer,
  details,
  isLoading,
  onCustomerUpdate,
}) => {
  const [isUpdatingGiftStatus, setIsUpdatingGiftStatus] = useState(false);
  const [giftStatus, setGiftStatus] = useState<"Sim" | "Não">("Não");

  useEffect(() => {
    if (customer?.Is_Gift_Used === "Sim") {
      setGiftStatus("Sim");
    } else {
      setGiftStatus("Não");
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

  const handleToggleGiftStatus = async () => {
    if (!customer) return;

    setIsUpdatingGiftStatus(true);
    try {
      // Lógica ajustada para usar birthday_status conforme o tipo
      const newStatus = giftStatus === "Sim" ? "eligible" : "completed";
      const updatedCustomer = await updateCustomerGiftStatus(
        customer.customer_id,
        newStatus
      );
      setGiftStatus(giftStatus === "Sim" ? "Não" : "Sim"); // Mantém a UI consistente
      onCustomerUpdate(updatedCustomer);
    } catch (error) {
      console.error("Failed to update gift status:", error);
      // Aqui você pode adicionar um toast ou notificação de erro
    } finally {
      setIsUpdatingGiftStatus(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[95vh] flex flex-col animate-in fade-in-0 zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-detail-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2
                id="customer-detail-title"
                className="text-xl sm:text-2xl font-bold text-gray-900"
              >
                {customer.name}
              </h2>
              <p className="text-sm text-gray-500 truncate">{customer.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-lg text-gray-500">Carregando detalhes...</p>
            </div>
          ) : details ? (
            <div className="space-y-6">
              {/* Contato */}
              <div>
                <h3 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Contato
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-800 break-all">
                      {customer.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-800">{customer.whatsapp}</span>
                  </div>
                </div>
              </div>

              {/* Brinde de Aniversário */}
              <div>
                <h3 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Brinde de Aniversário
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Gift size={22} className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Brinde utilizado?</p>
                      <p className="text-lg font-bold text-gray-900">
                        {giftStatus}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleGiftStatus}
                    disabled={isUpdatingGiftStatus}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isUpdatingGiftStatus
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : giftStatus === "Sim"
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {isUpdatingGiftStatus
                      ? "Atualizando..."
                      : giftStatus === "Sim"
                      ? "Marcar como Não Usado"
                      : "Marcar como Usado"}
                  </button>
                </div>
              </div>

              {/* Histórico */}
              <div>
                <h3 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Histórico
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
                    <ShoppingCart size={22} className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Pedidos</p>
                      <p className="text-lg font-bold text-gray-900">
                        {details.totalOrders}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
                    <DollarSign size={22} className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Total Gasto</p>
                      <p className="text-lg font-bold text-gray-900">
                        R$ {details.totalSpent.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hábitos */}
              <div>
                <h3 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Hábitos
                </h3>
                <div className="flex items-start gap-3">
                  <Calendar
                    size={18}
                    className="text-gray-400 flex-shrink-0 mt-1"
                  />
                  <div>
                    <p className="text-gray-800">Dias preferidos para pedir:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {details.favoriteDays.length > 0 ? (
                        details.favoriteDays.map((day) => (
                          <span
                            key={day}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium capitalize"
                          >
                            {day}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          Não há dados suficientes.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-red-500">
              <p>Falha ao carregar detalhes do cliente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
