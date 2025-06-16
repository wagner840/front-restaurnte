# Plano de Refatoração: `api.ts`

O objetivo desta refatoração é dividir o arquivo monolítico `src/services/api.ts` em múltiplos arquivos de serviço, cada um focado em um único domínio de negócio. Isso melhorará a modularidade, a manutenibilidade e a clareza do código.

## 1. Estrutura Proposta

A nova estrutura de serviços será organizada da seguinte forma:

```mermaid
graph TD
    subgraph Frontend Components
        direction LR
        A[OrdersScreen]
        B[CustomersScreen]
        C[MenuScreen]
        D[DashboardScreen]
    end

    subgraph Services Layer
        direction LR
        S1[orderService.ts]
        S2[customerService.ts]
        S3[menuService.ts]
        S4[dashboardService.ts]
        S5[utils.ts]
    end

    subgraph Backend (Supabase)
        direction LR
        DB[(Supabase Client)]
    end

    A --> S1
    B --> S2
    C --> S3
    D --> S4

    S1 --> DB
    S2 --> DB
    S3 --> DB
    S4 --> DB

    S2 -- depends on --> S1

    classDef service fill:#D6EAF8,stroke:#333,stroke-width:2px;
    class S1,S2,S3,S4,S5 service;
```

## 2. Mapeamento de Funções

As funções do arquivo `api.ts` serão movidas para os seguintes arquivos:

### `src/services/orderService.ts`

- `getOrders`
- `createOrder`
- `updateOrderStatus`
- `getOrdersByCustomer`

### `src/services/customerService.ts`

- `getCustomers`
- `createCustomer` (e seu alias `addCustomer`)
- `updateCustomerBirthdayStatus` (e seus aliases `updateCustomerGiftStatus`, `updateBirthdayStatus`)
- `getCustomerByWhatsapp`
- `getBirthdayCustomers`
- `getCustomerDetails` (dependerá de `orderService.ts`)

### `src/services/menuService.ts`

- `getMenuItems`
- `addMenuItem`
- `updateMenuItem`
- `deleteMenuItem`

### `src/services/dashboardService.ts`

- `getDashboardStats`
- `getSalesByCategory`
- `getActiveCustomers`
- `getRevenueGrowth`

### `src/lib/utils.ts`

- `normalizeString`

## 3. Passos de Execução

1.  **Criação dos Novos Arquivos:** Criar os quatro novos arquivos de serviço (`orderService.ts`, `customerService.ts`, `menuService.ts`, `dashboardService.ts`) no diretório `src/services/`.
2.  **Migração das Funções:** Mover o código de cada função para seu respectivo novo arquivo, garantindo que todas as importações necessárias (`supabaseClient`, tipos, etc.) sejam adicionadas.
3.  **Atualização das Importações:** Realizar uma busca global no projeto para encontrar todos os locais que importam de `src/services/api.ts` e atualizá-los para que importem dos novos módulos de serviço correspondentes.
4.  **Remoção do Arquivo Antigo:** Após confirmar que todas as dependências foram atualizadas e que a aplicação continua funcionando como esperado, o arquivo `src/services/api.ts` será removido do projeto.
