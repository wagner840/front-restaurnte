import { test, expect } from '@playwright/test';

test.describe('Verificação de Notificação por Som', () => {
  test('deve verificar se o som está funcionando', async ({ page }) => {
    // Permitir áudio no navegador
    await page.context().grantPermissions(['audio']);
    
    // Configurar um listener para erros de console
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(`CONSOLE ERROR: ${msg.text()}`);
      }
    });

    // Configurar um listener para erros de página
    const pageErrors: string[] = [];
    page.on('pageerror', error => {
      pageErrors.push(`PAGE ERROR: ${error.message}`);
    });

    // Navegar para a aplicação
    await page.goto('http://localhost:5173');

    // Aguardar a página carregar
    await page.waitForLoadState('networkidle');

    // Verificar se há elementos de áudio na página
    const audioElements = await page.locator('audio').count();
    console.log(`Elementos de áudio encontrados: ${audioElements}`);

    // Verificar se o arquivo de som existe (tentar carregar)
    const soundResponse = await page.request.get('http://localhost:5173/sounds/notification.mp3');
    console.log(`Status do arquivo de som: ${soundResponse.status()}`);
    
    if (soundResponse.status() !== 200) {
      console.log('PROBLEMA: Arquivo de som não encontrado ou não acessível');
    }

    // Tentar executar código JavaScript para testar o som
    const soundTestResult = await page.evaluate(async () => {
      try {
        // Importar e testar a função de som
        const audio = new Audio('/sounds/notification.mp3');
        
        // Verificar se o áudio pode ser carregado
        return new Promise((resolve) => {
          audio.addEventListener('canplaythrough', () => {
            resolve({ success: true, message: 'Áudio carregado com sucesso' });
          });
          
          audio.addEventListener('error', (e) => {
            resolve({ 
              success: false, 
              message: `Erro ao carregar áudio: ${(e.target as HTMLAudioElement)?.error?.message || 'Erro desconhecido'}` 
            });
          });
          
          // Timeout após 5 segundos
          setTimeout(() => {
            resolve({ success: false, message: 'Timeout ao carregar áudio' });
          }, 5000);
          
          audio.load();
        });
      } catch (error) {
        return { success: false, message: `Exceção: ${error}` };
      }
    });

    console.log('Resultado do teste de som:', soundTestResult);

    // Verificar se há configurações de som na aplicação
    const soundSettingsResult = await page.evaluate(() => {
      const soundEnabled = localStorage.getItem('soundEnabled');
      return {
        soundEnabled: soundEnabled,
        localStorage: Object.keys(localStorage).map(key => `${key}: ${localStorage.getItem(key)}`)
      };
    });

    console.log('Configurações de som:', soundSettingsResult);

    // Reportar erros encontrados
    if (consoleMessages.length > 0) {
      console.log('Erros de console encontrados:');
      consoleMessages.forEach(msg => console.log(msg));
    }

    if (pageErrors.length > 0) {
      console.log('Erros de página encontrados:');
      pageErrors.forEach(msg => console.log(msg));
    }

    // Fazer captura de tela para análise
    await page.screenshot({ path: 'sound-test-screenshot.png', fullPage: true });
  });
});