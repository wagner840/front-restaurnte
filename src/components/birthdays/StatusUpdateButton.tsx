import React from "react";
import { Customer, BirthdayStatus } from "../../types";
import { updateBirthdayStatus } from "../../services/customerService";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

interface StatusUpdateButtonProps {
  customer: Customer;
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
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ newStatus }: { newStatus: BirthdayStatus }) =>
      updateBirthdayStatus(customer.customer_id, newStatus),
    onSuccess: () => {
      toast.success("Status do cliente atualizado.");
      queryClient.invalidateQueries({ queryKey: ["birthdayCustomers"] });
    },
    onError: () => {
      toast.error("Falha ao atualizar o status.");
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Salvando..."
            : statusLabels[customer.birthday_status || "eligible"]}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statusOptions.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => mutation.mutate({ newStatus: status })}
            disabled={status === customer.birthday_status}
          >
            {statusLabels[status]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
