# RestaurantePro - Painel de Gerenciamento

Um painel de controle para gerenciamento de restaurantes, permitindo a administração eficiente de cardápios, pedidos e clientes.

## Funcionalidades Principais

- **Dashboard:** Visualização rápida de estatísticas de vendas e pedidos recentes.
- **Gerenciamento de Cardápio:** Funcionalidades completas de Criar, Ler, Atualizar e Deletar (CRUD) para itens do cardápio.
- **Gerenciamento de Pedidos:** Acompanhamento de pedidos com atualização de status em tempo real.
- **Gerenciamento de Clientes:** Cadastro e consulta de informações de clientes (CRUD).
- **Autenticação:** Sistema seguro de login para acesso ao painel.

## Tecnologias Utilizadas

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend & Banco de Dados:** Supabase
- **Testes:** Vitest, React Testing Library

## Como Começar (Setup)

Siga os passos abaixo para configurar o ambiente de desenvolvimento local.

1.  **Clonar o Repositório**

    ```bash
    git clone https://github.com/seu-usuario/restaurante-pro.git
    cd restaurante-pro
    ```

2.  **Configurar Variáveis de Ambiente**
    Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`.

    ```bash
    cp .env.example .env
    ```

    Em seguida, preencha o arquivo `.env` com as suas credenciais do Supabase (URL e Chave Pública).

3.  **Instalar Dependências**
    ```bash
    npm install
    ```

## Como Rodar o Projeto

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`.

## Como Rodar os Testes

Para executar a suíte de testes automatizados, utilize o comando:

```bash
npm test
```
