# RestaurantePro - Painel de Gerenciamento

Um painel de controle moderno e eficiente para gerenciamento de restaurantes, permitindo a administração de cardápios, pedidos, clientes e o acompanhamento de métricas de desempenho.

![Badge](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Badge](https://img.shields.io/badge/React-18.2.0-blue)
![Badge](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Badge](https://img.shields.io/badge/Docker-ready-blue)
![Badge](https://img.shields.io/badge/Supabase-backend-green)

## 📖 Visão Geral

Este projeto é uma Single-Page Application (SPA) construída com React e TypeScript, utilizando Vite como ferramenta de build. A aplicação é totalmente containerizada com Docker, garantindo consistência entre os ambientes de desenvolvimento e produção. O backend é fornecido pelo Supabase.

Para uma documentação técnica detalhada sobre a arquitetura, componentes e funcionalidades, consulte o arquivo [`DOCUMENTACAO.md`](./DOCUMENTACAO.md).

## ✨ Funcionalidades Principais

- **Dashboard Interativo:** Visualização rápida de estatísticas de vendas, pedidos recentes e gráficos de desempenho.
- **Gerenciamento de Cardápio:** Funcionalidades completas de Criar, Ler, Atualizar e Deletar (CRUD) para itens do cardápio.
- **Gerenciamento de Pedidos:** Acompanhamento de pedidos com atualização de status em tempo real.
- **Base de Clientes:** Cadastro, consulta e visualização de detalhes e histórico de clientes.
- **Acompanhamento de Aniversariantes:** Lista de clientes aniversariantes para ações de marketing.
- **Autenticação Segura:** Sistema de login para acesso ao painel.

## 🛠️ Arquitetura e DevOps

O projeto foi estruturado seguindo as melhores práticas de DevOps para garantir um ciclo de desenvolvimento robusto, seguro e automatizado.

- **Containerização Total:** Utilizamos **Docker** e **Docker Compose** para criar ambientes de desenvolvimento e produção isolados e consistentes. Isso elimina o problema de "funciona na minha máquina" e simplifica o setup.
- **Ambientes Separados:**
  - **Desenvolvimento:** Um ambiente com **hot-reload** que permite que as alterações no código sejam refletidas instantaneamente no navegador, otimizando a produtividade.
  - **Produção:** Um build otimizado e servido por um **Nginx** robusto, garantindo performance e segurança.
- **CI/CD com GitHub Actions:** Um pipeline de integração contínua está configurado em `.github/workflows/ci.yml`. Ele automaticamente executa testes e builds a cada `push` ou `pull request`, garantindo a qualidade do código.

## 🚀 Como Começar (Ambiente de Desenvolvimento)

A maneira recomendada para rodar este projeto é usando Docker.

### Pré-requisitos

- Docker e Docker Compose
- Git

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/restaurante-pro.git
cd restaurante-pro
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env.local`. Este arquivo é usado tanto pelo Docker Compose quanto pelo Vite.

```bash
cp .env.example .env.local
```

Agora, edite o arquivo `.env.local` e preencha com suas credenciais do Supabase:

```
VITE_SUPABASE_URL=SUA_URL_DO_SUPABASE
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_DO_SUPABASE
```

### 3. Iniciar o Ambiente de Desenvolvimento

Com o Docker em execução, suba os contêineres. O Docker Compose usará automaticamente os arquivos `docker-compose.yml` e `docker-compose.override.yml` para criar o ambiente de desenvolvimento.

```bash
docker-compose up --build
```

- O comando `--build` é necessário apenas na primeira vez ou quando houver alterações nos Dockerfiles.

O aplicativo estará disponível em **`http://localhost:5173`**. Graças ao hot-reload, qualquer alteração no código-fonte será refletida instantaneamente no seu navegador.

Para parar o ambiente, pressione `Ctrl + C` no terminal e execute:

```bash
docker-compose down
```

## 🧪 Como Rodar os Testes

Os testes são executados dentro do contêiner de desenvolvimento para garantir consistência.

1.  Inicie o ambiente com `docker-compose up`.
2.  Em um novo terminal, acesse o shell do contêiner:
    ```bash
    docker-compose exec app sh
    ```
3.  Dentro do contêiner, execute os testes:
    ```bash
    npm test
    ```

## 🏗️ Build de Produção

Para simular o build de produção localmente (o mesmo que o pipeline de CI/CD executa), use o seguinte comando. Ele ignora o `override` de desenvolvimento e usa apenas a configuração de produção.

```bash
docker-compose -f docker-compose.yml build
```

## 🤝 Como Contribuir

1.  **Faça um Fork** do projeto.
2.  **Crie uma Branch** para sua feature (`git checkout -b feature/nova-feature`).
3.  **Faça o Commit** de suas mudanças (`git commit -m 'Adiciona nova feature'`).
4.  **Faça o Push** para a sua branch (`git push origin feature/nova-feature`).
5.  **Abra um Pull Request**.

---

Feito com ❤️ para simplificar a gestão de restaurantes.
