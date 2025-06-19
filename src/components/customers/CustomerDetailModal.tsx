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
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Phone,
  Mail,
  ShoppingCart,
  DollarSign,
  Calendar,
  Gift,
  Loader2,
  Clock,
  Package,
  TrendingUp,
  Star,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomerBirthdayStatus } from "../../services/customerService";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  details: CustomerDetails | null;
  isLoading: boolean;
}

export const CustomerDetailModal: React.FC<Props> = ({
  isOpen,
  onClose,
  customer,
  details,
  isLoading,
}) => {
  const queryClient = useQueryClient();

  const renderBirthdayStatusBadge = (status: Customer["birthday_status"]) => {
    let variant: "success" | "warning" | "destructive" | "outline" = "outline";
    let text = "Disponível";

    switch (status) {
      case "completed":
        variant = "warning";
        text = "Utilizado";
        break;
      case "eligible":
      case "booked":
      case "30d_sent":
      case "15d_sent":
        variant = "success";
        text = "Disponível";
        break;
      case "declined":
        variant = "destructive";
        text = "Vencido";
        break;
      default:
        text = status;
    }

    return <Badge variant={variant}>{text}</Badge>;
  };

  const updateGiftStatusMutation = useMutation({
    mutationFn: ({
      customerId,
      status,
    }: {
      customerId: string;
      status: "eligible" | "completed";
    }) => updateCustomerBirthdayStatus(customerId, status),
    onSuccess: () => {
      toast.success("Status do brinde atualizado.");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({
        queryKey: ["customerDetails", customer?.customer_id],
      });
    },
    onError: () => {
      toast.error("Falha ao atualizar status do brinde.");
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <User className="h-6 w-6 text-primary" />
            {customer.name}
          </DialogTitle>
          <DialogDescription className="text-base">
            Cliente desde{" "}
            {new Date(customer.created_at).toLocaleDateString("pt-BR")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : details ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Informações de Contato */}
              <motion.div variants={item}>
                <Card className="bg-card hover:bg-accent/5 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Informações de Contato
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.email || "Não informado"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.whatsapp}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Brinde de Aniversário */}
              <motion.div variants={item}>
                <Card className="bg-card hover:bg-accent/5 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gift className="h-5 w-5 text-primary" />
                      Brinde de Aniversário
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {customer.birthday
                            ? new Date(customer.birthday).toLocaleDateString(
                                "pt-BR"
                              )
                            : "Não informado"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {renderBirthdayStatusBadge(customer.birthday_status)}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleToggleGiftStatus}
                          disabled={updateGiftStatusMutation.isPending}
                        >
                          {customer.birthday_status === "completed"
                            ? "Reverter"
                            : "Utilizar"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Resumo de Pedidos */}
              <motion.div variants={item}>
                <Card className="bg-card hover:bg-accent/5 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                      Resumo de Pedidos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 rounded-lg border p-3">
                        <Package className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Total de Pedidos
                          </p>
                          <p className="font-bold">{details.totalOrders}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg border p-3">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Total Gasto
                          </p>
                          <p className="font-bold">
                            {formatCurrency(details.totalSpent)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Ticket Médio
                        </p>
                        <p className="font-bold">
                          {formatCurrency(details.averageTicket)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Produtos Favoritos */}
              <motion.div variants={item}>
                <Card className="bg-card hover:bg-accent/5 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Produtos Favoritos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {details.favoriteProducts.map(({ product, quantity }) => (
                        <div
                          key={product}
                          className="flex items-center justify-between rounded-lg border p-2"
                        >
                          <span className="text-sm">{product}</span>
                          <Badge variant="secondary">{quantity}x</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Horários Favoritos */}
              <motion.div variants={item}>
                <Card className="bg-card hover:bg-accent/5 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Horários Preferidos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {details.favoriteHours.map((hour) => (
                        <Badge key={hour} variant="secondary">
                          {hour.toString().padStart(2, "0")}:00
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Dias Favoritos */}
              <motion.div variants={item}>
                <Card className="bg-card hover:bg-accent/5 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Dias Preferidos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {details.favoriteDays.map((day) => (
                        <Badge key={day} variant="secondary">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ) : (
            <div className="text-center text-destructive">
              <p>Falha ao carregar detalhes do cliente.</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
