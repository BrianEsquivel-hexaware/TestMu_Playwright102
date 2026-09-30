import dotenv from "dotenv";
import { defineConfig } from "@playwright/test";

dotenv.config();

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
    screenshot: "on",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "local" },
    { name: "win-chrome" },
    { name: "linux-firefox" },
  ],
});