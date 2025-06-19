-- Função para normalizar os itens do pedido
CREATE OR REPLACE FUNCTION normalize_order_items(items jsonb)
RETURNS jsonb AS $$
BEGIN
  RETURN (
    SELECT jsonb_agg(
      jsonb_build_object(
        'name', COALESCE(item->>'name', item->>'item_name', item->>'item', 'Item não especificado'),
        'price', COALESCE((item->>'price')::numeric, 0),
        'quantity', COALESCE((item->>'quantity')::integer, 1)
      )
    )
    FROM jsonb_array_elements(items) item
  );
END;
$$ LANGUAGE plpgsql;

-- Normaliza os itens do pedido existentes
UPDATE orders
SET order_items = normalize_order_items(order_items)
WHERE order_items IS NOT NULL;

-- Cria um trigger para normalizar os itens do pedido automaticamente
CREATE OR REPLACE FUNCTION normalize_order_items_trigger()
RETURNS trigger AS $$
BEGIN
  IF NEW.order_items IS NOT NULL THEN
    NEW.order_items = normalize_order_items(NEW.order_items);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER normalize_order_items_before_insert_update
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION normalize_order_items_trigger(); 