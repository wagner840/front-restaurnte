import React, { useState } from "react";
import { useCustomers, useCustomerDetails } from "../../hooks/useCustomers";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useFilteredCustomers } from "../../hooks/useFilteredCustomers";
import { Customer } from "../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus, Search } from "lucide-react";
import { CustomerDetailModal } from "../../components/customers/CustomerDetailModal";
import AddCustomerModal from "../../components/customers/AddCustomerModal";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { PageHeader } from "../../components/layout/PageHeader";
import { CustomersTable } from "../../components/customers/CustomersTable";
import { CustomersListMobile } from "../../components/customers/CustomersListMobile";
import { ErrorDisplay } from "../../components/ui/ErrorDisplay";

export const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const isMobile = useMediaQuery("(max-width: 640px)");

  const {
    data: customers = [],
    isLoading: isLoadingCustomers,
    isError,
    error,
  } = useCustomers();

  const { data: customerDetails, isLoading: isLoadingDetails } =
    useCustomerDetails(selectedCustomerId);

  const filteredCustomers = useFilteredCustomers(customers, searchTerm);

  const selectedCustomer =
    customers.find((c) => c.customer_id === selectedCustomerId) || null;

  const handleRowClick = (customer: Customer) => {
    setSelectedCustomerId(customer.customer_id);
  };

  const handleCloseDetailModal = () => {
    setSelectedCustomerId(null);
  };

  return (
    <>
      <div className="p-4 sm:p-6 space-y-6">
        <PageHeader
          title="Clientes"
          description="Gerencie seus clientes e histórico de pedidos"
        >
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Adicionar Cliente
          </Button>
        </PageHeader>

        <div className="relative w-full">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Buscar clientes por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {isLoadingCustomers ? (
          <LoadingSpinner className="h-64" />
        ) : isError ? (
          <ErrorDisplay
            title="Falha ao carregar os clientes."
            message={error?.message || "Tente novamente mais tarde."}
          />
        ) : isMobile ? (
          <CustomersListMobile
            customers={filteredCustomers}
            onCardClick={handleRowClick}
          />
        ) : (
          <CustomersTable
            customers={filteredCustomers}
            onRowClick={handleRowClick}
          />
        )}
      </div>
      <CustomerDetailModal
        isOpen={!!selectedCustomerId}
        onClose={handleCloseDetailModal}
        customer={selectedCustomer}
        details={customerDetails || null}
        isLoading={isLoadingDetails}
      />
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCustomerAdded={() => setIsAddModalOpen(false)}
      />
    </>
  );
};
