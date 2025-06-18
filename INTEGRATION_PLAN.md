# Plano de Implementação e Melhorias

Este documento serve como um roteiro e checklist para as melhorias e novas features a serem implementadas no projeto.

---

## Fase 1: Setup e Configuração da Base

_O objetivo desta fase é instalar e configurar as bibliotecas fundamentais que servirão de alicerce para as próximas melhorias._

- [x] **1.1: Instalar Dependências Principais**

  - [x] Instalar `@tanstack/react-query` para gerenciamento de estado do servidor.
  - [x] Instalar `sonner` para o sistema de notificações (toasts).

- [x] **1.2: Configurar Provedores Globais**
  - [x] Envolver a aplicação com o `QueryClientProvider` no arquivo `src/App.tsx`.
  - [x] Adicionar o componente `<Toaster />` da `sonner` no layout principal para renderizar as notificações.

---

## Fase 2: Refatoração do Gerenciamento de Estado com React Query

_O objetivo é refatorar uma tela principal para usar o React Query, eliminando a lógica manual de `useState` para dados, loading e erros._

- [ ] **2.1: Refatorar a Tela de Cardápio (`MenuScreen`)**
  - [ ] Criar um hook customizado (ex: `useMenuItems`) que utiliza `useQuery` para buscar os itens do cardápio.
  - [ ] Substituir a lógica de `useEffect` e `useState` em `src/screens/Menu/Menu.tsx` pelo novo hook.
  - [ ] Criar um hook customizado (ex: `useCreateMenuItem`) que utiliza `useMutation` para adicionar novos itens.
  - [ ] Integrar a mutação no `MenuItemFormModal.tsx`.

---

## Fase 3: Feedback Visual com Notificações (Toasts)

_O objetivo é fornecer feedback claro e imediato ao usuário sobre o resultado de suas ações._

- [ ] **3.1: Integrar Notificações no CRUD de Cardápio**
  - [ ] Na mutação `useCreateMenuItem`, adicionar chamadas `toast.success()` no callback `onSuccess`.
  - [ ] Adicionar chamadas `toast.error()` no callback `onError` para informar o usuário sobre falhas.
  - [ ] Implementar o mesmo padrão para as mutações de **Update** e **Delete**.

---

## Fase 4: Otimização da UI com "Optimistic Updates"

_O objetivo é fazer a interface parecer instantaneamente responsiva, atualizando a UI antes mesmo da confirmação da API._

- [ ] **4.1: Implementar "Optimistic Update" na Exclusão de Itens**
  - [ ] Refatorar a mutação de exclusão de item para remover o item da lista da UI imediatamente.
  - [ ] Implementar a lógica de `onSettled` e `onError` para reverter a alteração na UI caso a chamada à API falhe.

---

## Fase 5: Notificações em Tempo Real

_O objetivo é usar o poder do Supabase Realtime para que os dados mais críticos sejam atualizados na tela sem a necessidade de recarregar a página._

- [ ] **5.1: Implementar Atualizações em Tempo Real na Tela de Pedidos**
  - [ ] Criar uma nova função no `orderService.ts` para se inscrever nas alterações da tabela `orders` do Supabase.
  - [ ] Criar um hook `useRealtimeOrders` que utiliza essa função e invalida a query de pedidos do React Query (`queryClient.invalidateQueries`) sempre que uma nova atualização chegar.
  - [ ] Integrar este hook na tela `src/screens/Orders/Orders.tsx`.

---

## Fase 6: Testes e Documentação Final

_O objetivo é garantir a qualidade das novas implementações e atualizar a documentação para refletir o estado final do projeto._

- [ ] **6.1: Adicionar Testes para os Novos Hooks**
  - [ ] Criar arquivos de teste para os hooks customizados do React Query (ex: `useMenuItems.test.tsx`).
- [ ] **6.2: Atualizar Documentação Técnica**
  - [ ] Revisar o `DOCUMENTACAO.md` para incluir detalhes sobre o uso do React Query, Sonner e Supabase Realtime.
