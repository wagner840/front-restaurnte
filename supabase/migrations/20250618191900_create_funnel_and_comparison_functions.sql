-- Função 1: Funil de Conversão por Tipo
CREATE OR REPLACE FUNCTION public.get_funnel_data_by_type(
    p_order_type TEXT,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS TABLE(status TEXT, total INT) AS $$
BEGIN
    RETURN QUERY
    SELECT o.status, COUNT(*) AS total
    FROM public.orders o
    WHERE o.order_type = p_order_type
      AND (p_start_date IS NULL OR o.created_at >= p_start_date)
      AND (p_end_date IS NULL OR o.created_at <= p_end_date)
    GROUP BY o.status
    ORDER BY total DESC;
END;
$$ LANGUAGE plpgsql;

-- Função 2: Comparativo Delivery vs Retirada
CREATE OR REPLACE FUNCTION public.get_order_type_comparison(
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS TABLE(type TEXT, total INT) AS $$
BEGIN
    RETURN QUERY
    SELECT o.order_type, COUNT(*) AS total
    FROM public.orders o
    WHERE (p_start_date IS NULL OR o.created_at >= p_start_date)
      AND (p_end_date IS NULL OR o.created_at <= p_end_date)
    GROUP BY o.order_type;
END;
$$ LANGUAGE plpgsql;

-- Função 3: Pedidos por Status e Tipo
CREATE OR REPLACE FUNCTION public.get_status_by_type_counts(
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS TABLE(status TEXT, delivery INT, retirada INT) AS $$
BEGIN
    RETURN QUERY
    SELECT
      s.status,
      COALESCE(SUM(CASE WHEN s.order_type = 'Delivery' THEN 1 ELSE 0 END), 0) AS delivery,
      COALESCE(SUM(CASE WHEN s.order_type = 'Retirada' THEN 1 ELSE 0 END), 0) AS retirada
    FROM (
      SELECT o.status, o.order_type
      FROM public.orders o
      WHERE (p_start_date IS NULL OR o.created_at >= p_start_date)
        AND (p_end_date IS NULL OR o.created_at <= p_end_date)
    ) s
    GROUP BY s.status
    ORDER BY s.status;
END;
$$ LANGUAGE plpgsql;

-- Função 4: Tempo Médio por Status e Tipo
CREATE OR REPLACE FUNCTION public.get_average_status_time_by_type(
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS TABLE(status TEXT, type TEXT, avg_minutes NUMERIC) AS $$
BEGIN
    RETURN QUERY
    WITH status_durations AS (
        SELECT
            h1.status,
            o.order_type,
            EXTRACT(EPOCH FROM (h2.changed_at - h1.changed_at)) / 60 AS minutes_in_status
        FROM
            public.order_status_history h1
        JOIN
            public.order_status_history h2 ON h1.order_id = h2.order_id AND h1.changed_at < h2.changed_at
        JOIN
            public.orders o ON o.order_id = h1.order_id
        WHERE NOT EXISTS (
            SELECT 1
            FROM public.order_status_history h3
            WHERE h3.order_id = h1.order_id AND h3.changed_at > h1.changed_at AND h3.changed_at < h2.changed_at
        )
        AND (p_start_date IS NULL OR h1.changed_at >= p_start_date)
        AND (p_end_date IS NULL OR h1.changed_at <= p_end_date)
    )
    SELECT
        status_durations.status,
        status_durations.order_type AS type,
        AVG(status_durations.minutes_in_status) AS avg_minutes
    FROM
        status_durations
    GROUP BY
        status_durations.status, status_durations.order_type;
END;
$$ LANGUAGE plpgsql; 