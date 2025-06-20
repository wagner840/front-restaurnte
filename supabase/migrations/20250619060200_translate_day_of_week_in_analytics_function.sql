CREATE OR REPLACE FUNCTION get_customer_analytics(p_customer_id UUID)
RETURNS TABLE (
  total_orders BIGINT,
  total_spent NUMERIC,
  average_ticket NUMERIC,
  most_frequent_day TEXT,
  top_products JSONB,
  last_order_date TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  WITH customer_orders AS (
    SELECT
      order_id,
      total_amount,
      created_at,
      order_items
    FROM orders
    WHERE customer_id = p_customer_id
  ),
  order_stats AS (
    SELECT
      COUNT(*) AS total_orders_calc,
      SUM(total_amount) AS total_spent_calc,
      MAX(created_at) AS last_order_date_calc
    FROM customer_orders
  ),
  day_frequency AS (
    SELECT
      CASE
        WHEN TRIM(TO_CHAR(created_at, 'Day')) = 'Sunday' THEN 'Domingo'
        WHEN TRIM(TO_CHAR(created_at, 'Day')) = 'Monday' THEN 'Segunda-feira'
        WHEN TRIM(TO_CHAR(created_at, 'Day')) = 'Tuesday' THEN 'Terça-feira'
        WHEN TRIM(TO_CHAR(created_at, 'Day')) = 'Wednesday' THEN 'Quarta-feira'
        WHEN TRIM(TO_CHAR(created_at, 'Day')) = 'Thursday' THEN 'Quinta-feira'
        WHEN TRIM(TO_CHAR(created_at, 'Day')) = 'Friday' THEN 'Sexta-feira'
        WHEN TRIM(TO_CHAR(created_at, 'Day')) = 'Saturday' THEN 'Sábado'
      END AS day_of_week,
      COUNT(*) as order_count
    FROM customer_orders
    GROUP BY day_of_week
    ORDER BY order_count DESC
    LIMIT 1
  ),
  product_frequency AS (
    SELECT
      jsonb_agg(
        jsonb_build_object('product', product_name, 'quantity', total_quantity)
      ) AS top_products_calc
    FROM (
      SELECT
        (item->>'name')::TEXT AS product_name,
        SUM((item->>'quantity')::INT) AS total_quantity
      FROM customer_orders,
           jsonb_array_elements(order_items) AS item
      GROUP BY product_name
      ORDER BY total_quantity DESC
      LIMIT 3
    ) AS top_prods
  )
  SELECT
    os.total_orders_calc,
    COALESCE(os.total_spent_calc, 0),
    CASE
      WHEN os.total_orders_calc > 0 THEN COALESCE(os.total_spent_calc, 0) / os.total_orders_calc
      ELSE 0
    END AS average_ticket_calc,
    df.day_of_week,
    COALESCE(pf.top_products_calc, '[]'::jsonb),
    os.last_order_date_calc
  FROM
    order_stats os
  LEFT JOIN
    day_frequency df ON true
  LEFT JOIN
    product_frequency pf ON true;
END;
$$ LANGUAGE plpgsql;