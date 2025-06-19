CREATE OR REPLACE FUNCTION get_all_reports_data(p_start_date TEXT, p_end_date TEXT)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    reports_data JSONB;
BEGIN
    SELECT jsonb_build_object(
        'salesByCategory', (SELECT jsonb_agg(t) FROM get_sales_by_category(p_start_date, p_end_date) t),
        'salesByProduct', (SELECT jsonb_agg(t) FROM get_top_selling_products(p_start_date, p_end_date) t),
        'salesByCustomer', (SELECT jsonb_agg(t) FROM get_sales_by_customer(p_start_date, p_end_date) t),
        'funnelDelivery', (SELECT jsonb_agg(t) FROM get_funnel_data_by_type('Delivery', p_start_date, p_end_date) t),
        'funnelRetirada', (SELECT jsonb_agg(t) FROM get_funnel_data_by_type('Retirada', p_start_date, p_end_date) t),
        'orderTypeComparison', (SELECT jsonb_agg(t) FROM get_order_type_comparison(p_start_date, p_end_date) t),
        'statusByTypeCounts', (SELECT jsonb_agg(t) FROM get_status_by_type_counts(p_start_date, p_end_date) t),
        'averageStatusTimeByType', (SELECT jsonb_agg(t) FROM get_average_status_time_by_type(p_start_date, p_end_date) t)
    )
    INTO reports_data;

    RETURN reports_data;
END;
$$;