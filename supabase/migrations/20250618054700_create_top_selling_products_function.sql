CREATE OR REPLACE FUNCTION get_top_selling_products(limit_count INT)
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
    GROUP BY
        product_name
    ORDER BY
        total_quantity DESC
    LIMIT
        limit_count;
END;
$$ LANGUAGE plpgsql;