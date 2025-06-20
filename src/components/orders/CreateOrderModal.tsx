import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { supabase } from "../../lib/supabaseClient";
import { Customer, MenuItem, Order, Address } from "../../types";
import { formatCurrency } from "../../lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type NewOrderPayload = Omit<
  Order,
  "order_id" | "created_at" | "last_updated_at" | "customerName"
>;

const fetchCustomers = async (searchTerm: string): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .or(`name.ilike.%${searchTerm}%,whatsapp.ilike.%${searchTerm}%`)
    .limit(10);
  if (error) throw new Error(error.message);
  return data || [];
};

const fetchAddresses = async (customerId: string): Promise<Address[]> => {
  if (!customerId) return [];
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("customer_id", customerId);
  if (error) throw new Error(error.message);
  return data || [];
};

const fetchMenuItems = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("available", true);
  if (error) throw new Error(error.message);
  return data || [];
};

const createOrder = async (newOrder: Partial<NewOrderPayload>) => {
  const { data, error } = await supabase
    .from("orders")
    .insert([newOrder])
    .select();
  if (error) throw new Error(error.message);
  return data;
};

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  const { data: customers } = useQuery({
    queryKey: ["customers", customerSearchTerm],
    queryFn: () => fetchCustomers(customerSearchTerm),
    enabled: customerSearchTerm.length > 2,
  });

  const { data: addresses = [] } = useQuery({
    queryKey: ["addresses", selectedCustomer?.customer_id],
    queryFn: () => fetchAddresses(selectedCustomer!.customer_id),
    enabled: !!selectedCustomer,
  });

  const { data: menuItems = [] } = useQuery({
    queryKey: ["menuItems"],
    queryFn: fetchMenuItems,
  });

  useEffect(() => {
    if (selectedCustomer && addresses.length > 0) {
      const defaultAddress = addresses.find((addr) => addr.is_default);
      setSelectedAddressId(
        defaultAddress?.address_id || addresses[0].address_id
      );
    } else {
      setSelectedAddressId(null);
    }
  }, [selectedCustomer, addresses]);

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      onClose();
      resetState();
    },
  });

  const resetState = () => {
    setSelectedCustomer(null);
    setCustomerSearchTerm("");
    setCart([]);
    setOrderType("pickup");
    setSelectedAddressId(null);
  };

  const handleAddToCart = (item: MenuItem) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const handleRemoveFromCart = (itemToRemove: MenuItem) => {
    const itemIndex = cart.findIndex((item) => item.id === itemToRemove.id);
    if (itemIndex > -1) {
      const newCart = [...cart];
      newCart.splice(itemIndex, 1);
      setCart(newCart);
    }
  };

  const getCartSummary = () => {
    const summary = new Map<string, { item: MenuItem; quantity: number }>();
    cart.forEach((item) => {
      if (summary.has(item.id)) {
        summary.get(item.id)!.quantity++;
      } else {
        summary.set(item.id, { item, quantity: 1 });
      }
    });
    return Array.from(summary.values());
  };

  const cartSummary = getCartSummary();
  const totalAmount = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const handleSubmit = () => {
    if (
      !selectedCustomer ||
      cart.length === 0 ||
      (orderType === "delivery" && !selectedAddressId)
    ) {
      // Add user feedback here, e.g., a toast message
      return;
    }

    const orderItems = cartSummary.map(({ item, quantity }) => ({
      item_id: item.id,
      name: item.name,
      quantity: quantity,
      price: item.price,
    }));

    const newOrder: Partial<NewOrderPayload> = {
      customer_id: selectedCustomer.customer_id,
      order_type: orderType,
      status: "pending",
      subtotal_amount: totalAmount,
      total_amount: totalAmount,
      order_items: orderItems,
      delivery_address_id: orderType === "delivery" ? selectedAddressId : null,
      pending_reminder_sent: false,
      shipping_cost: 0,
    };

    createOrderMutation.mutate(newOrder);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Criar Novo Pedido</DialogTitle>
          <DialogDescription>
            Selecione um cliente, adicione itens e finalize o pedido.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto">
          {/* Customer and Menu Section */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">1. Cliente</h3>
              <Input
                placeholder="Buscar cliente por nome ou WhatsApp..."
                value={customerSearchTerm}
                onChange={(e) => setCustomerSearchTerm(e.target.value)}
              />
              <ScrollArea className="h-40 mt-2 border rounded-md">
                {customers?.map((customer) => (
                  <div
                    key={customer.customer_id}
                    className={`p-2 cursor-pointer hover:bg-muted ${
                      selectedCustomer?.customer_id === customer.customer_id
                        ? "bg-muted"
                        : ""
                    }`}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    {customer.name}
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">2. Cardápio</h3>
              <ScrollArea className="h-64 border rounded-md">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-2"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <Button size="sm" onClick={() => handleAddToCart(item)}>
                      Adicionar
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>

          {/* Cart Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">3. Carrinho</h3>
            {selectedCustomer && (
              <p className="text-sm font-medium">
                Cliente: {selectedCustomer.name}
              </p>
            )}
            <div className="flex gap-2 mb-2">
              <Button
                variant={orderType === "pickup" ? "default" : "outline"}
                onClick={() => setOrderType("pickup")}
              >
                Retirada
              </Button>
              <Button
                variant={orderType === "delivery" ? "default" : "outline"}
                onClick={() => setOrderType("delivery")}
              >
                Delivery
              </Button>
            </div>
            {orderType === "delivery" && selectedCustomer && (
              <div>
                <h4 className="text-md font-semibold mb-2">
                  Endereço de Entrega
                </h4>
                <Select
                  onValueChange={setSelectedAddressId}
                  value={selectedAddressId || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um endereço" />
                  </SelectTrigger>
                  <SelectContent>
                    {addresses.map((addr) => (
                      <SelectItem key={addr.address_id} value={addr.address_id}>
                        {`${addr.street}, ${addr.number} - ${addr.neighborhood}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <ScrollArea className="h-full border rounded-md">
              {cartSummary.length === 0 ? (
                <p className="p-4 text-muted-foreground">
                  O carrinho está vazio.
                </p>
              ) : (
                cartSummary.map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-2"
                  >
                    <div>
                      <p className="font-medium">
                        {quantity}x {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.price * quantity)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveFromCart(item)}
                    >
                      Remover
                    </Button>
                  </div>
                ))
              )}
            </ScrollArea>
            <div className="mt-auto pt-4 border-t">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !selectedCustomer ||
              cart.length === 0 ||
              (orderType === "delivery" && !selectedAddressId) ||
              createOrderMutation.isPending
            }
          >
            {createOrderMutation.isPending ? "Criando..." : "Criar Pedido"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
