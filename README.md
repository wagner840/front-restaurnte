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

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── hooks/         # Hooks personalizados
  ├── lib/           # Configurações e utilitários
  ├── screens/       # Páginas da aplicação
  ├── services/      # Serviços e APIs
  ├── styles/        # Estilos globais
  └── types/         # Definições de tipos
```

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
