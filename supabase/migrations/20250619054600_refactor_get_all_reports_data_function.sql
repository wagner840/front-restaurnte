CREATE OR REPLACE FUNCTION get_all_reports_data(
  p_start_date TEXT,
  p_end_date TEXT
)
RETURNS JSONB AS $$
DECLARE
  reports_data JSONB;
BEGIN
  WITH date_range AS (
    SELECT
      p_start_date::DATE AS start_date,
      p_end_date::DATE AS end_date
  ),
  orders_in_range AS (
    SELECT *
    FROM orders
    WHERE created_at::DATE BETWEEN (SELECT start_date FROM date_range) AND (SELECT end_date FROM date_range)
  )
  SELECT jsonb_build_object(
    'salesByCategory', (
      SELECT COALESCE(jsonb_agg(t), '[]'::jsonb)
      FROM (
        SELECT
          oi.category,
          SUM(oi.price * oi.quantity) AS total_sales
        FROM orders_in_range o,
             jsonb_to_recordset(o.order_items) AS oi(name TEXT, price NUMERIC, quantity INT, category TEXT)
        GROUP BY oi.category
        ORDER BY total_sales DESC
      ) t
    ),
    'salesByProduct', (
      SELECT COALESCE(jsonb_agg(t), '[]'::jsonb)
      FROM (
        SELECT
          oi.name AS product_name,
          SUM(oi.price * oi.quantity) AS total_sales
        FROM orders_in_range o,
             jsonb_to_recordset(o.order_items) AS oi(name TEXT, price NUMERIC, quantity INT)
        GROUP BY oi.name
        ORDER BY total_sales DESC
        LIMIT 10
      ) t
    ),
    'salesByCustomer', (
      SELECT COALESCE(jsonb_agg(t), '[]'::jsonb)
      FROM (
        SELECT
          c.name AS customer_name,
          SUM(o.total_amount) AS total_sales
        FROM orders_in_range o
        JOIN customers c ON o.customer_id = c.customer_id
        GROUP BY c.name
        ORDER BY total_sales DESC
        LIMIT 10
      ) t
    ),
    'funnelDelivery', (
      SELECT COALESCE(jsonb_agg(t), '[]'::jsonb)
      FROM (
        SELECT status, COUNT(*) AS value
        FROM orders_in_range
        WHERE order_type = 'delivery'
        GROUP BY status
        ORDER BY
          CASE status
            WHEN 'pending' THEN 1
            WHEN 'confirmed' THEN 2
            WHEN 'preparing' THEN 3
            WHEN 'out_for_delivery' THEN 4
            WHEN 'delivered' THEN 5
            WHEN 'completed' THEN 6
            WHEN 'cancelled' THEN 7
            ELSE 8
          END
      ) t
    ),
    'funnelRetirada', (
      SELECT COALESCE(jsonb_agg(t), '[]'::jsonb)
      FROM (
        SELECT status, COUNT(*) AS value
        FROM orders_in_range
        WHERE order_type = 'pickup'
        GROUP BY status
        ORDER BY
          CASE status
            WHEN 'pending' THEN 1
            WHEN 'confirmed' THEN 2
            WHEN 'preparing' THEN 3
            WHEN 'completed' THEN 4
            WHEN 'cancelled' THEN 5
            ELSE 6
          END
      ) t
    ),
    'orderTypeComparison', (
      SELECT COALESCE(jsonb_agg(t), '[]'::jsonb)
      FROM (
        SELECT order_type, COUNT(*) AS count
        FROM orders_in_range
        GROUP BY order_type
      ) t
    )
  )
  INTO reports_data;

  RETURN reports_data;
END;
$$ LANGUAGE plpgsql;