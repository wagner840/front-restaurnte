import { test, expect } from "@playwright/test";

test.describe("Console error check", () => {
  test("should not have any console errors on the page", async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("http://localhost:5173/");

    // Adiciona uma pequena espera para garantir que a página e os scripts sejam totalmente carregados.
    await page.waitForLoadState("networkidle");

    expect(
      consoleErrors,
      `Found console errors: ${consoleErrors.join("\\n")}`
    ).toEqual([]);
  });
});
