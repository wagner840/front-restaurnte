import React from "react";
import { Customer } from "../../types";
import { Card, CardContent } from "../ui/card";
import { StatusUpdateButton } from "./StatusUpdateButton";

interface BirthdayCustomerCardProps {
  customer: Customer;
  onStatusChange: (updatedCustomer: Customer) => void;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  // Ajuste para garantir que a data exibida seja a correta, independentemente do fuso horário do cliente/servidor.
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const correctedDate = new Date(date.getTime() + userTimezoneOffset);
  return correctedDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });
};

const Avatar: React.FC<{ name: string }> = ({ name }) => (
  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
    {name.charAt(0).toUpperCase()}
  </div>
);

export const BirthdayCustomerCard: React.FC<BirthdayCustomerCardProps> = ({
  customer,
  onStatusChange,
}) => {
  return (
    // A classe `overflow-visible` é crucial para garantir que o dropdown de status não seja cortado.
    <Card className="overflow-visible">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={customer.name} />
          <div>
            <h3 className="text-lg font-semibold">{customer.name}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span>🎂</span> {/* Ícone de bolo para um toque visual */}
              Aniversário em {formatDate(customer.birthday)}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <StatusUpdateButton
            customer={customer}
            onStatusChange={onStatusChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};
