import { test, expect } from "@playwright/test";

test("should logout successfully", async ({ page }) => {
  // Navigate to the application
  await page.goto("http://localhost:5173");

  // Click the "Sair do Sistema" button
  // Assuming the button has the text "Sair do Sistema"
  // If this locator fails, it might need adjustment based on the actual DOM structure.
  await page.getByRole("button", { name: "Sair do Sistema" }).click();

  // Wait for navigation to complete and check if it redirects to the login page.
  // The exact URL pattern for the login page might need to be adjusted if it's different.
  await page.waitForURL("**/login");

  // Verify that the user is on the login page
  expect(page.url()).toContain("/login");
});
