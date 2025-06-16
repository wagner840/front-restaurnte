import { supabase } from "../lib/supabaseClient";

export const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .gte("created_at", todayStr);

  if (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }

  if (!orders)
    return { totalOrders: 0, revenue: 0, activeOrders: 0, completedOrders: 0 };

  const stats = {
    totalOrders: orders.length,
    revenue: orders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
    activeOrders: orders.filter((order) =>
      ["pending", "confirmed", "preparing", "out_for_delivery"].includes(
        order.status
      )
    ).length,
    completedOrders: orders.filter((order) =>
      ["delivered", "completed"].includes(order.status)
    ).length,
  };

  return stats;
};

export const getSalesByCategory = async () => {
  const { data, error } = await supabase.rpc("get_sales_by_category");

  if (error) {
    console.error("Error fetching sales by category:", error);
    return [];
  }

  // Se não houver dados, retorna categorias padrão com valor zero
  if (!data || data.length === 0) {
    return [
      { category: "Lanches", amount: 0 },
      { category: "Bebidas", amount: 0 },
      { category: "Acompanhamentos", amount: 0 },
      { category: "Sobremesas", amount: 0 },
    ];
  }

  return data.map((item: any) => ({
    category: item.category,
    amount: item.total_sales,
  }));
};

export const getActiveCustomers = async (days = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const aMonthAgo = date.toISOString();

  const { data, error } = await supabase
    .from("orders")
    .select("customer_id")
    .gte("created_at", aMonthAgo)
    .not("customer_id", "is", null);

  if (error) {
    console.error("Error fetching active customers:", error);
    throw error;
  }

  if (!data) return 0;

  const uniqueCustomers = new Set(data.map((order) => order.customer_id));
  return uniqueCustomers.size;
};

export const getRevenueGrowth = async () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const [currentWeekData, previousWeekData] = await Promise.all([
    supabase
      .from("orders")
      .select("total_amount")
      .gte("created_at", lastWeek.toISOString())
      .lt("created_at", today.toISOString()),
    supabase
      .from("orders")
      .select("total_amount")
      .gte("created_at", twoWeeksAgo.toISOString())
      .lt("created_at", lastWeek.toISOString()),
  ]);

  if (currentWeekData.error) throw currentWeekData.error;
  if (previousWeekData.error) throw previousWeekData.error;

  const currentRevenue =
    currentWeekData.data?.reduce(
      (sum, order) => sum + (order.total_amount || 0),
      0
    ) || 0;
  const previousRevenue =
    previousWeekData.data?.reduce(
      (sum, order) => sum + (order.total_amount || 0),
      0
    ) || 0;

  if (previousRevenue === 0) return 0;

  const growth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  return growth;
};
