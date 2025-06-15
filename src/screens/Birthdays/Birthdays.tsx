import React, { useEffect, useState } from "react";
import { Customer } from "../../types";
import { getBirthdayCustomers } from "../../services/api";
import { BirthdayCustomerCard } from "../../components/birthdays/BirthdayCustomerCard";

export const BirthdaysScreen: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const data = await getBirthdayCustomers();
        setCustomers(data);
      } catch (err) {
        setError("Falha ao buscar aniversariantes.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleStatusChange = (updatedCustomer: Customer) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((c) =>
        c.customer_id === updatedCustomer.customer_id ? updatedCustomer : c
      )
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <p className="text-center text-gray-500 py-10">
          Carregando aniversariantes...
        </p>
      );
    }

    if (error) {
      return <p className="text-center text-red-500 py-10">{error}</p>;
    }

    if (customers.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-lg font-semibold">
            Nenhum aniversariante por perto
          </p>
          <p className="text-gray-500">
            Não há clientes fazendo aniversário nos próximos 30 dias.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {customers.map((customer) => (
          <BirthdayCustomerCard
            key={customer.customer_id}
            customer={customer}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 h-full bg-gray-50">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Próximos Aniversariantes
        </h1>
        <p className="text-gray-600 mt-1">
          Clientes que fazem aniversário nos próximos 30 dias.
        </p>
      </header>
      <main>{renderContent()}</main>
    </div>
  );
};
