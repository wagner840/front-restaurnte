CREATE OR REPLACE FUNCTION get_sales_by_category()
RETURNS TABLE(category TEXT, total_sales NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT
    mi.category,
    SUM((oi.item->>'quantity')::numeric * (oi.item->>'price')::numeric) AS total_sales
  FROM
    public.orders,
    jsonb_array_elements(order_items) AS oi(item)
  JOIN
    public.menu_items mi ON mi.name = COALESCE(oi.item->>'item_name', oi.item->>'name', oi.item->>'item')
  WHERE
    order_items IS NOT NULL AND
    jsonb_typeof(order_items) = 'array' AND
    jsonb_array_length(order_items) > 0
  GROUP BY
    mi.category
  ORDER BY
    total_sales DESC;
END;
$$ LANGUAGE plpgsql;