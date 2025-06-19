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