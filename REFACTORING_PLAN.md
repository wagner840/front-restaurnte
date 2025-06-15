# Plano de Refatoração para o Gráfico de Vendas por Categoria

## Problema

O gráfico de vendas por categoria no dashboard exibe todas as categorias, mas falha em atribuir os dados de vendas corretamente. A maioria dos valores é agrupada em "Outros", "burger" ou "chopp" porque a lógica de mapeamento entre os itens vendidos e suas categorias cadastradas é frágil e suscetível a falhas por pequenas diferenças nos nomes dos produtos.

## Plano de Ação

Para resolver o problema de forma definitiva, a função `getSalesByCategory` no arquivo `src/services/api.ts` será refatorada para garantir que os dados de vendas sejam atribuídos de forma dinâmica e precisa.

### Passos da Implementação:

1.  **Simplificar a Agregação de Dados:**

    - A função será otimizada para usar uma única estrutura de dados que acumule as vendas por categoria dinamicamente.
    - Em vez de inicializar todas as categorias com valor zero, uma categoria será adicionada ao totalizador apenas quando um item vendido correspondente for encontrado.

2.  **Melhorar o Mapeamento de Itens:**

    - Será criado um mapa de referência (`Nome do Item -> Categoria`) a partir dos `menu_items`.
    - Para cada item em um pedido, sua categoria será buscada neste mapa.
    - Se a categoria for encontrada, o valor da venda será somado ao total daquela categoria.
    - Apenas os itens que não forem encontrados no mapa terão seu valor somado a "Outros".

3.  **Remover Redundâncias:**
    - As chamadas duplicadas à base de dados para buscar os itens do cardápio serão removidas para otimizar a performance.

### Diagrama do Fluxo de Dados

```mermaid
graph TD
    subgraph "Lógica Proposta em getSalesByCategory"
        A[Iniciar] --> B{Buscar todos os pedidos concluídos};
        B --> C{Buscar todos os itens do cardápio (menu_items)};
        C --> D[Criar um mapa: 'nome normalizado do item' -> 'categoria'];
        D --> E[Inicializar um objeto vazio para os totais de vendas: `sales = {}`];
        E --> F{Iterar sobre cada pedido};
        F --> G{Iterar sobre cada item do pedido};
        G --> H{O nome do item existe no mapa?};
        H -- Sim --> I[Adicionar valor da venda à `sales[categoria_do_mapa]`];
        H -- Não --> J[Adicionar valor da venda à `sales['Outros']`];
        I --> K{Fim dos itens do pedido?};
        J --> K;
        K -- Não --> G;
        K -- Sim --> L{Fim de todos os pedidos?};
        L -- Não --> F;
        L -- Sim --> M[Formatar e retornar os dados de `sales`];
        M --> N[Fim];
    end
```
