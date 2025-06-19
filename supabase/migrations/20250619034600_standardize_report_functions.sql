-- Padroniza get_top_selling_products para aceitar datas
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
    LIMIT 10; -- Mantém um limite razoável
END;
$$ LANGUAGE plpgsql;

-- Padroniza get_sales_by_customer para aceitar datas
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
    LIMIT 10; -- Mantém um limite razoável
END;
$$ LANGUAGE plpgsql;

-- Re-aplica a função get_all_reports_data para garantir que as chamadas estão corretas
-- com os parâmetros de data já convertidos.
CREATE OR REPLACE FUNCTION get_all_reports_data(p_start_date TEXT, p_end_date TEXT)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    reports_data JSONB;
    start_date DATE;
    end_date DATE;
BEGIN
    start_date := TO_DATE(p_start_date, 'YYYY-MM-DD');
    end_date := TO_DATE(p_end_date, 'YYYY-MM-DD');

    SELECT jsonb_build_object(
        'salesByCategory', (SELECT jsonb_agg(t) FROM get_sales_by_category(start_date, end_date) t),
        'salesByProduct', (SELECT jsonb_agg(t) FROM get_top_selling_products(start_date, end_date) t),
        'salesByCustomer', (SELECT jsonb_agg(t) FROM get_sales_by_customer(start_date, end_date) t),
        'funnelDelivery', (SELECT jsonb_agg(t) FROM get_funnel_data_by_type('Delivery', start_date, end_date) t),
        'funnelRetirada', (SELECT jsonb_agg(t) FROM get_funnel_data_by_type('Retirada', start_date, end_date) t),
        'orderTypeComparison', (SELECT jsonb_agg(t) FROM get_order_type_comparison(start_date, end_date) t),
        'statusByTypeCounts', (SELECT jsonb_agg(t) FROM get_status_by_type_counts(start_date, end_date) t),
        'averageStatusTimeByType', (SELECT jsonb_agg(t) FROM get_average_status_time_by_type(start_date, end_date) t)
    )
    INTO reports_data;

    RETURN reports_data;
END;
$$;