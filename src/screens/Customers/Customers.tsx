import React, { useState, useMemo, useEffect } from "react";
import { useCustomers, useCustomerDetails } from "../../hooks/useCustomers";
import { Customer } from "../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus, Search, Loader2, Mail, Phone } from "lucide-react";
import { CustomerDetailModal } from "../../components/customers/CustomerDetailModal";
import AddCustomerModal from "../../components/customers/AddCustomerModal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

export const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    data: customers = [],
    isLoading: isLoadingCustomers,
    isError,
  } = useCustomers();

  const { data: customerDetails, isLoading: isLoadingDetails } =
    useCustomerDetails(selectedCustomerId);

  const selectedCustomer = useMemo(() => {
    if (!selectedCustomerId) return null;
    return customers.find((c) => c.customer_id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  const filteredCustomers = useMemo(
    () =>
      customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (customer.email &&
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    [customers, searchTerm]
  );

  const handleRowClick = (customer: Customer) => {
    setSelectedCustomerId(customer.customer_id);
  };

  const handleCloseDetailModal = () => {
    setSelectedCustomerId(null);
  };

  return (
    <>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie seus clientes e histórico de pedidos
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Adicionar Cliente
          </Button>
        </div>

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
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-destructive">
            <p>Falha ao carregar os clientes.</p>
          </div>
        ) : isMobile ? (
          <div className="space-y-4">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <Card
                  key={customer.customer_id}
                  onClick={() => handleRowClick(customer)}
                  className="cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle>{customer.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.whatsapp}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.email || "N/A"}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Nenhum cliente encontrado.</p>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Lista de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <TableRow
                        key={customer.customer_id}
                        onClick={() => handleRowClick(customer)}
                        className="cursor-pointer"
                      >
                        <TableCell className="font-medium">
                          {customer.name}
                        </TableCell>
                        <TableCell>{customer.whatsapp}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        Nenhum cliente encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
