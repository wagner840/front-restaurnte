# Documentação Técnica - Sistema de Gerenciamento de Restaurante

## 1. Visão Geral

Este documento detalha a arquitetura, funcionalidades e estrutura do sistema de gerenciamento para restaurantes. A aplicação foi desenvolvida para fornecer uma interface centralizada para gerenciar pedidos, cardápio, clientes e obter insights sobre o desempenho do negócio.

A aplicação é uma Single-Page Application (SPA) construída com **React** e **TypeScript**, utilizando **Vite** como ferramenta de build e **Tailwind CSS** para estilização. O backend é totalmente gerenciado pelo **Supabase**, que fornece o banco de dados PostgreSQL, autenticação e APIs RESTful. Para o gerenciamento de estado do servidor, cache e sincronização de dados, o projeto adota a biblioteca **`@tanstack/react-query`**.

## 2. Estrutura do Projeto

A estrutura de pastas foi organizada para promover a modularidade, a reutilização de código e a aplicação de princípios de "clean code", com uma clara separação de responsabilidades.

```
restaurante-pro/
├── supabase/             # Contém as migrations do banco de dados do Supabase.
│   └── migrations/
├── src/
│   ├── components/       # Componentes React reutilizáveis.
│   │   ├── birthdays/     # Componentes relacionados a aniversariantes.
│   │   ├── customers/      # Componentes para a tela de clientes (tabelas, listas, modais).
│   │   ├── dashboard/      # Componentes específicos para o Dashboard.
│   │   ├── layout/         # Componentes de navegação e estrutura geral (Header, Sidebar).
│   │   ├── menu/           # Componentes para a tela de cardápio.
│   │   ├── orders/         # Componentes para a tela de pedidos (cards, filtros, listas).
│   │   ├── reports/        # Componentes para gráficos e relatórios.
│   │   └── ui/             # Componentes de UI genéricos e reutilizáveis (botões, modais, cards de erro, spinners).
│   ├── data/             # Mock data usado para desenvolvimento e testes.
│   ├── hooks/            # Hooks customizados que abstraem a lógica de dados e estado.
│   ├── lib/              # Configuração de clientes de API (Supabase) e funções utilitárias.
│   ├── screens/          # Componentes que representam as telas principais da aplicação (Dashboard, Pedidos, etc.).
│   ├── services/         # Funções que encapsulam a lógica de comunicação com a API do Supabase e regras de negócio.
│   ├── styles/           # Estilos globais.
│   ├── types/            # Definições de tipos e interfaces TypeScript.
│   ├── App.tsx           # Componente raiz que gerencia o roteamento principal.
│   └── index.tsx         # Ponto de entrada da aplicação React.
├── .env.example          # Arquivo de exemplo para variáveis de ambiente.
├── docker-compose.yml    # Arquivo para orquestração de contêineres com Docker.
├── Dockerfile            # Define a imagem Docker para a aplicação frontend.
└── package.json          # Lista de dependências e scripts do projeto.
```

## 3. Hooks Customizados

A refatoração introduziu diversos hooks customizados para encapsular lógica complexa, melhorar a reutilização e promover a separação de responsabilidades:

- **`useMediaQuery`**: Abstrai a lógica de detecção de tamanho de tela, permitindo a renderização condicional de componentes baseada em breakpoints (ex: desktop vs. mobile).
- **`useAuth`**: Gerencia o estado de autenticação do usuário, interagindo com o Supabase para login, logout e verificação de sessão.
- **`useCustomers`**: Responsável por buscar e gerenciar a lista completa de clientes.
- **`useFilteredCustomers`**: Encapsula a lógica de filtragem e busca de clientes com base em termos de pesquisa, otimizando o desempenho com `useMemo`.
- **`useFilteredOrders`**: Centraliza a lógica de filtragem e ordenação de pedidos, facilitando a manipulação dos dados na tela de Pedidos.
- **`useMenuItems`**: Gerencia todas as operações (CRUD) relacionadas aos itens do cardápio, incluindo a lógica de feedback visual com `sonner`.
- **`useReportsData`**: Abstrai a busca e o processamento de dados para os gráficos e relatórios.

## 4. Componentes Reutilizáveis

Foram criados novos componentes de UI genéricos para garantir consistência e reduzir a duplicação de código:

- **`PageHeader`**: Componente para cabeçalhos de página, aceitando título, descrição e botões de ação, utilizado em diversas telas como `Orders` e `Customers`.
- **`ErrorDisplay`**: Componente padronizado para exibir mensagens de erro de forma clara e consistente.
- **`LoadingSpinner`**: Indicador de carregamento genérico para fornecer feedback visual durante operações assíncronas.
- **`CustomersTable`**: Componente dedicado à exibição da lista de clientes em formato de tabela (desktop).
- **`CustomersListMobile`**: Componente para exibir a lista de clientes em formato de cards, otimizado para dispositivos móveis.
- **`OrderCard`**: Componente principal para exibir detalhes de um pedido. Foi refatorado e agora é composto por:
  - `OrderStatusBadge`: Exibe o status atual do pedido.
  - `OrderTypeTooltip`: Informa o tipo de pedido.
  - `OrderItemsList`: Lista os itens incluídos no pedido.
  - `OrderStatusActions`: Contém os botões para alterar o status do pedido.
- **`OrderFilters`**: Componente dedicado aos filtros na tela de Pedidos.

## 5. Funcionalidades Principais

A aplicação principal (`MainApp`) é composta por um layout com uma barra lateral de navegação (`Sidebar`) e um cabeçalho (`Header`). O conteúdo principal é renderizado dinamicamente de acordo com a rota selecionada.

### 5.1. Dashboard

- **Arquivo:** [`src/screens/Dashboard/Dashboard.tsx`](src/screens/Dashboard/Dashboard.tsx)
- **Descrição:** A tela inicial após o login, fornecendo um resumo visual das operações do restaurante.
- **Componentes e Melhorias:**
  - **`QuickStats.tsx`**: Um novo componente que exibe métricas chave como "Estatísticas Rápidas" (crescimento da receita e clientes ativos).
  - **`SalesByCategoryChart.tsx`**: Gráfico de pizza com a distribuição da receita por categoria.
  - **`RecentOrders.tsx`**: Lista os 5 pedidos mais recentes.
  - **Tratamento de Erros**: O componente `ErrorDisplay.tsx` é agora utilizado para exibir mensagens de erro de forma padronizada.

### 5.2. Cardápio

- **Arquivo:** [`src/screens/Menu/Menu.tsx`](src/screens/Menu/Menu.tsx)
- **Descrição:** Permite o gerenciamento completo (CRUD) dos itens do cardápio.
- **Funcionalidades:**
  - **Listagem e Busca:** Exibe os itens em cartões (`MenuItemCard`) e permite busca por nome e filtro por categoria. Os dados são gerenciados pelo hook `useMenuItems`.
  - **Adicionar e Editar:** Um modal (`MenuItemFormModal`) é usado para criar e atualizar itens.
  - **Exclusão:** A funcionalidade de exclusão utiliza uma **Atualização Otimista (Optimistic Update)**. Ao excluir um item, a UI é atualizada instantaneamente, assumindo que a operação no servidor será bem-sucedida. Em caso de erro, a UI é revertida ao estado anterior e uma notificação de erro é exibida.
- **Feedback ao Usuário:** Após cada operação de CRUD (criar, editar, excluir), uma notificação visual (toast) é exibida usando a biblioteca `sonner` para informar o sucesso ou falha da ação.

### 5.3. Pedidos

- **Arquivo:** [`src/screens/Orders/Orders.tsx`](src/screens/Orders/Orders.tsx)
- **Descrição:** Centraliza o gerenciamento de todos os pedidos recebidos, com atualizações em tempo real.
- **Funcionalidades e Refatorações:**
  - **Listagem e Filtros:** Exibe os pedidos em cartões (`OrderCard`) e permite filtrar por tipo e status. A UI de filtros foi extraída para o componente `OrderFilters.tsx`.
  - **Atualização de Status:** O status de cada pedido pode ser alterado diretamente no card.
  - **Componentização do `OrderCard`**: O componente `OrderCard` foi decomposto em componentes menores para melhor responsividade e manutenibilidade:
    - `OrderStatusBadge`: Exibe o status atual do pedido.
    - `OrderTypeTooltip`: Informa o tipo de pedido.
    - `OrderItemsList`: Lista os itens incluídos no pedido.
    - `OrderStatusActions`: Contém os botões para alterar o status do pedido.
  - **Hook `useFilteredOrders`**: Introduzido para gerenciar a lógica de filtragem e ordenação dos pedidos, simplificando o componente `Orders.tsx`.
  - **Atualizações em Tempo Real:** A tela utiliza a funcionalidade **Supabase Realtime**. O hook `useRealtimeOrders` se inscreve em eventos de broadcast do canal `orders`. Quando um novo pedido é criado em qualquer parte do sistema (ex: Ponto de Venda), um evento é emitido, e a query de pedidos é invalidada e atualizada automaticamente, exibindo o novo pedido na tela sem a necessidade de recarregamento manual.

### 5.4. Clientes

- **Arquivo:** [`src/screens/Customers/Customers.tsx`](src/screens/Customers/Customers.tsx)
- **Descrição:** Gerenciamento da base de clientes, com foco em responsividade e organização.
- **Estrutura e Funcionalidades:**
  - **Orquestração:** O componente `Customers.tsx` agora orquestra a lógica de busca e filtragem através dos hooks `useCustomers` e `useFilteredCustomers`.
  - **Responsividade:** O hook `useMediaQuery` é utilizado para determinar a visualização adequada:
    - **Desktop:** Utiliza o componente `CustomersTable.tsx` para exibir os clientes em formato de tabela.
    - **Mobile:** Utiliza o componente `CustomersListMobile.tsx` para exibir os clientes em formato de cards.
  - **Modais:** O componente `Customers.tsx` continua gerenciando a abertura dos modais `AddCustomerModal` (para cadastro) e `CustomerDetailModal` (para exibir detalhes e histórico de pedidos do cliente).

### 5.5. Aniversariantes

- **Arquivo:** [`src/screens/Birthdays/Birthdays.tsx`](src/screens/Birthdays/Birthdays.tsx)
- **Descrição:** Mostra uma lista de clientes que farão aniversário nos próximos 30 dias.
- **Funcionalidades:**
  - **Listagem:** Exibe os aniversariantes em cartões (`BirthdayCustomerCard`).
  - **Gerenciamento de Status:** Permite atualizar o status do contato com o cliente.

## 6. Gerenciamento de Estado com React Query

O projeto utiliza **`@tanstack/react-query`** para gerenciar o estado do servidor, simplificando a busca, o cache e a sincronização de dados com o backend. Essa abordagem substitui a necessidade de gerenciar manualmente estados de carregamento, erro e dados em componentes React.

- **Hooks Customizados:** A lógica do React Query é abstraída em hooks customizados, localizados em [`src/hooks/`](src/hooks/). Por exemplo, o hook [`useMenuItems`](src/hooks/useMenuItems.ts) encapsula toda a lógica para buscar, adicionar, atualizar e excluir itens do cardápio.
- **Caching e Invalidação:** O React Query armazena em cache os dados buscados para evitar requisições redundantes. Após uma mutação (ex: criar um novo item), a query correspondente (ex: a lista de itens) é invalidada, forçando a busca de dados atualizados e garantindo que a UI esteja sempre sincronizada com o estado do servidor.
- **Feedback Visual:** A biblioteca **`sonner`** é integrada aos hooks de mutação para fornecer feedback instantâneo ao usuário. Em caso de sucesso, uma notificação de "sucesso" é exibida; em caso de falha, uma notificação de "erro" aparece, melhorando a experiência do usuário.

## 7. Desenvolvimento com Docker

Para facilitar a configuração do ambiente de desenvolvimento, o projeto inclui suporte a Docker.

- **Dockerfile:** Define a imagem do contêiner para a aplicação React.
- **docker-compose.yml:** Orquestra o serviço da aplicação.

**Como usar:**

1.  Certifique-se de que o Docker e o Docker Compose estão instalados.
2.  Configure o arquivo `.env` a partir do `.env.example`.
3.  Execute o comando na raiz do projeto: `docker-compose up --build`
4.  A aplicação estará disponível em `http://localhost:5173`.

## 8. Possíveis Melhorias e Implementações Futuras

- **Relatórios Avançados:** Implementar a tela de relatórios com gráficos interativos sobre vendas, itens mais vendidos e horários de pico, com opção de exportação (PDF/CSV).
- **Configurações do Restaurante:** Criar um painel para configurar informações do restaurante (nome, endereço, horário) e taxas de entrega.
- **Programa de Fidelidade:** Expandir a funcionalidade de aniversariantes para um programa de fidelidade completo com pontos e recompensas.
- **Testes Automatizados:** Aumentar a cobertura de testes unitários e de integração para garantir a estabilidade do código a longo prazo.
