import React, { useState, useRef, useEffect } from "react";
import { Customer, BirthdayStatus } from "../../types";
import { updateBirthdayStatus } from "../../services/api";
import { Button } from "../ui/button";

interface StatusUpdateButtonProps {
  customer: Customer;
  onStatusChange: (updatedCustomer: Customer) => void;
}

const statusOptions: BirthdayStatus[] = [
  "eligible",
  "30d_sent",
  "15d_sent",
  "booked",
  "declined",
  "completed",
];

const statusLabels: Record<BirthdayStatus, string> = {
  eligible: "Elegível",
  "30d_sent": "Aviso 30d",
  "15d_sent": "Aviso 15d",
  booked: "Agendado",
  declined: "Recusado",
  completed: "Concluído",
};

export const StatusUpdateButton: React.FC<StatusUpdateButtonProps> = ({
  customer,
  onStatusChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleStatusUpdate = async (newStatus: BirthdayStatus) => {
    if (newStatus === customer.birthday_status) {
      setShowOptions(false);
      return;
    }

    setIsLoading(true);
    try {
      const updatedCustomer = await updateBirthdayStatus(
        customer.customer_id,
        newStatus
      );
      onStatusChange(updatedCustomer);
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setIsLoading(false);
      setShowOptions(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="relative" ref={wrapperRef}>
      <Button
        onClick={() => setShowOptions(!showOptions)}
        disabled={isLoading}
        variant="outline"
        className="w-auto" // Largura automática para se ajustar ao conteúdo
      >
        {isLoading
          ? "Salvando..."
          : statusLabels[customer.birthday_status || "eligible"]}
      </Button>
      {showOptions && (
        // O z-index garante que o dropdown apareça sobre outros elementos.
        <div className="absolute z-20 mt-2 w-48 bg-white rounded-md shadow-lg border right-0">
          <ul className="py-1">
            {statusOptions.map((status) => (
              <li
                key={status}
                onClick={() => handleStatusUpdate(status)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                {statusLabels[status]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
