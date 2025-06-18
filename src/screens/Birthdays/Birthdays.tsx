import React from "react";
import { useBirthdayCustomers } from "../../hooks/useCustomers";
import { BirthdayCustomerCard } from "../../components/birthdays/BirthdayCustomerCard";
import { Skeleton } from "../../components/ui/skeleton";
import { AlertTriangle, PartyPopper } from "lucide-react";

export const BirthdaysScreen: React.FC = () => {
  const { data: customers = [], isLoading, isError } = useBirthdayCustomers();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div
          className="grid gap-4 sm:gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-destructive bg-destructive/10 p-6 rounded-lg">
          <AlertTriangle className="h-12 w-12 mb-4" />
          <h2 className="text-xl font-semibold">Erro ao Carregar</h2>
          <p>Não foi possível buscar os aniversariantes. Tente novamente.</p>
        </div>
      );
    }

    if (customers.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground bg-card/50 p-6 rounded-lg">
          <PartyPopper className="h-12 w-12 mb-4" />
          <h2 className="text-xl font-semibold">Nenhum Aniversariante</h2>
          <p>Não há clientes fazendo aniversário nos próximos 30 dias.</p>
        </div>
      );
    }

    return (
      <div
        className="grid gap-4 sm:gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
      >
        {customers.map((customer) => (
          <BirthdayCustomerCard
            key={customer.customer_id}
            customer={customer}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 h-full">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Próximos Aniversariantes
        </h1>
        <p className="text-muted-foreground mt-1">
          Clientes que fazem aniversário nos próximos 30 dias.
        </p>
      </header>
      <main>{renderContent()}</main>
    </div>
  );
};
