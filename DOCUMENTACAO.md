# Documentação do Sistema de Gerenciamento de Restaurante

## 1. Visão Geral

Este documento detalha a arquitetura, funcionalidades e estrutura do sistema de gerenciamento para restaurantes. A aplicação foi desenvolvida para fornecer uma interface centralizada para gerenciar pedidos, cardápio, clientes e obter insights sobre o desempenho do negócio.

A aplicação é construída em React com TypeScript e utiliza o Supabase como backend para banco de dados e autenticação.

## 2. Autenticação

O sistema possui uma tela de login onde o usuário pode acessar a aplicação principal.

- **Arquivo Principal:** `src/App.tsx`
- **Lógica:** O componente `App` utiliza o hook `useAuth` para verificar se o usuário está autenticado.
  - Se `isLoading` for verdadeiro, uma mensagem de "Carregando..." é exibida.
  - Se `isAuthenticated` for verdadeiro, o componente `MainApp` é renderizado.
  - Caso contrário, a tela de `Login` é exibida.

## 3. Funcionalidades Principais

A aplicação principal (`MainApp`) é composta por um layout com uma barra lateral de navegação (`Sidebar`) e um cabeçalho (`Header`). O conteúdo principal muda de acordo com a aba selecionada.

### 3.1. Dashboard

- **Arquivo:** `src/screens/Dashboard/Dashboard.tsx`
- **Descrição:** A tela inicial após o login, fornecendo um resumo visual das operações do restaurante.
- **Componentes:**
  - **Cartões de Estatísticas (`StatsCard`):** Exibem dados em tempo real como "Pedidos Hoje", "Receita Hoje", "Pedidos Ativos" e "Taxa de Conclusão".
  - **Pedidos Recentes (`RecentOrders`):** Lista os últimos 5 pedidos, com um link para a tela de "Pedidos".
  - **Vendas por Categoria (`SalesByCategoryChart`):** Um gráfico de pizza que mostra a distribuição da receita por categoria de item do cardápio.
  - **Estatísticas Rápidas:** Mostra o crescimento da receita em comparação com a semana anterior e o número de clientes ativos nos últimos 30 dias.
- **Fonte de Dados:** Os dados são buscados através de várias funções no `src/services/api.ts`, como `getDashboardStats`, `getOrders`, `getSalesByCategory`, etc.

### 3.2. Cardápio

- **Arquivo:** `src/screens/Menu/Menu.tsx`
- **Descrição:** Permite o gerenciamento completo dos itens do cardápio.
- **Funcionalidades:**
  - **Listagem de Itens:** Exibe todos os itens do cardápio em cartões (`MenuItemCard`).
  - **Adicionar e Editar:** Um modal (`MenuItemFormModal`) é usado para criar novos itens ou editar existentes.
  - **Busca e Filtro:** É possível buscar itens por nome ou descrição e filtrar por categoria.
  - **Exclusão:** A funcionalidade de exclusão está presente, mas marcada como "TODO" para implementação da chamada de API.
- **Fonte de Dados:** `getMenuItems` busca os itens do Supabase. As operações de criação e edição interagem diretamente com a tabela `menu_items`.

### 3.3. Pedidos

- **Arquivo:** `src/screens/Orders/Orders.tsx`
- **Descrição:** Centraliza o gerenciamento de todos os pedidos.
- **Funcionalidades:**
  - **Listagem de Pedidos:** Exibe todos os pedidos em cartões (`OrderCard`).
  - **Filtros:** Permite filtrar pedidos por tipo ("Delivery" ou "Retirada") e por status (Pendente, Confirmado, Preparando, etc.).
  - **Atualização de Status:** O status de cada pedido pode ser atualizado diretamente no cartão.
- **Fonte de Dados:** `getOrders` busca os pedidos e `updateOrderStatus` atualiza o status no Supabase.

### 3.4. Clientes

- **Arquivo:** `src/screens/Customers/Customers.tsx`
- **Descrição:** Gerenciamento da base de clientes.
- **Funcionalidades:**
  - **Listagem e Busca:** Exibe uma lista de todos os clientes e permite a busca por nome ou e-mail.
  - **Adicionar Cliente:** Um modal (`AddCustomerModal`) permite o cadastro de novos clientes.
  - **Detalhes do Cliente:** Ao clicar em "Ver Detalhes", um modal (`CustomerDetailModal`) é aberto, exibindo o histórico de pedidos do cliente, total gasto e dias favoritos para pedir.
- **Fonte de Dados:** `getCustomers` e `getCustomerDetails` do `src/services/api.ts`.

### 3.5. Aniversariantes

- **Arquivo:** `src/screens/Birthdays/Birthdays.tsx`
- **Descrição:** Mostra uma lista de clientes que farão aniversário nos próximos 30 dias.
- **Funcionalidades:**
  - **Listagem:** Exibe os clientes aniversariantes em cartões (`BirthdayCustomerCard`).
  - **Gerenciamento de Status:** Permite atualizar o status do contato com o cliente (ex: "eligible", "30d_sent", "booked").
- **Fonte de Dados:** `getBirthdayCustomers` busca os dados no Supabase.

### 3.6. Relatórios e Configurações

Atualmente, as seções de "Relatórios" e "Configurações" estão marcadas como "Em desenvolvimento" e não possuem funcionalidades implementadas.

## 4. Estrutura de Dados

- **Arquivo:** `src/types/index.ts`
- **Descrição:** Define as interfaces TypeScript para os principais modelos de dados da aplicação.
- **Principais Tipos:**
  - `Order`: Representa um pedido, incluindo itens, cliente e endereço.
  - `Customer`: Representa um cliente, com informações de contato e aniversário.
  - `MenuItem`: Representa um item do cardápio.
  - `DashboardStats`: Estrutura para os dados exibidos no dashboard.
  - `CustomerDetails`: Detalhes agregados sobre um cliente.

## 5. API de Serviços

- **Arquivo:** `src/services/api.ts`
- **Descrição:** Contém todas as funções que interagem com o backend (Supabase) para buscar e manipular dados.
- **Principais Funções:**
  - `getOrders`, `createOrder`, `updateOrderStatus`
  - `getCustomers`, `createCustomer`, `getCustomerDetails`
  - `getMenuItems`, `addMenuItem`, `updateMenuItem`
  - `getDashboardStats`, `getSalesByCategory`, `getActiveCustomers`
  - `getBirthdayCustomers`, `updateCustomerBirthdayStatus`

## 6. Possíveis Melhorias e Implementações Futuras

Com base na análise do código, aqui estão algumas sugestões de melhorias e novas funcionalidades:

- **Relatórios Avançados:**
  - Implementar a tela de relatórios com gráficos interativos sobre vendas, itens mais vendidos, horários de pico, etc.
  - Permitir a exportação de relatórios em PDF ou CSV.
- **Configurações do Restaurante:**
  - Criar um painel onde o usuário possa configurar informações do restaurante (nome, endereço, horário de funcionamento).
  - Permitir a personalização de taxas de entrega.
- **Notificações em Tempo Real:**
  - Implementar notificações push ou sonoras para novos pedidos.
- **Programa de Fidelidade:**
  - Expandir a funcionalidade de aniversariantes para um programa de fidelidade completo, com pontos e recompensas.
- **Exclusão de Itens (Cardápio):**
  - Implementar a lógica de exclusão no `MenuItemCard` e `api.ts` que atualmente está como "TODO".
- **Testes Automatizados:**
  - Adicionar testes unitários e de integração para garantir a estabilidade do código.
