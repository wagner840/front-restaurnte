// Represents an item on the restaurant's menu, used for menu management tasks.
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
  name?: string;
  item_name?: string;
  item?: string;
  price: number;
  quantity: number;
  // Campo unificado para observações/notas vindas do agente
  observation?: string;
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
  viewed_at: string | null;
  customerName?: string;
  delivery_address?: Address | null;
}

export interface Address {
  address_id: string;
  customer_id: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
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

export interface CustomerAnalyticsData {
  total_orders: number;
  total_spent: number;
  average_ticket: number;
  most_frequent_day: string | null;
  top_products: Array<{
    product: string;
    quantity: number;
  }>;
  last_order_date: string | null;
}

export interface CustomerDetails {
  totalOrders: number;
  totalSpent: number;
  averageTicket: number;
  mostFrequentDay: string | null;
  favoriteProducts: Array<{
    product: string;
    quantity: number;
  }>;
  lastOrderDate: string | null;
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
}

export interface FunnelData {
  status: string;
  value: number;
}

export interface OrderTypeComparison {
  order_type: "delivery" | "pickup";
  count: number;
}

export interface AllReportsData {
  salesByCategory: SalesByCategory[];
  salesByProduct: SalesByProduct[];
  salesByCustomer: SalesByCustomer[];
  funnelDelivery: FunnelData[];
  funnelRetirada: FunnelData[];
  orderTypeComparison: OrderTypeComparison[];
}

export interface SalesByProduct {
  product_name: string;
  total_sales: number;
}

export interface SalesByCustomer {
  customer_name: string;
  total_sales: number;
}

export interface TopSellingProduct {
  product_name: string;
  total_quantity: number;
}

export interface RestaurantSettings {
  name: string;
  cnpj?: string;
  address?: string;
  logo_url?: string;
  opening_hours?: {
    seg: string;
    sab: string;
    dom: string;
  };
  integrations?: {
    whatsapp: string;
    ifood: string;
  };
  payment_methods?: string[];
}
