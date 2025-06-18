import { test, expect } from "@playwright/test";

test.describe("Captura de Tela da Página de Pedidos", () => {
  test("deve capturar a tela nos modos claro e escuro", async ({ page }) => {
    // Navegar para a aplicação
    await page.goto("http://localhost:5173");

    // Clicar no link de Pedidos na barra lateral
    await page.click('nav a[href="/orders"]');

    // Esperar a navegação ou o conteúdo da página de pedidos carregar
    await page.waitForSelector("h1:has-text('Pedidos')");

    // Esperar um pouco para as animações de entrada terminarem
    await page.waitForTimeout(1000);

    // Tirar screenshot no modo claro
    await page.screenshot({
      path: "tests/screenshots/orders-page-light.png",
      fullPage: true,
    });

    // Clicar no botão de alternância de tema
    await page.click('button[aria-label="Toggle theme"]');

    // Esperar um pouco para a transição do tema
    await page.waitForTimeout(500);

    // Tirar screenshot no modo escuro
    await page.screenshot({
      path: "tests/screenshots/orders-page-dark.png",
      fullPage: true,
    });
  });
});
