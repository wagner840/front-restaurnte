CREATE OR REPLACE FUNCTION public.get_average_status_time()
RETURNS TABLE(status TEXT, avg_minutes NUMERIC) AS $$
BEGIN
    RETURN QUERY
    WITH status_durations AS (
        SELECT
            h1.status,
            EXTRACT(EPOCH FROM (h2.changed_at - h1.changed_at)) / 60 AS minutes_in_status
        FROM
            public.order_status_history h1
        JOIN
            public.order_status_history h2 ON h1.order_id = h2.order_id AND h1.changed_at < h2.changed_at
        -- Garante que estamos pegando o próximo status na sequência
        WHERE NOT EXISTS (
            SELECT 1
            FROM public.order_status_history h3
            WHERE h3.order_id = h1.order_id AND h3.changed_at > h1.changed_at AND h3.changed_at < h2.changed_at
        )
    )
    SELECT
        status_durations.status,
        AVG(status_durations.minutes_in_status) AS avg_minutes
    FROM
        status_durations
    GROUP BY
        status_durations.status;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.get_average_status_time() IS 'Calcula o tempo médio, em minutos, que os pedidos passam em cada status.';