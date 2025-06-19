-- 1. Criar a tabela para o histórico de status
CREATE TABLE IF NOT EXISTS public.order_status_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    status TEXT NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_order
        FOREIGN KEY(order_id) 
        REFERENCES orders(order_id)
        ON DELETE CASCADE
);

-- 2. Criar a função que será chamada pelo trigger
CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Insere o status antigo no histórico ao atualizar
    IF (TG_OP = 'UPDATE') THEN
        IF OLD.status IS DISTINCT FROM NEW.status THEN
            INSERT INTO public.order_status_history (order_id, status, changed_at)
            VALUES (NEW.order_id, NEW.status, NOW());
        END IF;
    -- Insere o status inicial 'pending' ao criar um novo pedido
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO public.order_status_history (order_id, status, changed_at)
        VALUES (NEW.order_id, NEW.status, NOW());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Criar o trigger que chama a função após inserções ou atualizações na tabela orders
CREATE TRIGGER on_order_status_change
AFTER INSERT OR UPDATE OF status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.log_order_status_change();

-- Adicionar um comentário para explicar a funcionalidade da tabela
COMMENT ON TABLE public.order_status_history IS 'Registra cada mudança de status de um pedido para análises de tempo e performance.';