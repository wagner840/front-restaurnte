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
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomerBirthdayStatus } from "../../services/customerService";
import { toast } from "sonner";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <User className="h-6 w-6" />
            {customer.name}
          </DialogTitle>
          <DialogDescription>{customer.email}</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : details ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.whatsapp}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Brinde de Aniversário
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Gift className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">
                        {renderBirthdayStatusBadge(customer.birthday_status)}
                      </span>
                    </div>
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
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Histórico</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pedidos</p>
                      <p className="font-bold">{details.totalOrders}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Gasto
                      </p>
                      <p className="font-bold">
                        {details.totalSpent.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Hábitos de Consumo</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-2">
                    {details.favoriteDays.length > 0 ? (
                      details.favoriteDays.map((day) => (
                        <Badge key={day} variant="secondary">
                          {day}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Não há dados suficientes.
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
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
