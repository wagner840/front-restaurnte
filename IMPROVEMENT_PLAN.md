# Plano de Melhorias Estratégicas de UX/UI e Performance

**Visão Geral:** Este plano detalha a implementação de melhorias visuais e funcionais na tela de pedidos, ao mesmo tempo que estabelece uma base sólida para a escalabilidade, manutenibilidade e robustez do sistema a longo prazo.

---

### Fase 1: Fundação Visual e Estrutural

- **Objetivo:** Criar uma base de componentes sólida, implementar o Dark Mode e refinar a UI principal.
- **Tarefas:**
  1.  **Criar Componente `BaseCard` Reutilizável:** Desenvolver um componente genérico que encapsule os novos estilos (sombras, bordas, suporte a dark mode) para garantir consistência visual em todo o sistema.
  2.  **Refatorar e Padronizar Ícones:** Padronizar os ícones de status para manter um padrão coeso.
  3.  **Centralizar Cores no Tailwind:** Mover todas as cores de UI para `tailwind.config.js`, com variáveis para os modos claro e escuro.
  4.  **Implementar Dark Mode Globalmente:** Aplicar as classes `dark:` em todos os componentes relevantes.
- **Ponto de Atenção (Consistência):** Mapear outros cards no sistema (ex: `MenuItemCard`) para serem refatorados com o `BaseCard` em uma próxima etapa.

---

### Fase 2: Fluidez, Feedback e Performance

- **Objetivo:** Melhorar a experiência de interação e garantir que a UI seja performática.
- **Tarefas:**
  1.  **Otimizar Animações e Microinterações:** Refinar as animações com `framer-motion` e adicionar feedback visual claro para ações do usuário.
  2.  **Investigar e Implementar Virtualização da Lista:** Analisar a performance com um grande volume de pedidos e, se necessário, implementar a virtualização da lista para garantir a rolagem fluida.
- **Ponto de Atenção (Débito Técnico):** Documentar a necessidade de mover a lógica de filtros para o backend no futuro, para lidar com o crescimento da base de dados.

---

### Fase 3: Qualidade, Acessibilidade e Testes

- **Objetivo:** Garantir que a aplicação seja robusta, acessível e que as mudanças sejam validadas por testes.
- **Tarefas:**
  1.  **Garantir Acessibilidade (WCAG):** Assegurar foco visível, adicionar `aria-label` e validar o contraste de cores.
  2.  **Atualizar Testes de Regressão Visual:** Criar e atualizar os testes com Playwright para capturar screenshots da tela nos modos claro e escuro, validando a nova UI e as animações.
