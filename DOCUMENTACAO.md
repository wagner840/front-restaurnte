# Documentação Técnica - Sistema de Gerenciamento de Restaurante

## 1. Visão Geral

Este documento detalha a arquitetura, funcionalidades e estrutura do sistema de gerenciamento para restaurantes. A aplicação foi desenvolvida para fornecer uma interface centralizada para gerenciar pedidos, cardápio, clientes e obter insights sobre o desempenho do negócio.

A aplicação é uma Single-Page Application (SPA) construída com **React** e **TypeScript**, utilizando **Vite** como ferramenta de build e **Tailwind CSS** para estilização. O backend é totalmente gerenciado pelo **Supabase**, que fornece o banco de dados PostgreSQL, autenticação e APIs RESTful.

## 2. Estrutura do Projeto

A estrutura de pastas foi organizada para promover a modularidade e a escalabilidade do código.

```
restaurante-pro/
├── supabase/             # Contém as migrations do banco de dados do Supabase.
│   └── migrations/
├── src/
│   ├── components/       # Componentes React reutilizáveis (ex: botões, modais, cards).
│   ├── data/             # Mock data usado para desenvolvimento e testes.
│   ├── hooks/            # Hooks customizados (ex: useAuth para autenticação).
│   ├── lib/              # Configuração de clientes de API (Supabase) e funções utilitárias.
│   ├── screens/          # Componentes que representam as telas principais da aplicação (Dashboard, Pedidos, etc.).
│   ├── services/         # Funções que encapsulam a lógica de comunicação com a API do Supabase.
│   ├── types/            # Definições de tipos e interfaces TypeScript.
│   ├── App.tsx           # Componente raiz que gerencia o roteamento principal.
│   └── index.tsx         # Ponto de entrada da aplicação React.
├── .env.example          # Arquivo de exemplo para variáveis de ambiente.
├── docker-compose.yml    # Arquivo para orquestração de contêineres com Docker.
├── Dockerfile            # Define a imagem Docker para a aplicação frontend.
└── package.json          # Lista de dependências e scripts do projeto.
```

## 3. Autenticação

O fluxo de autenticação é o ponto de entrada do sistema, garantindo que apenas usuários autorizados acessem o painel.

- **Arquivo Principal:** [`src/App.tsx`](src/App.tsx)
- **Hook de Autenticação:** [`src/hooks/useAuth.ts`](src/hooks/useAuth.ts)
- **Tela de Login:** [`src/screens/Login/Login.tsx`](src/screens/Login/Login.tsx)

**Lógica:**

1.  O componente `App` utiliza o hook `useAuth` para verificar o estado da sessão do usuário com o Supabase.
2.  Enquanto a sessão está sendo verificada, `isLoading` é `true` e uma tela de carregamento é exibida.
3.  Se `isAuthenticated` for `true`, o componente `MainApp` (o painel principal) é renderizado.
4.  Caso contrário, o usuário é direcionado para a tela de `Login`.

## 4. Funcionalidades Principais

A aplicação principal (`MainApp`) é composta por um layout com uma barra lateral de navegação (`Sidebar`) e um cabeçalho (`Header`). O conteúdo principal é renderizado dinamicamente de acordo com a rota selecionada.

### 4.1. Dashboard

- **Arquivo:** [`src/screens/Dashboard/Dashboard.tsx`](src/screens/Dashboard/Dashboard.tsx)
- **Descrição:** A tela inicial após o login, fornecendo um resumo visual e em tempo real das operações do restaurante.
- **Componentes:**
  - `StatsCard`: Exibe métricas como "Pedidos Hoje", "Receita Hoje" e "Pedidos Ativos".
  - `RecentOrders`: Lista os 5 pedidos mais recentes.
  - `SalesByCategoryChart`: Gráfico de pizza com a distribuição da receita por categoria.
- **Fonte de Dados:** As informações são buscadas através de funções no [`src/services/api.ts`](src/services/api.ts), como `getDashboardStats`, `getOrders` e `getSalesByCategory`.

### 4.2. Cardápio

- **Arquivo:** [`src/screens/Menu/Menu.tsx`](src/screens/Menu/Menu.tsx)
- **Descrição:** Permite o gerenciamento completo (CRUD) dos itens do cardápio.
- **Funcionalidades:**
  - **Listagem e Busca:** Exibe os itens em cartões (`MenuItemCard`) e permite busca por nome e filtro por categoria.
  - **Adicionar e Editar:** Um modal (`MenuItemFormModal`) é usado para criar e atualizar itens.
  - **Exclusão:** A funcionalidade de exclusão está implementada, permitindo remover itens do cardápio.

### 4.3. Pedidos

- **Arquivo:** [`src/screens/Orders/Orders.tsx`](src/screens/Orders/Orders.tsx)
- **Descrição:** Centraliza o gerenciamento de todos os pedidos recebidos.
- **Funcionalidades:**
  - **Listagem e Filtros:** Exibe os pedidos em cartões (`OrderCard`) e permite filtrar por tipo (Delivery, Retirada) e status (Pendente, Confirmado, etc.).
  - **Atualização de Status:** O status de cada pedido pode ser alterado diretamente no card.

### 4.4. Clientes

- **Arquivo:** [`src/screens/Customers/Customers.tsx`](src/screens/Customers/Customers.tsx)
- **Descrição:** Gerenciamento da base de clientes.
- **Funcionalidades:**
  - **Listagem e Busca:** Exibe todos os clientes e permite busca por nome ou e-mail.
  - **Adicionar Cliente:** Um modal (`AddCustomerModal`) permite o cadastro de novos clientes.
  - **Detalhes do Cliente:** O modal `CustomerDetailModal` exibe o histórico de pedidos, total gasto e outras informações relevantes.

### 4.5. Aniversariantes

- **Arquivo:** [`src/screens/Birthdays/Birthdays.tsx`](src/screens/Birthdays/Birthdays.tsx)
- **Descrição:** Mostra uma lista de clientes que farão aniversário nos próximos 30 dias, facilitando ações de marketing.
- **Funcionalidades:**
  - **Listagem:** Exibe os aniversariantes em cartões (`BirthdayCustomerCard`).
  - **Gerenciamento de Status:** Permite atualizar o status do contato com o cliente (ex: "Elegível", "Contato Enviado", "Reservado").

## 5. Estrutura de Dados (Tipos)

- **Arquivo:** [`src/types/index.ts`](src/types/index.ts)
- **Descrição:** Define as interfaces TypeScript para os principais modelos de dados da aplicação, garantindo a consistência e a segurança de tipos.

**Exemplos de Tipos Principais:**

```typescript
// Exemplo de um item do cardápio
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
}

// Exemplo de um pedido
export interface Order {
  id: number;
  customer_id: string;
  status:
    | "Pendente"
    | "Confirmado"
    | "Preparando"
    | "Pronto"
    | "Entregue"
    | "Cancelado";
  total: number;
  order_type: "Delivery" | "Retirada";
  created_at: string;
  items: OrderItem[]; // Array de itens do pedido
  customers: Customer; // Objeto com dados do cliente
}

// Exemplo de um cliente
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
}
```

## 6. API de Serviços

- **Arquivo:** [`src/services/api.ts`](src/services/api.ts)
- **Descrição:** Centraliza todas as funções que interagem com o backend (Supabase) para buscar e manipular dados. O uso deste serviço desacopla a lógica de acesso a dados dos componentes da UI.

**Principais Funções:**

- `getOrders`, `createOrder`, `updateOrderStatus`
- `getCustomers`, `createCustomer`, `getCustomerDetails`
- `getMenuItems`, `addMenuItem`, `updateMenuItem`, `deleteMenuItem`
- `getDashboardStats`, `getSalesByCategory`
- `getBirthdayCustomers`, `updateCustomerBirthdayStatus`

## 7. Desenvolvimento com Docker

Para facilitar a configuração do ambiente de desenvolvimento, o projeto inclui suporte a Docker.

- **Dockerfile:** Define a imagem do contêiner para a aplicação React. Ele instala as dependências e define o comando para iniciar o servidor de desenvolvimento.
- **docker-compose.yml:** Orquestra o serviço da aplicação, mapeando as portas e volumes necessários para que o hot-reloading funcione corretamente.

**Como usar:**

1.  Certifique-se de que o Docker e o Docker Compose estão instalados.
2.  Configure o arquivo `.env` conforme descrito na seção "Como Começar".
3.  Execute o comando na raiz do projeto:
    ```bash
    docker-compose up --build
    ```
4.  A aplicação estará disponível em `http://localhost:5173`.

## 8. Possíveis Melhorias e Implementações Futuras

- **Relatórios Avançados:** Implementar a tela de relatórios com gráficos interativos sobre vendas, itens mais vendidos e horários de pico, com opção de exportação (PDF/CSV).
- **Configurações do Restaurante:** Criar um painel para configurar informações do restaurante (nome, endereço, horário) e taxas de entrega.
- **Notificações em Tempo Real:** Implementar notificações push ou sonoras para novos pedidos usando o Realtime do Supabase.
- **Programa de Fidelidade:** Expandir a funcionalidade de aniversariantes para um programa de fidelidade completo com pontos e recompensas.
- **Testes Automatizados:** Aumentar a cobertura de testes unitários e de integração para garantir a estabilidade do código a longo prazo.
