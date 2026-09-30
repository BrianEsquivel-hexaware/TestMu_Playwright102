import { expect, test as base, type Page } from "@playwright/test";
import { chromium } from "playwright";

const targets = {
  "win-chrome": { browserName: "Chrome", platform: "Windows 10" },
  "linux-firefox": { browserName: "pw-firefox", platform: "Linux" },
} as const;

type CloudTarget = keyof typeof targets;

function isCloudTarget(name: string): name is CloudTarget {
  return Object.hasOwn(targets, name);
}

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const targetName = testInfo.project.name;

    if (!isCloudTarget(targetName)) {
      await use(page);
      return;
    }

    const username = process.env.LT_USERNAME;
    const accessKey = process.env.LT_ACCESS_KEY;
    if (!username || !accessKey) {
      throw new Error("Set LT_USERNAME and LT_ACCESS_KEY to run a TestMu AI cloud project.");
    }

    const target = targets[targetName];
    const capabilities = {
      browserName: target.browserName,
      browserVersion: "latest",
      "LT:Options": {
        platform: target.platform,
        build: "Playwright 102 Certification",
        name: `${testInfo.project.name} - ${testInfo.title}`,
        user: username,
        accessKey,
        network: true,
        video: true,
        console: true,
      },
    };

    const browser = await chromium.connect({
      wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`,
    });
    let cloudPage: Page | undefined;

    try {
      cloudPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await use(cloudPage);

      if (testInfo.status !== "passed") {
        await testInfo.attach("failure-screenshot", {
          body: await cloudPage.screenshot(),
          contentType: "image/png",
        });
      }
    } finally {
      if (cloudPage) {
        const status = testInfo.status === "passed" ? "passed" : "failed";
        const command = `lambdatest_action: ${JSON.stringify({ action: "setTestStatus", arguments: { status } })}`;
        await cloudPage.evaluate((_value: string) => {}, command).catch(() => undefined);
        await cloudPage.close().catch(() => undefined);
      }
      await browser.close().catch(() => undefined);
    }
  },
});

export { expect };