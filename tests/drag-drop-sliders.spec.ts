import { expect, test } from "../fixtures/fixtures";

test("Drag the slider with default value 15 to 95", async ({ page }) => {
  await page.goto("/selenium-playground/");
  await page.getByRole("link", { name: "Drag & Drop Sliders" }).click();
  await page.waitForLoadState("networkidle");

  const slider = page.getByRole("slider").nth(2);
  await expect(slider).toHaveValue("15");

  const bounds = await slider.boundingBox();
  if (!bounds) {
    throw new Error("The slider is not visible.");
  }

  const minimum = Number(await slider.getAttribute("min") ?? 0);
  const maximum = Number(await slider.getAttribute("max") ?? 100);
  const inset = Math.min(bounds.height / 2, bounds.width / 2);
  const usableWidth = bounds.width - inset * 2;
  const centerY = bounds.y + bounds.height / 2;
  const xForValue = (value: number) =>
    bounds.x + inset + ((value - minimum) / (maximum - minimum)) * usableWidth;

  await page.mouse.move(xForValue(15), centerY);
  await page.mouse.down();
  let destinationX = xForValue(95);
  await page.mouse.move(destinationX, centerY, { steps: 12 });

  let actualValue = Number(await slider.inputValue());
  const correctionLimit = Math.ceil(usableWidth / (maximum - minimum)) + 1;
  for (let attempt = 0; actualValue !== 95 && attempt < correctionLimit; attempt += 1) {
    destinationX += actualValue > 95 ? -1 : 1;
    await page.mouse.move(destinationX, centerY);
    actualValue = Number(await slider.inputValue());
  }

  await page.mouse.up();

  await expect(slider).toHaveValue("95");
  await expect(page.getByText("95", { exact: true })).toBeVisible();
});