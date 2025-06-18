import React, { useState } from "react";
import { useCreateCustomer } from "../../hooks/useCustomers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label"; // Importando o Label

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerAdded: () => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onCustomerAdded,
}) => {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const createCustomerMutation = useCreateCustomer();

  const handleSave = async () => {
    if (!name || !whatsapp) {
      // A validação com Zod seria ideal aqui
      return;
    }

    await createCustomerMutation.mutateAsync(
      {
        name,
        whatsapp,
        email: email || "N/A",
        birthday: birthday || null,
        unique_code: "",
        birthday_status: "eligible",
        last_contacted_at: null,
        Is_Gift_Used: null,
        whatsapp_chat_id: null,
      },
      {
        onSuccess: () => {
          onCustomerAdded();
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cliente</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para criar um novo cliente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo do cliente"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(99) 99999-9999"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email (Opcional)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="birthday">Data de Nascimento (Opcional)</Label>
            <Input
              id="birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={createCustomerMutation.isPending}
          >
            {createCustomerMutation.isPending
              ? "Salvando..."
              : "Salvar Cliente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerModal;
