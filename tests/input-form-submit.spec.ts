import { expect, test } from "../fixtures/fixtures";

test("Input Form Submit validates required fields and submits successfully", async ({ page }) => {
  await page.goto("/selenium-playground/");
  await page.getByRole("link", { name: "Input Form Submit" }).click();
  await page.waitForLoadState("networkidle");

  const nameField = page.getByPlaceholder("Name", { exact: true });
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(nameField).toBeFocused();
  const validationMessage = await nameField.evaluate(
    (element) => (element as HTMLInputElement).validationMessage,
  );
  expect(validationMessage).toMatch(/^Please fill (?:in|out) this field\.$/i);

  await nameField.fill("Brian Esquivel");
  await page.getByPlaceholder("Email", { exact: true }).fill("brian.test@example.com");
  await page.getByPlaceholder("Password", { exact: true }).fill("Playwright102!");
  await page.getByPlaceholder("Company", { exact: true }).fill("TestMu Certification");
  await page.getByPlaceholder("Website", { exact: true }).fill("https://example.com");
  await page.getByRole("combobox").selectOption({ label: "United States" });
  await page.getByPlaceholder("City", { exact: true }).fill("Austin");
  await page.getByPlaceholder("Address 1", { exact: true }).fill("123 Test Street");
  await page.getByPlaceholder("Address 2", { exact: true }).fill("Suite 102");
  await page.getByPlaceholder("State", { exact: true }).fill("Texas");
  await page.getByPlaceholder("Zip code", { exact: true }).fill("78701");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(
    page.getByText("Thanks for contacting us, we will get back to you shortly.", { exact: true }),
  ).toBeVisible();
});