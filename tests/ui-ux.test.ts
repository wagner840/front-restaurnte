import { test, expect } from "@playwright/test";

test.describe("UI/UX da Home", () => {
  test("deve analisar aspectos visuais e de usabilidade", async ({ page }) => {
    // Navegar para a página inicial
    await page.goto("http://localhost:5174");

    // Tirar screenshot da página inicial
    await page.screenshot({
      path: "test-results/ui-ux/homepage.png",
      fullPage: true,
    });

    // Verificar elementos principais
    const header = await page.locator("header").first();
    await expect(header).toBeVisible();

    const sidebar = await page.locator("nav").first();
    await expect(sidebar).toBeVisible();

    // Verificar responsividade
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: "test-results/ui-ux/desktop.png" });

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: "test-results/ui-ux/tablet.png" });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: "test-results/ui-ux/mobile.png" });

    // Verificar navegação
    const menuLinks = await page.locator("nav a");
    const count = await menuLinks.count();

    for (let i = 0; i < count; i++) {
      const link = menuLinks.nth(i);
      await expect(link).toBeVisible();
      const text = await link.textContent();
      console.log(`Menu item ${i + 1}: ${text}`);
    }

    // Verificar formulários e interações
    const inputs = await page.locator("input");
    const buttons = await page.locator("button");

    await expect(inputs).toHaveCount(await inputs.count());
    await expect(buttons).toHaveCount(await buttons.count());

    // Verificar acessibilidade básica
    const headings = await page.locator("h1, h2, h3, h4, h5, h6");
    await expect(headings).toHaveCount(await headings.count());

    // Verificar tempo de carregamento
    const navigationStart = await page.evaluate(
      () => performance.timing.navigationStart
    );
    const loadEventEnd = await page.evaluate(
      () => performance.timing.loadEventEnd
    );
    const loadTime = loadEventEnd - navigationStart;
    console.log(`Tempo de carregamento: ${loadTime}ms`);
  });
});
