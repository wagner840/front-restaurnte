// Mantido para referência, mas não será mais usado diretamente nos pedidos
export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
  available: boolean;
  created_at: string;
}

// Tipo para os itens dentro do campo JSONB 'order_items'
// Flexível para suportar diferentes estruturas do banco de dados
export interface OrderItemJson {
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "completed";

export interface Order {
  order_id: string;
  customer_id: string | null;
  delivery_address_id: string | null;
  order_items: OrderItemJson[];
  order_type: "delivery" | "pickup";
  status: OrderStatus;
  subtotal_amount: number;
  shipping_cost: number;
  total_amount: number;
  pending_reminder_sent: boolean;
  created_at: string;
  last_updated_at: string;
  customerName?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface DashboardStats {
  ordersToday: number;
  revenueToday: number;
  activeOrders: number;
  completionRate: number;
  revenueGrowth: number;
  activeCustomers30d: number;
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
  birthday_status: BirthdayStatus;
  created_at: string;
  last_contacted_at: string | null;
  Is_Gift_Used: string | null;
  whatsapp_chat_id: number | null;
}

export interface CustomerDetails {
  totalOrders: number;
  totalSpent: number;
  favoriteDays: string[];
}

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning";

export interface SalesByCategory {
  category: string;
  total_sales: number;
  total_quantity: number;
}

export interface SalesByProduct {
  product_name: string;
  total_sales: number;
}

export interface SalesByCustomer {
  customer_name: string;
  total_sales: number;
}
