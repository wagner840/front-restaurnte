import React from "react";
import { Customer, CustomerDetails } from "../../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge, badgeVariants } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VariantProps } from "class-variance-authority";
import {
  User,
  Phone,
  Mail,
  ShoppingCart,
  DollarSign,
  Calendar,
  Gift,
  Loader2,
  Star,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomerBirthdayStatus } from "../../services/customerService";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  details: CustomerDetails | null;
  isLoading: boolean;
}

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}> = ({ icon, label, value, className }) => (
  <div
    className={`flex items-center gap-3 rounded-lg border p-3 bg-accent/20 ${className}`}
  >
    {icon}
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-bold text-lg">{value}</p>
    </div>
  </div>
);

export const CustomerDetailModal: React.FC<Props> = ({
  isOpen,
  onClose,
  customer,
  details,
  isLoading,
}) => {
  const queryClient = useQueryClient();

  const updateGiftStatusMutation = useMutation({
    mutationFn: ({
      customerId,
      status,
    }: {
      customerId: string;
      status: "eligible" | "completed";
    }) => updateCustomerBirthdayStatus(customerId, status),
    onSuccess: () => {
      toast.success("Status do brinde atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({
        queryKey: ["customerDetails", customer?.customer_id],
      });
    },
    onError: (error) => {
      toast.error(`Falha ao atualizar o status: ${error.message}`);
    },
  });

  if (!isOpen || !customer) return null;

  const handleToggleGiftStatus = () => {
    const newStatus =
      customer.birthday_status === "completed" ? "eligible" : "completed";
    updateGiftStatusMutation.mutate({
      customerId: customer.customer_id,
      status: newStatus,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.07 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const renderBirthdayStatusBadge = (status: Customer["birthday_status"]) => {
    const config: {
      [key: string]: { variant: BadgeVariant; text: string };
    } = {
      completed: { variant: "warning", text: "Utilizado" },
      eligible: { variant: "success", text: "Disponível" },
      booked: { variant: "success", text: "Agendado" },
      "30d_sent": { variant: "success", text: "Notificado" },
      "15d_sent": { variant: "success", text: "Notificado" },
      declined: { variant: "destructive", text: "Vencido" },
    };
    const { variant, text } = config[status] || {
      variant: "outline",
      text: status,
    };
    return <Badge variant={variant}>{text}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md md:max-w-2xl lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <User className="h-7 w-7 text-primary" />
            {customer.name}
          </DialogTitle>
          <DialogDescription>
            Cliente desde{" "}
            {new Date(customer.created_at).toLocaleDateString("pt-BR")}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh] w-full">
          <div className="py-4 pr-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-80">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : details ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Coluna de Contato e Brinde */}
                <motion.div
                  variants={itemVariants}
                  className="md:col-span-1 lg:col-span-1 space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Mail className="h-5 w-5 text-primary" /> Contato
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{customer.email || "Não informado"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{customer.whatsapp}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Gift className="h-5 w-5 text-primary" /> Brinde
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {customer.birthday
                            ? new Date(customer.birthday).toLocaleDateString(
                                "pt-BR"
                              )
                            : "N/A"}
                        </span>
                        {renderBirthdayStatusBadge(customer.birthday_status)}
                      </div>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={handleToggleGiftStatus}
                        disabled={updateGiftStatusMutation.isPending}
                      >
                        {updateGiftStatusMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {customer.birthday_status === "completed"
                          ? "Reverter Uso"
                          : "Marcar como Usado"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Coluna de Métricas e Insights */}
                <motion.div
                  variants={itemVariants}
                  className="md:col-span-1 lg:col-span-2 space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-primary" /> Métricas
                        Principais
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <StatCard
                        icon={<ShoppingCart className="h-6 w-6 text-primary" />}
                        label="Total de Pedidos"
                        value={details.totalOrders}
                      />
                      <StatCard
                        icon={<DollarSign className="h-6 w-6 text-primary" />}
                        label="Total Gasto"
                        value={formatCurrency(details.totalSpent)}
                      />
                      <StatCard
                        icon={<TrendingUp className="h-6 w-6 text-primary" />}
                        label="Ticket Médio"
                        value={formatCurrency(details.averageTicket)}
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock className="h-5 w-5 text-primary" /> Insights de
                        Compras
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">Dia mais frequente:</span>
                        <Badge
                          variant="outline"
                          className="text-foreground bg-primary-foreground"
                        >
                          {details.mostFrequentDay || "N/A"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">Último pedido:</span>
                        <Badge
                          variant="outline"
                          className="text-foreground bg-primary-foreground"
                        >
                          {details.lastOrderDate
                            ? new Date(
                                details.lastOrderDate
                              ).toLocaleDateString("pt-BR")
                            : "N/A"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Star className="h-5 w-5 text-primary" /> Top Produtos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {details.favoriteProducts.map((p, i) => (
                          <li
                            key={i}
                            className="flex justify-between items-center text-sm"
                          >
                            <span>{p.product}</span>
                            <Badge variant="outline">{p.quantity}x</Badge>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ) : (
              <div className="text-center text-destructive py-10">
                <p>Falha ao carregar os detalhes do cliente.</p>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
