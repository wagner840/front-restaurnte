# Restaurant Management System

Um sistema moderno de gerenciamento de restaurantes construído com React, Vite, Supabase e TailwindCSS.

## Funcionalidades

- 📊 Dashboard com métricas em tempo real
- 🍽️ Gerenciamento de cardápio
- 📝 Controle de pedidos em tempo real
- 📱 Interface responsiva e moderna
- 🎨 Temas claro e escuro
- 🔄 Atualizações em tempo real com Supabase
- 📈 Gráficos e relatórios

## Tech Stack

- React 18
- TypeScript
- Vite
- Supabase (PostgreSQL, Auth, Realtime)
- TailwindCSS
- React Query
- Framer Motion
- Radix UI / shadcn/ui
- Lucide Icons

## Architecture Overview

- Single-Page Application (SPA) construída com React, TypeScript e Vite.
- Backend e banco de dados fornecidos pelo Supabase (utilizando PostgreSQL, Autenticação e Realtime).
- Estilização moderna e responsiva com TailwindCSS.
- Gerenciamento de estado do servidor e cache otimizado com React Query.

## Core Functionalities

- **Dashboard:** Apresenta métricas chave e um resumo visual das operações do restaurante em tempo real.
- **Menu Management (Gerenciamento de Cardápio):** Permite a criação, edição, visualização e exclusão de itens do cardápio, incluindo detalhes como nome, preço, categoria e imagem.
- **Order Management (Gerenciamento de Pedidos):** Facilita o acompanhamento de pedidos desde a criação até a entrega, com atualizações de status em tempo real e filtros para melhor organização.
- **Customer Management (Gerenciamento de Clientes):** Cadastro e visualização de informações dos clientes, incluindo histórico de pedidos.
- **Birthday Reminders (Lembretes de Aniversário):** Lista clientes aniversariantes para ações de relacionamento.
- **Reports (Relatórios):** Oferece visualizações gráficas sobre vendas, itens populares e outras métricas de desempenho.
- **Settings (Configurações):** Permite a personalização de aspectos do sistema e informações do restaurante.

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

## Pré-requisitos

- Node.js 18+
- Conta no Supabase

## Setup and Configuration

### Local Environment

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/restaurant-management.git
   cd restaurant-management
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env.local
   ```
   Edite o arquivo `.env.local` com suas credenciais do Supabase:
   ```env
   VITE_SUPABASE_URL=sua-url-do-supabase
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### Sentry Configuration

Para habilitar o monitoramento de erros com o Sentry:

1.  Adicione sua chave DSN (Data Source Name) do Sentry ao arquivo `.env.local`:
    ```env
    VITE_SENTRY_DSN=sua-chave-dsn-do-sentry
    ```
2.  A função `initSentry()` é chamada em `src/index.tsx`, que automaticamente inicializará o Sentry se a variável `VITE_SENTRY_DSN` estiver configurada.

## Available Scripts

- `npm run dev`: Inicia o servidor de desenvolvimento com Vite.
- `npm run build`: Compila o projeto para produção.
- `npm run lint`: Executa o ESLint para análise de código.
- `npm run preview`: Inicia um servidor local para visualizar a build de produção.
- `npm test`: (Configuração futura) Executa testes unitários e de integração.
- `npm test:e2e`: Executa testes end-to-end com Playwright.

## Docker Development

Para facilitar a configuração do ambiente de desenvolvimento, o projeto inclui suporte a Docker.

- **Dockerfile:** Define a imagem do contêiner para a aplicação React.
- **docker-compose.yml:** Orquestra o serviço da aplicação.

**Como usar:**

1.  Certifique-se de que o Docker e o Docker Compose estão instalados.
2.  Configure o arquivo `.env.local` conforme as instruções da seção "Local Environment". O Docker Compose utilizará este arquivo.
3.  Execute o comando na raiz do projeto:
    ```bash
    docker-compose up --build
    ```
4.  A aplicação estará disponível em `http://localhost:5173` (ou a porta configurada no `docker-compose.yml`).

## Security Considerations

-   **Supabase Row Level Security (RLS):** É crucial para a segurança dos dados. A política padrão é `DENY ALL`. Todas as tabelas devem ter políticas RLS explícitas que concedem acesso (`GRANT`) apenas quando necessário. As políticas devem, sempre que possível, utilizar `auth.uid()` para verificar a identidade do usuário e `auth.role()` para verificar sua função, garantindo que os usuários acessem apenas os dados que lhes pertencem ou que têm permissão para visualizar/modificar.
-   **Database Functions:** Ao definir funções no PostgreSQL (usadas via RPC pelo Supabase), especifique o contexto de segurança apropriado. Use `SECURITY DEFINER` com cautela, apenas quando a função precisar operar com privilégios elevados, e certifique-se de que a função é segura contra explorações. Prefira `SECURITY INVOKER` (padrão) para que a função execute com as permissões do usuário que a chamou.
-   **Server-Side Data Validation:** Para entradas complexas, como a estrutura JSON de `order_items`, é altamente recomendável implementar validação no lado do servidor (ex: usando funções de banco de dados ou hooks do Supabase) para garantir a integridade e o formato correto dos dados antes da inserção ou atualização.

## Testing

-   **Current:** O projeto utiliza Playwright para testes End-to-End (E2E), localizados no diretório `tests/`. Esses testes simulam interações do usuário em um navegador real.
-   **Future:** O objetivo é aumentar a cobertura de testes, implementando:
    -   **Unit Tests (Testes Unitários):** Com Vitest (ou Jest), para validar a lógica de funções individuais, hooks e componentes de forma isolada.
    -   **Integration Tests (Testes de Integração):** Com React Testing Library, para verificar a interação entre múltiplos componentes e a integração com serviços.

## Contributing

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## License

MIT

## Detailed Documentation

Para informações mais aprofundadas sobre o projeto, consulte os seguintes documentos:

-   [DOCUMENTACAO.md](DOCUMENTACAO.md) (Detailed Technical Documentation)
-   [IMPROVEMENT_PLAN.md](IMPROVEMENT_PLAN.md) (Consolidated Improvement Plan - Historical)
-   [REFACTORING_PLAN.md](REFACTORING_PLAN.md) (Refactoring Plan - Historical)
-   [COMPARATIVO_TECNICO_ANTES_DEPOIS.md](COMPARATIVO_TECNICO_ANTES_DEPOIS.md) (Technical Comparison Pre/Post UX Improvements - Historical)
-   [RELATORIO_MELHORIAS_UX_IMPLEMENTADAS.md](RELATORIO_MELHORIAS_UX_IMPLEMENTADAS.md) (UX Improvements Report - Historical)
