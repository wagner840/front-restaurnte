# Restaurant Management System

Um sistema moderno de gerenciamento de restaurantes construído com React, Next.js, Supabase e TailwindCSS.

## Funcionalidades

- 📊 Dashboard com métricas em tempo real
- 🍽️ Gerenciamento de cardápio
- 📝 Controle de pedidos em tempo real
- 📱 Interface responsiva e moderna
- 🎨 Temas claro e escuro
- 🔄 Atualizações em tempo real com Supabase
- 📈 Gráficos e relatórios

## Tecnologias

- React 18
- Next.js 14
- Supabase
- TailwindCSS
- Framer Motion
- React Query
- Radix UI
- TypeScript

## Pré-requisitos

- Node.js 18+
- Conta no Supabase

## Configuração

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/restaurant-management.git
cd restaurant-management
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais do Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Configuração do Sentry

Crie (ou edite) o arquivo `.env.local` na raiz do projeto e adicione a seguinte linha:

```
VITE_SENTRY_DSN=https://344f557042f7113928cd433a1e162f8c@o4509517235814400.ingest.us.sentry.io/4509517275922432
```

Depois, siga para a integração no código fonte.

## Estrutura do Projeto

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

## Hooks Customizados

A refatoração introduziu diversos hooks customizados para encapsular lógica complexa, melhorar a reutilização e promover a separação de responsabilidades:

- **`useMediaQuery`**: Abstrai a lógica de detecção de tamanho de tela, permitindo a renderização condicional de componentes baseada em breakpoints (ex: desktop vs. mobile).
- **`useAuth`**: Gerencia o estado de autenticação do usuário, interagindo com o Supabase para login, logout e verificação de sessão.
- **`useCustomers`**: Responsável por buscar e gerenciar a lista completa de clientes.
- **`useFilteredCustomers`**: Encapsula a lógica de filtragem e busca de clientes com base em termos de pesquisa, otimizando o desempenho com `useMemo`.
- **`useFilteredOrders`**: Centraliza a lógica de filtragem e ordenação de pedidos, facilitando a manipulação dos dados na tela de Pedidos.
- **`useMenuItems`**: Gerencia todas as operações (CRUD) relacionadas aos itens do cardápio, incluindo a lógica de feedback visual com `sonner`.
- **`useReportsData`**: Abstrai a busca e o processamento de dados para os gráficos e relatórios.

## Componentes Reutilizáveis e Refatorados

Foram criados novos componentes de UI genéricos e componentes existentes foram refatorados para melhor modularidade e manutenibilidade:

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

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

MIT
