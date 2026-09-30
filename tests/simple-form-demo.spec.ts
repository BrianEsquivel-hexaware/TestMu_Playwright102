import { expect, test } from "../fixtures/fixtures";

test("Simple Form Demo echoes the entered message", async ({ page }) => {
  const message = "Welcome to TestMu AI";

  await page.goto("/selenium-playground/");
  await page.getByRole("link", { name: "Simple Form Demo" }).click();
  await expect(page).toHaveURL(/simple-form-demo/);
  await page.waitForLoadState("networkidle");

  await page.getByRole("textbox", { name: "Please enter your Message" }).fill(message);
  await page.getByRole("button", { name: "Get Checked Value" }).click();
  await expect(page.locator("#message")).toHaveText(message);
});