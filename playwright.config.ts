import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: {
    timeout: 8_000,
  },
  fullyParallel: true,
  workers: 3,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL: process.env.PLAYGROUND_BASE_URL ?? "https://www.testmuai.com/selenium-playground/",
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "local" },
    { name: "win-chrome" },
    { name: "linux-firefox" },
  ],
});