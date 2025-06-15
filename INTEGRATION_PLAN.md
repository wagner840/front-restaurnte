# Plano de Integração com o Supabase

Este documento detalha o plano para integrar o Supabase a este projeto de dashboard de restaurante, substituindo os dados mockados por uma fonte de dados real.

## Fase 1: Configuração e Instalação

1.  **Instalar a Biblioteca do Supabase:** Adicionar o cliente Supabase como uma dependência do projeto.
    ```bash
    npm install @supabase/supabase-js
    ```
2.  **Configurar Variáveis de Ambiente:** Criar um arquivo `.env.local` na raiz do projeto para armazenar de forma segura a URL e a chave anônima (anon key) do Supabase.
    ```
    VITE_SUPABASE_URL=https://cjbivegezpcqqsaiwlmk.supabase.co
    VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYml2ZWdlenBjcXFzYWl3bG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDg5ODQsImV4cCI6MjA2NDcyNDk4NH0.ByjkXfXm6dkA2H0BDrMkBfMcOR9gA9V9y5RsTweO0A8
    ```
3.  **Inicializar o Cliente Supabase:** Criar um arquivo de configuração centralizado (`src/lib/supabaseClient.ts`) para inicializar o cliente Supabase.

## Fase 2: Autenticação

1.  **Atualizar o Hook de Autenticação:** Modificar o hook `src/hooks/useAuth.ts` para interagir com o sistema de autenticação do Supabase.
    - Verificar a sessão do usuário no carregamento inicial.
    - Implementar as funções de login e logout.
2.  **Atualizar a Tela de Login:** Conectar o formulário de login em `src/screens/Login/Login.tsx` para usar as novas funções de autenticação.

## Fase 3: Migração dos Dados

1.  **Criar Funções de Serviço:** Desenvolver um conjunto de funções (ex: em `src/services/api.ts`) para buscar os dados das tabelas no Supabase (`customers`, `orders`, `addresses`).
2.  **Substituir Dados Mockados:** Substituir as importações estáticas de `src/data/mockData.ts` por chamadas às novas funções de serviço que buscam dados do Supabase.
3.  **Atualizar Tipos:** Garantir que as interfaces em `src/types/index.ts` correspondam à estrutura dos dados do Supabase.

## Visualização do Fluxo de Dados

```mermaid
graph TD
    subgraph Frontend (React App)
        A[Componente Dashboard] --> B{Hook (ex: useOrders)};
        B --> C[Funções de API (api.ts)];
    end

    subgraph Backend (Supabase)
        D[Tabela orders]
        E[Tabela customers]
    end

    C -- "supabase.from('orders').select(...)" --> D;
    C -- "supabase.from('customers').select(...)" --> E;

    D -- Dados dos Pedidos --> C;
    E -- Dados dos Clientes --> C;

    C -- Dados Formatados --> B;
    B -- "state (loading, data, error)" --> A;
```
