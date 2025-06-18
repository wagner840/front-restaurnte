import { test, expect } from '@playwright/test';
import { writeFileSync } from 'fs';

interface TestMetrics {
  taskName: string;
  startTime: number;
  endTime?: number;
  success: boolean;
  errors: string[];
  observations: string[];
  screenshots: string[];
}

class UXAnalyzer {
  private metrics: TestMetrics[] = [];
  private currentMetric: TestMetrics | null = null;

  startTask(taskName: string) {
    this.currentMetric = {
      taskName,
      startTime: Date.now(),
      success: false,
      errors: [],
      observations: [],
      screenshots: []
    };
  }

  endTask(success: boolean = true) {
    if (this.currentMetric) {
      this.currentMetric.endTime = Date.now();
      this.currentMetric.success = success;
      this.metrics.push(this.currentMetric);
      this.currentMetric = null;
    }
  }

  addObservation(observation: string) {
    if (this.currentMetric) {
      this.currentMetric.observations.push(observation);
    }
  }

  addError(error: string) {
    if (this.currentMetric) {
      this.currentMetric.errors.push(error);
    }
  }

  addScreenshot(screenshotPath: string) {
    if (this.currentMetric) {
      this.currentMetric.screenshots.push(screenshotPath);
    }
  }

  getReport() {
    return this.metrics;
  }

  calculateTaskTime(taskName: string): number {
    const metric = this.metrics.find(m => m.taskName === taskName);
    if (metric && metric.endTime) {
      return metric.endTime - metric.startTime;
    }
    return 0;
  }
}

let globalAnalyzer = new UXAnalyzer();

test.describe('Análise de UX - Sistema de Gestão de Restaurante', () => {
  
  test.beforeEach(async ({ page }) => {
    globalAnalyzer = new UXAnalyzer();
    
    // Configurar handlers para capturar erros JavaScript
    page.on('pageerror', (error) => {
      globalAnalyzer.addError(`Erro JavaScript: ${error.message}`);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        globalAnalyzer.addError(`Erro no console: ${msg.text()}`);
      }
    });
  });

  test('Persona 1: Novo Usuário (Atendente) - Jornada Completa', async ({ page }) => {
    // === 1. TESTE DE LOGIN ===
    globalAnalyzer.startTask('Login no Sistema');
    
    await page.goto('/');
    globalAnalyzer.addObservation('Página inicial carregada');
    
    // Aguardar a página carregar completamente
    await page.waitForLoadState('networkidle');
    
    // Verificar se existe formulário de login visível
    const loginForm = await page.locator('form').first();
    if (await loginForm.isVisible()) {
      globalAnalyzer.addObservation('Formulário de login encontrado e visível');
    } else {
      globalAnalyzer.addError('Formulário de login não encontrado ou não visível');
    }

    // Capturar screenshot da página de login
    await page.screenshot({ path: 'screenshots/01-login-form.png' });
    globalAnalyzer.addScreenshot('01-login-form.png');

    // Tentar fazer login - usando seletores mais flexíveis
    const emailInput = await page.locator('input[type="email"], input[placeholder*="email" i]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('admin@admin.com');
      globalAnalyzer.addObservation('Email preenchido no campo de login');
    } else {
      globalAnalyzer.addError('Campo de email não encontrado');
    }
    
    const passwordInput = await page.locator('input[type="password"], input[placeholder*="senha" i]').first();
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('R!2q3w4e');
      globalAnalyzer.addObservation('Senha preenchida no campo de login');
    } else {
      globalAnalyzer.addError('Campo de senha não encontrado');
    }
    
    // Procurar botão de submit
    const submitButton = await page.locator('button[type="submit"], button:has-text("Entrar"), button:has-text("Login")').first();
    if (await submitButton.isVisible()) {
      await submitButton.click();
      globalAnalyzer.addObservation('Botão de login clicado');
    } else {
      globalAnalyzer.addError('Botão de login não encontrado');
    }
    
    // Aguardar redirecionamento ou feedback
    await page.waitForTimeout(3000);
    
    // Verificar se o login foi bem-sucedido
    const currentUrl = page.url();
    const hasLoginError = await page.locator('[role="alert"], .error, .bg-red').isVisible();
    
    if (hasLoginError) {
      const errorText = await page.locator('[role="alert"], .error, .bg-red').first().textContent();
      globalAnalyzer.addError(`Erro de login: ${errorText}`);
      globalAnalyzer.endTask(false);
    } else if (currentUrl !== 'http://localhost:5173/' || await page.locator('button:has-text("Entrar")').count() === 0) {
      globalAnalyzer.addObservation('Login realizado com sucesso - página alterada');
      globalAnalyzer.endTask(true);
    } else {
      globalAnalyzer.addError('Login falhou - ainda na página de login');
      globalAnalyzer.endTask(false);
    }

    await page.screenshot({ path: 'screenshots/02-post-login.png' });
    globalAnalyzer.addScreenshot('02-post-login.png');

    // === 2. ANÁLISE DO DASHBOARD ===
    globalAnalyzer.startTask('Exploração do Dashboard');
    
    globalAnalyzer.addObservation('Analisando a interface do dashboard...');
    
    // Aguardar carregamento completo
    await page.waitForLoadState('networkidle');
    
    // Verificar elementos principais do dashboard
    const sidebar = await page.locator('nav, aside, [role="navigation"], .sidebar').first();
    if (await sidebar.isVisible()) {
      globalAnalyzer.addObservation('Menu lateral encontrado e visível');
    } else {
      globalAnalyzer.addError('Menu lateral não encontrado');
    }

    // Verificar cabeçalho
    const header = await page.locator('header, [role="banner"], .header').first();
    if (await header.isVisible()) {
      globalAnalyzer.addObservation('Cabeçalho encontrado e visível');
    } else {
      globalAnalyzer.addError('Cabeçalho não encontrado');
    }

    // Verificar cards de estatísticas
    const statsCards = await page.locator('[data-testid*="stat"], .stat, .card, [class*="card"]').count();
    globalAnalyzer.addObservation(`Encontrados ${statsCards} cards/estatísticas no dashboard`);

    // Verificar presença de dados/conteúdo
    const hasContent = await page.locator('h1, h2, h3').count() > 0;
    if (hasContent) {
      globalAnalyzer.addObservation('Conteúdo principal encontrado no dashboard');
    }

    await page.screenshot({ path: 'screenshots/03-dashboard-overview.png' });
    globalAnalyzer.addScreenshot('03-dashboard-overview.png');
    
    globalAnalyzer.endTask(true);

    // === 3. NAVEGAÇÃO PARA CLIENTES ===
    globalAnalyzer.startTask('Navegação para Gestão de Clientes');
    
    // Procurar link/botão para Clientes com seletores mais amplos
    const clientsLink = await page.locator(`
      a:has-text("Cliente"), 
      button:has-text("Cliente"), 
      [href*="client"], 
      [href*="customer"],
      a:has-text("Clientes"),
      button:has-text("Clientes")
    `).first();
    
    if (await clientsLink.isVisible()) {
      globalAnalyzer.addObservation('Link para Clientes encontrado');
      await clientsLink.click();
      globalAnalyzer.addObservation('Clicou no link para Clientes');
      
      await page.waitForTimeout(2000);
      await page.waitForLoadState('networkidle');
      
      // Verificar se a navegação foi bem-sucedida
      const currentUrl = page.url();
      const pageTitle = await page.locator('h1, h2, title').first().textContent();
      
      if (currentUrl.includes('client') || currentUrl.includes('customer') || 
          pageTitle?.toLowerCase().includes('client')) {
        globalAnalyzer.addObservation('Navegação para Clientes bem-sucedida');
        globalAnalyzer.endTask(true);
      } else {
        globalAnalyzer.addObservation(`URL atual: ${currentUrl}, Título: ${pageTitle}`);
        globalAnalyzer.addError('Navegação para Clientes falhou');
        globalAnalyzer.endTask(false);
      }
    } else {
      // Tentar encontrar na navegação lateral
      const navLinks = await page.locator('nav a, aside a, .sidebar a').allTextContents();
      globalAnalyzer.addObservation(`Links de navegação encontrados: ${navLinks.join(', ')}`);
      globalAnalyzer.addError('Link para Clientes não encontrado');
      globalAnalyzer.endTask(false);
    }

    await page.screenshot({ path: 'screenshots/04-clients-page.png' });
    globalAnalyzer.addScreenshot('04-clients-page.png');

    // Continuar com os outros testes mesmo se alguns falharem
    globalAnalyzer.startTask('Análise Geral da Interface');
    
    // Verificar elementos comuns de UI
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();
    const inputs = await page.locator('input').count();
    
    globalAnalyzer.addObservation(`Interface possui: ${buttons} botões, ${links} links, ${inputs} campos de entrada`);
    
    // Verificar responsividade básica
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await page.screenshot({ path: 'screenshots/05-mobile-view.png' });
    globalAnalyzer.addScreenshot('05-mobile-view.png');
    
    await page.setViewportSize({ width: 1280, height: 720 }); // Desktop
    globalAnalyzer.addObservation('Teste de responsividade realizado');
    
    globalAnalyzer.endTask(true);
  });

  test('Persona 2: Usuário Recorrente (Gerente) - Análise de Relatórios', async ({ page }) => {
    // Login rápido
    globalAnalyzer.startTask('Login do Gerente');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Login simplificado
    try {
      await page.fill('input[type="email"]', 'admin@admin.com');
      await page.fill('input[type="password"]', 'R!2q3w4e');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
      globalAnalyzer.endTask(true);
    } catch (error) {
      globalAnalyzer.addError(`Erro no login: ${error}`);
      globalAnalyzer.endTask(false);
    }

    // === ANÁLISE DE RELATÓRIOS ===
    globalAnalyzer.startTask('Busca por Funcionalidade de Relatórios');
    
    await page.waitForLoadState('networkidle');
    
    // Procurar por relatórios de forma mais ampla
    const reportsLink = await page.locator(`
      a:has-text("Relatório"), 
      button:has-text("Relatório"), 
      [href*="report"], 
      [href*="relatorio"],
      a:has-text("Relatórios"),
      button:has-text("Relatórios"),
      a:has-text("Reports"),
      button:has-text("Reports")
    `).first();
    
    if (await reportsLink.isVisible()) {
      globalAnalyzer.addObservation('Link para Relatórios encontrado');
      await reportsLink.click();
      await page.waitForTimeout(2000);
      globalAnalyzer.endTask(true);
    } else {
      // Procurar em toda a página
      const allLinks = await page.locator('a, button').allTextContents();
      globalAnalyzer.addObservation(`Todos os links encontrados: ${allLinks.slice(0, 10).join(', ')}...`);
      globalAnalyzer.addError('Link para Relatórios não encontrado diretamente');
      globalAnalyzer.endTask(false);
    }

    await page.screenshot({ path: 'screenshots/06-reports-search.png' });
    globalAnalyzer.addScreenshot('06-reports-search.png');

    // === ANÁLISE DE GRÁFICOS ===
    globalAnalyzer.startTask('Busca por Gráficos e Visualizações');
    
    // Verificar presença de gráficos em qualquer lugar da aplicação
    const charts = await page.locator('canvas, svg, .chart, [data-testid*="chart"], [class*="chart"]').count();
    globalAnalyzer.addObservation(`Encontrados ${charts} elementos gráficos na aplicação`);
    
    if (charts > 0) {
      globalAnalyzer.addObservation('Elementos gráficos encontrados');
      globalAnalyzer.endTask(true);
    } else {
      globalAnalyzer.addObservation('Nenhum gráfico encontrado - isso pode indicar carregamento dinâmico ou falta da funcionalidade');
      globalAnalyzer.endTask(false);
    }

    await page.screenshot({ path: 'screenshots/07-charts-analysis.png' });
    globalAnalyzer.addScreenshot('07-charts-analysis.png');
  });

  test('Análise de Acessibilidade e Heurísticas de Nielsen', async ({ page }) => {
    // Login básico
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    globalAnalyzer.startTask('Análise de Acessibilidade e Usabilidade');

    // === HEURÍSTICA 1: VISIBILIDADE DO STATUS DO SISTEMA ===
    globalAnalyzer.addObservation('=== HEURÍSTICA 1: VISIBILIDADE DO STATUS DO SISTEMA ===');
    
    // Verificar indicadores de carregamento
    const loadingIndicators = await page.locator('.loading, .spinner, .skeleton, [data-testid*="loading"], [class*="loading"]').count();
    globalAnalyzer.addObservation(`Encontrados ${loadingIndicators} indicadores de carregamento`);

    // === HEURÍSTICA 2: CORRESPONDÊNCIA SISTEMA-MUNDO REAL ===
    globalAnalyzer.addObservation('=== HEURÍSTICA 2: CORRESPONDÊNCIA SISTEMA-MUNDO REAL ===');
    
    // Verificar ícones e labels intuitivos
    const buttons = await page.locator('button').allTextContents();
    const visibleButtons = buttons.filter(text => text.trim().length > 0);
    globalAnalyzer.addObservation(`Textos dos botões encontrados: ${visibleButtons.slice(0, 5).join(', ')}`);

    // === HEURÍSTICA 4: CONSISTÊNCIA E PADRÕES ===
    globalAnalyzer.addObservation('=== HEURÍSTICA 4: CONSISTÊNCIA E PADRÕES ===');
    
    // Verificar consistência de cores em botões
    const allButtons = await page.locator('button').count();
    globalAnalyzer.addObservation(`Total de botões encontrados: ${allButtons}`);

    // === HEURÍSTICA 5: PREVENÇÃO DE ERROS ===
    globalAnalyzer.addObservation('=== HEURÍSTICA 5: PREVENÇÃO DE ERROS ===');
    
    // Verificar campos obrigatórios
    const requiredFields = await page.locator('input[required], input[aria-required="true"]').count();
    const fieldsWithAsterisk = await page.locator('label:has-text("*")').count();
    globalAnalyzer.addObservation(`Campos obrigatórios: ${requiredFields}, Labels com asterisco: ${fieldsWithAsterisk}`);

    // === ANÁLISE DE CONTRASTE ===
    globalAnalyzer.addObservation('=== ANÁLISE DE CONTRASTE ===');
    
    // Verificar elementos de texto
    const textElements = await page.locator('p, span, div, h1, h2, h3, h4, h5, h6').first();
    if (await textElements.isVisible()) {
      try {
        const textColor = await textElements.evaluate(el => getComputedStyle(el).color);
        const bgColor = await textElements.evaluate(el => getComputedStyle(el).backgroundColor);
        globalAnalyzer.addObservation(`Cores detectadas - Texto: ${textColor}, Fundo: ${bgColor}`);
      } catch (error) {
        globalAnalyzer.addObservation('Erro ao detectar cores dos elementos');
      }
    }

    // Verificar navegação por teclado
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    globalAnalyzer.addObservation(`Navegação por teclado - Primeiro elemento focado: ${focusedElement}`);

    await page.screenshot({ path: 'screenshots/08-accessibility-analysis.png' });
    globalAnalyzer.addScreenshot('08-accessibility-analysis.png');

    globalAnalyzer.endTask(true);
  });

  test.afterAll(async () => {
    // Gerar relatório final
    const report = globalAnalyzer.getReport();
    const reportContent = generateUXReport(report, globalAnalyzer);
    
    // Salvar relatório usando import ES6
    try {
      writeFileSync('ux-analysis-report.md', reportContent);
      console.log('=== RELATÓRIO DE ANÁLISE DE UX GERADO ===');
      console.log('Arquivo: ux-analysis-report.md');
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
    }
  });
});

function generateUXReport(metrics: TestMetrics[], analyzer: UXAnalyzer): string {
  const successfulTasks = metrics.filter(m => m.success).length;
  const totalTasks = metrics.length;
  const successRate = totalTasks > 0 ? (successfulTasks / totalTasks * 100).toFixed(1) : '0';
  
  const totalErrors = metrics.reduce((acc, m) => acc + m.errors.length, 0);
  
  let report = `# Relatório de Análise de UX - Sistema de Gestão de Restaurante

## Sumário Executivo

### Métricas Gerais
- **Taxa de Sucesso das Tarefas**: ${successRate}% (${successfulTasks}/${totalTasks})
- **Total de Erros Encontrados**: ${totalErrors}
- **Data da Análise**: ${new Date().toLocaleDateString('pt-BR')}

### Principais Achados

#### ✅ Pontos Positivos
`;

  metrics.forEach(metric => {
    if (metric.success && metric.observations.length > 0) {
      const mainObservation = metric.observations.find(obs => !obs.includes('===')) || metric.observations[0];
      report += `- **${metric.taskName}**: ${mainObservation}\n`;
    }
  });

  report += `\n#### ❌ Problemas Críticos\n`;

  metrics.forEach(metric => {
    if (metric.errors.length > 0) {
      report += `- **${metric.taskName}**: ${metric.errors.join(', ')}\n`;
    }
  });

  report += `\n## Análise Detalhada por Tarefa\n\n`;

  metrics.forEach(metric => {
    const duration = metric.endTime ? metric.endTime - metric.startTime : 0;
    
    report += `### ${metric.taskName}\n`;
    report += `- **Status**: ${metric.success ? '✅ Sucesso' : '❌ Falha'}\n`;
    report += `- **Tempo**: ${duration}ms\n`;
    report += `- **Erros**: ${metric.errors.length}\n`;
    report += `- **Observações**: ${metric.observations.length}\n\n`;
    
    if (metric.observations.length > 0) {
      report += `**Observações:**\n`;
      metric.observations.forEach(obs => {
        report += `- ${obs}\n`;
      });
    }
    
    if (metric.errors.length > 0) {
      report += `**Erros:**\n`;
      metric.errors.forEach(error => {
        report += `- ${error}\n`;
      });
    }
    
    if (metric.screenshots.length > 0) {
      report += `**Screenshots:**\n`;
      metric.screenshots.forEach(screenshot => {
        report += `- ${screenshot}\n`;
      });
    }
    
    report += `\n---\n\n`;
  });

  report += `## Recomendações e Próximos Passos

### Prioridade Alta
1. **Verificação de Autenticação**: Confirmar se o sistema de login está funcionando corretamente
2. **Melhoria de Navegação**: Garantir que todas as seções principais sejam facilmente acessíveis
3. **Feedback Visual**: Implementar indicadores claros para ações do usuário

### Prioridade Média
1. **Acessibilidade**: Melhorar marcação de campos obrigatórios e navegação por teclado
2. **Consistência**: Padronizar elementos de interface em todas as telas
3. **Performance**: Otimizar tempos de carregamento

### Prioridade Baixa
1. **Refinamentos Visuais**: Melhorar espaçamento e hierarquia tipográfica
2. **Recursos Avançados**: Implementar funcionalidades de relatórios se ainda não existirem
3. **Testes Automatizados**: Expandir cobertura de testes de UX

## Conclusão

A análise automatizada revelou aspectos importantes sobre a usabilidade do sistema. 
Com uma taxa de sucesso de ${successRate}%, há oportunidades claras de melhoria na experiência do usuário.

**Metodologia**: Análise heurística automatizada com Playwright
**Personas Testadas**: Novo Usuário (Atendente) e Usuário Recorrente (Gerente)
**Heurísticas Aplicadas**: Princípios de Nielsen para avaliação de usabilidade

---

*Relatório gerado automaticamente em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}*
`;

  return report;
}