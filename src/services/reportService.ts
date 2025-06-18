import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { SalesByCategory, SalesByCustomer, SalesByProduct } from "../types";

/**
 * Busca dados de vendas agrupados por categoria.
 */
export const getSalesByCategory = async (
  startDate?: string,
  endDate?: string
): Promise<SalesByCategory[]> => {
  try {
    // Sempre passar os parâmetros explicitamente como null se não definidos
    const { data, error } = await supabase.rpc("get_sales_by_category", {
      p_start_date: startDate ?? null,
      p_end_date: endDate ?? null,
    });

    if (error) {
      toast.error("Erro ao buscar vendas por categoria.");
      console.error("Erro detalhado:", error);
      throw error;
    }

    return (data || []).map((item: any) => ({
      ...item,
      total_sales: item.total_sales || 0,
    }));
  } catch (error) {
    toast.error("Erro ao processar vendas por categoria.");
    console.error("Erro no processamento:", error);
    throw error;
  }
};

/**
 * Busca dados de vendas agrupados por produto.
 */
export const getSalesByProduct = async (
  startDate?: string,
  endDate?: string
): Promise<SalesByProduct[]> => {
  try {
    let query = supabase
      .from("sales_report_view")
      .select("product_name, sale_value");

    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Erro ao buscar vendas por produto.");
      console.error("Erro detalhado:", error);
      throw error;
    }

    // Agregação manual dos dados
    const salesByProduct = (data as any[]).reduce((acc, item) => {
      const productName = item.product_name;
      const existing = acc.find((p: any) => p.product_name === productName);
      if (existing) {
        existing.total_sales += item.sale_value;
      } else {
        acc.push({ product_name: productName, total_sales: item.sale_value });
      }
      return acc;
    }, [] as SalesByProduct[]);

    return salesByProduct.sort(
      (a: SalesByProduct, b: SalesByProduct) => b.total_sales - a.total_sales
    );
  } catch (error) {
    toast.error("Erro ao processar vendas por produto.");
    console.error("Erro no processamento:", error);
    throw error;
  }
};

/**
 * Busca dados de vendas agrupados por cliente.
 */
export const getSalesByCustomer = async (
  startDate?: string,
  endDate?: string
): Promise<SalesByCustomer[]> => {
  try {
    let query = supabase
      .from("orders")
      .select("total_amount, customers!inner(name)")
      .eq("status", "completed");

    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Erro ao buscar vendas por cliente.");
      console.error("Erro detalhado:", error);
      throw error;
    }

    // Agregação manual dos dados
    const salesByCustomer = (data as any[]).reduce((acc, item) => {
      const customerName = item.customers.name;
      const existing = acc.find((c: any) => c.customer_name === customerName);
      if (existing) {
        existing.total_sales += item.total_amount;
      } else {
        acc.push({
          customer_name: customerName,
          total_sales: item.total_amount,
        });
      }
      return acc;
    }, [] as SalesByCustomer[]);

    return salesByCustomer.sort(
      (a: SalesByCustomer, b: SalesByCustomer) => b.total_sales - a.total_sales
    );
  } catch (error) {
    toast.error("Erro ao processar vendas por cliente.");
    console.error("Erro no processamento:", error);
    throw error;
  }
};
