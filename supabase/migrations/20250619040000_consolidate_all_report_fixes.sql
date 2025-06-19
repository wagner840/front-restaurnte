-- 1. Padroniza get_top_selling_products para aceitar datas
CREATE OR REPLACE FUNCTION get_top_selling_products(
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS TABLE(product_name TEXT, total_quantity BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (oi.menu_item ->> 'name')::TEXT AS product_name,
        SUM((oi.menu_item ->> 'quantity')::BIGINT) AS total_quantity
    FROM
        public.orders o,
        jsonb_to_recordset(o.order_items) AS oi(menu_item jsonb)
    WHERE
        o.status = 'completed'
        AND (p_start_date IS NULL OR o.created_at::DATE >= p_start_date)
        AND (p_end_date IS NULL OR o.created_at::DATE <= p_end_date)
    GROUP BY
        product_name
    ORDER BY
        total_quantity DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- 2. Padroniza get_sales_by_customer para aceitar datas
CREATE OR REPLACE FUNCTION get_sales_by_customer(
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS TABLE(customer_name TEXT, total_sales NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.name AS customer_name,
        SUM(o.total_amount) AS total_sales
    FROM
        public.orders o
    JOIN
        public.customers c ON o.customer_id = c.id
    WHERE
        o.status = 'completed'
        AND (p_start_date IS NULL OR o.created_at::DATE >= p_start_date)
        AND (p_end_date IS NULL OR o.created_at::DATE <= p_end_date)
    GROUP BY
        c.name
    ORDER BY
        total_sales DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- 3. Garante que get_sales_by_category_flexible existe e aceita TEXT
CREATE OR REPLACE FUNCTION get_sales_by_category_flexible(
  p_start_date TEXT DEFAULT NULL,
  p_end_date TEXT DEFAULT NULL
)
RETURNS TABLE(category TEXT, total_sales NUMERIC)
LANGUAGE plpgsql
AS $$
DECLARE
  start_date DATE;
  end_date DATE;
BEGIN
  start_date := TO_DATE(p_start_date, 'YYYY-MM-DD');
  end_date := TO_DATE(p_end_date, 'YYYY-MM-DD');

  RETURN QUERY
  SELECT
      mi.category,
      SUM(oi.quantity * mi.price) AS total_sales
  FROM
      orders o
  JOIN
      LATERAL jsonb_to_recordset(o.order_items) AS oi(menu_item_id UUID, quantity INT) ON true
  JOIN
      menu_items mi ON oi.menu_item_id = mi.id
  WHERE
      o.status = 'completed'
      AND (start_date IS NULL OR o.created_at::DATE >= start_date)
      AND (end_date IS NULL OR o.created_at::DATE <= end_date)
  GROUP BY
      mi.category
  ORDER BY
      total_sales DESC;
END;
$$;

-- 4. Recria a função get_all_reports_data com as chamadas corretas
CREATE OR REPLACE FUNCTION get_all_reports_data(p_start_date TEXT, p_end_date TEXT)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    reports_data JSONB;
BEGIN
    SELECT jsonb_build_object(
        'salesByCategory', (SELECT jsonb_agg(t) FROM get_sales_by_category_flexible(p_start_date, p_end_date) t),
        'salesByProduct', (SELECT jsonb_agg(t) FROM get_top_selling_products(p_start_date::date, p_end_date::date) t),
        'salesByCustomer', (SELECT jsonb_agg(t) FROM get_sales_by_customer(p_start_date::date, p_end_date::date) t),
        'funnelDelivery', (SELECT jsonb_agg(t) FROM get_funnel_data_by_type('Delivery', p_start_date::date, p_end_date::date) t),
        'funnelRetirada', (SELECT jsonb_agg(t) FROM get_funnel_data_by_type('Retirada', p_start_date::date, p_end_date::date) t),
        'orderTypeComparison', (SELECT jsonb_agg(t) FROM get_order_type_comparison(p_start_date::date, p_end_date::date) t),
        'statusByTypeCounts', (SELECT jsonb_agg(t) FROM get_status_by_type_counts(p_start_date::date, p_end_date::date) t),
        'averageStatusTimeByType', (SELECT jsonb_agg(t) FROM get_average_status_time_by_type(p_start_date::date, p_end_date::date) t)
    )
    INTO reports_data;

    RETURN reports_data;
END;
$$;