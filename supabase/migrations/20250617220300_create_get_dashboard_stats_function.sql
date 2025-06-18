CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE(total_revenue NUMERIC, total_orders BIGINT, total_customers BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT SUM(total_amount) FROM public.orders WHERE status = 'completed') AS total_revenue,
        (SELECT COUNT(*) FROM public.orders) AS total_orders,
        (SELECT COUNT(*) FROM public.customers) AS total_customers;
END;
$$ LANGUAGE plpgsql;