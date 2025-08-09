import { supabase } from "../lib/supabaseClient";
import { Order, Customer, Address } from "../types";
import { toast } from "sonner";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type OrderStatus = Order["status"];

// Função auxiliar para tratamento de erros
const handleError = (error: unknown, message: string): never => {
  const errorMessage =
    error instanceof Error ? error.message : "Erro desconhecido";
  toast.error(`${message}: ${errorMessage}`);
  throw new Error(errorMessage);
};

// Função auxiliar para formatar dados do pedido
interface OrderItemFromDB {
  menu_items?: { name: string; price: number };
  name?: string;
  item_name?: string;
  item?: string;
  price?: number;
  unit_price?: number;
  valor?: number;
  quantity?: number;
  quantidade?: number;
  notes?: string;
  observacoes?: string;
  observações?: string;
}

interface OrderWithRelations extends Order {
  customers: Customer | null;
  addresses: Address | null;
}

const formatOrderData = (order: OrderWithRelations): Order => {
  const customer = order.customers;
  const delivery_address = order.addresses;

  // The flexible structure of OrderItemJson (name?, item_name?, item?) is handled here
  // to ensure robustness against varied data from the DB. Ideally, the order_items
  // JSON structure should be standardized and validated on the server-side.
  // Normaliza os itens do pedido para garantir consistência
  let rawItems: any = order.order_items;
  if (typeof rawItems === "string") {
    try {
      rawItems = JSON.parse(rawItems);
    } catch {
      rawItems = [];
    }
  }

  const asArray = Array.isArray(rawItems)
    ? rawItems
    : rawItems && typeof rawItems === "object"
    ? (rawItems as any).items ?? [rawItems]
    : [];

  const normalizedOrderItems = asArray.map((item: OrderItemFromDB) => {
    const fallbackFromNotes =
      item.notes || item.observacoes || (item as any)["observações"] || "";
    const resolvedName =
      item.menu_items?.name ||
      item.name ||
      item.item_name ||
      item.item ||
      (fallbackFromNotes ? String(fallbackFromNotes) : undefined) ||
      "Item";

    const price = (() => {
      const precoAcento = (item as any)["preço"] as unknown;
      const candidates = [
        item.menu_items?.price,
        item.price,
        item.unit_price,
        item.valor,
        precoAcento,
      ];
      const numeric = candidates.find((v) => typeof v === "number");
      if (typeof numeric === "number") return numeric;
      const str = candidates.find((v) => typeof v === "string") as
        | string
        | undefined;
      return str
        ? Number(
            String(str)
              .replace(/[^0-9.,-]/g, "")
              .replace(",", ".")
          )
        : 0;
    })();
    const quantity = (() => {
      const candidates = [item.quantity, item.quantidade];
      const numeric = candidates.find((v) => typeof v === "number");
      if (typeof numeric === "number") return numeric;
      const str = candidates.find((v) => typeof v === "string") as
        | string
        | undefined;
      return str ? Number(str) : 1;
    })();
    const observationRaw =
      item.notes ||
      item.observacoes ||
      (item as any)["observações"] ||
      undefined;

    return {
      name: resolvedName,
      price,
      quantity,
      observation:
        resolvedName === fallbackFromNotes && fallbackFromNotes
          ? undefined
          : observationRaw,
    };
  });

  return {
    order_id: order.order_id,
    customer_id: order.customer_id || null,
    delivery_address_id: delivery_address?.address_id || null,
    delivery_address: delivery_address,
    order_items: normalizedOrderItems,
    order_type: order.order_type,
    status: order.status,
    subtotal_amount:
      typeof order.subtotal_amount === "number"
        ? order.subtotal_amount
        : order.total_amount,
    shipping_cost:
      typeof order.shipping_cost === "number" ? order.shipping_cost : 0,
    total_amount: order.total_amount,
    pending_reminder_sent: order.pending_reminder_sent ?? false,
    created_at: order.created_at,
    last_updated_at: order.last_updated_at ?? order.created_at,
    customerName: customer?.name || "Pedido #" + order.order_id.slice(-4),
    viewed_at: order.viewed_at,
  };
};

const ORDER_SELECT_QUERY = `
  *,
  customers(*),
  addresses(*)
`;

const ORDER_ITEMS_SELECT_QUERY = `
  *,
  order_items (
    quantity,
    menu_items (
      name,
      price
    )
  ),
  customers(*),
  addresses(*)
`;

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT_QUERY)
    .order("created_at", { ascending: false });

  if (error) {
    handleError(error, "Erro ao carregar pedidos");
  }

  return data?.map(formatOrderData) || [];
}

export async function getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT_QUERY)
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) {
    handleError(error, "Erro ao carregar pedidos");
  }

  return data?.map(formatOrderData) || [];
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Order> {
  const { data, error } = await supabase.rpc("update_order_status_rpc", {
    p_order_id: Number(orderId),
    p_new_status: status,
  });

  if (error) {
    handleError(error, "Erro ao atualizar status do pedido");
  }

  const record: any = Array.isArray(data) ? data[0] : data;
  if (!record) {
    throw new Error("Pedido não encontrado ou erro ao atualizar.");
  }

  return formatOrderData(record);
}

export const createOrder = async (
  orderData: Omit<Order, "order_id" | "created_at" | "customer_name">
): Promise<Order> => {
  const { data, error } = await supabase
    .from("orders")
    .insert([orderData])
    .select(ORDER_ITEMS_SELECT_QUERY)
    .single();

  if (error) {
    handleError(error, "Erro ao criar pedido");
  }
  if (!data) {
    throw new Error("Erro ao criar pedido: dados não retornados");
  }

  toast.success("Pedido criado com sucesso!");
  return formatOrderData(data);
};

export const getOrdersByCustomer = async (
  customerId: string
): Promise<Order[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_ITEMS_SELECT_QUERY)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    handleError(error, "Erro ao buscar pedidos do cliente");
  }

  return data?.map(formatOrderData) || [];
};

export const getOrderDetails = async (orderId: string): Promise<Order> => {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_ITEMS_SELECT_QUERY)
    .eq("order_id", orderId)
    .single();

  if (error) {
    handleError(error, "Erro ao buscar detalhes do pedido");
  }
  if (!data) {
    throw new Error("Pedido não encontrado");
  }

  return formatOrderData(data);
};

export const subscribeToOrders = (
  userId: string,
  callback: (payload: RealtimePostgresChangesPayload<Order>) => void
) => {
  const channel = supabase
    .channel(`realtime:orders:user_id=${userId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      callback
    )
    .subscribe();

  return channel;
};
