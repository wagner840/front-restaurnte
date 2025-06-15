// Mantido para referência, mas não será mais usado diretamente nos pedidos
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string | null;
}

// Tipo para os itens dentro do campo JSONB 'order_items'
// Flexível para suportar diferentes estruturas do banco de dados
export interface OrderItemJson {
  menuItemId?: string;
  // Campos de nome (um destes deve estar presente)
  item_name?: string;
  name?: string;
  item?: string;
  product_name?: string;
  // Campos obrigatórios
  quantity: number;
  price: number;
  // Campos opcionais
  notes?: string;
  details?: string;
}

export interface Order {
  order_id: string;
  created_at: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "completed";
  total_amount: number;
  order_type: "delivery" | "pickup";
  order_items: OrderItemJson[];

  // Campos das tabelas relacionadas
  customer: {
    name: string;
  } | null;

  address: {
    street: string;
    number: string;
    city: string;
  } | null;

  // Campos que não estão no schema mas podem ser úteis no frontend
  // Mapeado de `customer.name` para compatibilidade com componentes existentes
  customerName?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface DashboardStats {
  totalOrders: number;
  revenue: number;
  activeOrders: number;
  completedOrders: number;
}

export type BirthdayStatus =
  | "eligible"
  | "30d_sent"
  | "15d_sent"
  | "booked"
  | "declined"
  | "completed";

export interface Customer {
  customer_id: string;
  name: string;
  whatsapp: string;
  email: string;
  birthday: string | null;
  unique_code: string;
  birthday_status: BirthdayStatus | null;
  created_at: string;
  last_contacted_at: string | null;
  Is_Gift_Used: string | null; // Mantido conforme schema, mas usaremos birthday_status
  whatsapp_chat_id: number | null;
}

export interface CustomerDetails {
  totalOrders: number;
  totalSpent: number;
  favoriteDays: string[];
}
