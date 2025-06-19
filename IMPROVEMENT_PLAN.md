# Plano de Melhorias Consolidado para o Dashboard

Este plano visa aprimorar a experiência do usuário (UX), a interface (UI) e adicionar funcionalidades inteligentes para transformar o dashboard em uma ferramenta de gestão ainda mais poderosa e agradável de usar.

---

### **Fase 1: Refatoração da UI e UX — Cores, Animações e Feedback**

1.  **Correção de Cores e Contraste:**

    - **Ação:** Substituir cores de texto fixas (`text-black`, `text-white`) no `OrderCard.tsx` por variáveis de `foreground` do Tailwind (ex: `text-status-pending-foreground`) para garantir legibilidade em ambos os temas, `light` e `dark`.

2.  **Destaque Visual dos Pedidos:**

    - **Ação:** Adicionar uma borda lateral colorida (`border-l-4`) ao `OrderCard`, cuja cor corresponderá ao status do pedido (ex: `border-l-yellow-500` para pendente), para identificação rápida.

3.  **Animação para Pedidos Pendentes:**

    - **Ação:** Criar e aplicar uma nova animação de `pulse` mais chamativa no `tailwind.config.cjs` para os cards de pedidos com status `pending`, tanto na tela de Pedidos quanto no dashboard principal.

4.  **Implementação de Toasts e Notificações Sonoras:**
    - **Ação:**
      - Integrar o `shadcn-ui Toast` para dar feedback visual em ações (mudança de status, criação de item, etc.).
      - Criar um hook `useNotificationSound` que escuta novos pedidos `pending` via Supabase Realtime e toca o som de `public/sounds/notification.mp3`.

---

### **Fase 2: Reorganização da Interface e Configurações**

1.  **Mover o Controle de Tema:**

    - **Ação:** Remover o botão de troca de tema do `Header.tsx` e centralizar essa funcionalidade exclusivamente no `Switch` já existente na página `Settings.tsx`.

2.  **Adicionar Controle de Efeitos Sonoros:**
    - **Ação:** Adicionar um novo `Switch` na página `Settings.tsx` para permitir que o usuário ative ou desative os efeitos sonoros. O estado será gerenciado globalmente.

---

### **Fase 3: Evolução Funcional e Inteligência de Negócio**

1.  **Dashboard Inteligente (Insights Proativos):**

    - **Alertas de Pedidos Atrasados:**
      - **Ação:**
        1.  **Nova Tabela:** Criar a tabela `order_status_history` (`history_id`, `order_id`, `status`, `changed_at`) para registrar cada mudança de status dos pedidos.
        2.  **Trigger:** Criar um trigger na tabela `orders` que popula a `order_status_history` a cada atualização de status.
        3.  **Função SQL:** Criar a função `get_average_status_time()` que calcula o tempo médio em cada etapa usando a nova tabela de histórico.
        4.  **UI:** No frontend, comparar o tempo atual do pedido com a média e destacar visualmente os pedidos atrasados.
    - **Gráfico de Horários de Pico:**
      - **Ação:** Criar a função `get_sales_by_hour()` no Supabase e um novo componente de gráfico de barras no dashboard para exibir o volume de pedidos por hora.

2.  **Enriquecimento das Páginas Atuais (Visão 360º):**

    - **Histórico de Pedidos do Cliente:**
      - **Ação:** Criar a função `get_orders_by_customer(customer_id)` e adicionar uma aba "Histórico" no modal de detalhes do cliente para listar suas compras passadas.
    - **Indicador de Popularidade no Cardápio:**
      - **Ação:** Usar a função existente `get_top_selling_products()` para adicionar um selo de "Mais Vendido" nos itens correspondentes na tela de cardápio.

3.  **Automação de Marketing (Reativação de Clientes):**
    - **Ação:** Criar a função `get_inactive_customers(days_inactive)` no Supabase. Configurar um workflow no n8n que usa essa função para encontrar clientes inativos e envia uma mensagem de reengajamento com um cupom via WhatsApp, usando a tabela `n8n_fila_mensagens`.
