import React, { useState, useEffect, useCallback } from "react";
import {
  getCustomers,
  getCustomerDetails,
} from "../../services/customerService";
import { Customer, CustomerDetails } from "../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus, Search } from "lucide-react";
import { CustomerDetailModal } from "../../components/customers/CustomerDetailModal";
import AddCustomerModal from "../../components/customers/AddCustomerModal";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerDetails, setCustomerDetails] =
    useState<CustomerDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      // @ts-ignore
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError("Falha ao carregar os clientes. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleCardClick = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
    setDetailsLoading(true);
    try {
      const details = await getCustomerDetails(customer.customer_id);
      setCustomerDetails(details);
    } catch (error) {
      console.error("Failed to fetch customer details", error);
      setCustomerDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCustomerUpdate = (updatedCustomer: Customer) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((c) =>
        c.customer_id === updatedCustomer.customer_id ? updatedCustomer : c
      )
    );
    setSelectedCustomer(updatedCustomer);
  };

  const handleCustomerAdded = () => {
    setIsAddModalOpen(false);
    fetchCustomers();
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.email &&
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <p className="text-[#607589] text-lg">Carregando clientes...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 text-red-600">
          <p>{error}</p>
        </div>
      );
    }

    if (filteredCustomers.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-[#607589] text-lg">Nenhum cliente encontrado</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {filteredCustomers.map((customer) => (
          <Card
            key={customer.customer_id}
            className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader>
              <CardTitle className="text-lg text-[#111416]">
                {customer.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-[#607589]">
                <strong>Email:</strong> {customer.email || "N/A"}
              </p>
              <p className="text-sm text-[#607589]">
                <strong>WhatsApp:</strong> {customer.whatsapp || "N/A"}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleCardClick(customer)}
                className="w-full bg-[#0c7ff2] hover:bg-[#0c7ff2]/90"
              >
                Ver Detalhes
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#111416]">Clientes</h1>
            <p className="text-[#607589] text-sm sm:text-base">
              Gerencie seus clientes e histórico de pedidos
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#0c7ff2] hover:bg-[#0c7ff2]/90 w-full sm:w-auto"
          >
            <Plus size={20} className="mr-2" />
            Adicionar Cliente
          </Button>
        </div>

        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#607589]"
          />
          <Input
            placeholder="Buscar clientes por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-[#eff2f4]"
          />
        </div>

        <div className="bg-white rounded-lg border border-[#e5e8ea] overflow-hidden">
          {renderContent()}
        </div>
      </div>
      <CustomerDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
        details={customerDetails}
        isLoading={detailsLoading}
        onCustomerUpdate={handleCustomerUpdate}
      />
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCustomerAdded={handleCustomerAdded}
      />
    </>
  );
};
