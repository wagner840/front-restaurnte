DROP VIEW IF EXISTS public.sales_report_view;

CREATE OR REPLACE VIEW public.sales_report_view
AS
SELECT
    mi.name AS product_name,
    mi.category,
    o.created_at,
    (i.price * i.quantity::numeric) AS sale_value
FROM
    public.orders o,
    LATERAL jsonb_to_recordset(o.order_items) i(item_id uuid, quantity integer, price numeric)
    JOIN public.menu_items mi ON i.item_id = mi.id
WHERE
    o.status = 'completed'::text AND
    jsonb_typeof(o.order_items) = 'array'::text AND
    jsonb_array_length(o.order_items) > 0;