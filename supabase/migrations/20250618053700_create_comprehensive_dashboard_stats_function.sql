CREATE OR REPLACE FUNCTION get_comprehensive_dashboard_stats()
RETURNS TABLE(
    orders_today BIGINT,
    revenue_today NUMERIC,
    active_orders BIGINT,
    completion_rate NUMERIC,
    revenue_growth NUMERIC,
    active_customers_30d BIGINT
) AS $$
DECLARE
    today_start TIMESTAMPTZ := date_trunc('day', now());
    today_end TIMESTAMPTZ := today_start + interval '1 day';
    
    yesterday_start TIMESTAMPTZ := today_start - interval '1 day';
    
    last_7_days_start TIMESTAMPTZ := today_start - interval '7 days';
    prev_7_days_start TIMESTAMPTZ := today_start - interval '14 days';

    last_30_days_start TIMESTAMPTZ := today_start - interval '30 days';

    current_week_revenue NUMERIC;
    previous_week_revenue NUMERIC;
BEGIN
    -- Calcula a receita da semana atual (últimos 7 dias)
    SELECT COALESCE(SUM(total_amount), 0)
    INTO current_week_revenue
    FROM public.orders
    WHERE status = 'completed' AND last_updated_at >= last_7_days_start;

    -- Calcula a receita da semana anterior (7 dias antes dos últimos 7 dias)
    SELECT COALESCE(SUM(total_amount), 0)
    INTO previous_week_revenue
    FROM public.orders
    WHERE status = 'completed' AND last_updated_at >= prev_7_days_start AND last_updated_at < last_7_days_start;

    RETURN QUERY
    WITH today_orders AS (
        SELECT * FROM public.orders WHERE created_at >= today_start AND created_at < today_end
    ),
    completed_today AS (
        SELECT * FROM public.orders WHERE status = 'completed' AND last_updated_at >= today_start AND last_updated_at < today_end
    )
    SELECT
        -- Pedidos Hoje
        (SELECT COUNT(*) FROM today_orders) AS orders_today,
        -- Receita Hoje
        (SELECT COALESCE(SUM(total_amount), 0) FROM completed_today) AS revenue_today,
        -- Pedidos Ativos
        (SELECT COUNT(*) FROM public.orders WHERE status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery')) AS active_orders,
        -- Taxa de Conclusão de Hoje
        (
            SELECT
                CASE
                    WHEN (SELECT COUNT(*) FROM today_orders) > 0
                    THEN (SELECT COUNT(*) FROM completed_today)::NUMERIC * 100 / (SELECT COUNT(*) FROM today_orders)
                    ELSE 0
                END
        ) AS completion_rate,
        -- Crescimento da Receita (últimos 7 dias vs 7 dias anteriores)
        (
            SELECT
                CASE
                    WHEN previous_week_revenue > 0
                    THEN (current_week_revenue - previous_week_revenue) * 100 / previous_week_revenue
                    ELSE 0
                END
        ) AS revenue_growth,
        -- Clientes Ativos (últimos 30 dias)
        (SELECT COUNT(DISTINCT customer_id) FROM public.orders WHERE created_at >= last_30_days_start) AS active_customers_30d;
END;
$$ LANGUAGE plpgsql;