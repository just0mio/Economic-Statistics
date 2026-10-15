import { chromium } from "@playwright/test";
import { existsSync } from "node:fs";
import assert from "node:assert/strict";

const address = process.argv[2] ?? "http://127.0.0.1:5173";
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ??
    (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(address);
  await page
    .getByRole("heading", { name: /오늘도, 이해가 쌓이는 시간/ })
    .waitFor();
  await page.getByRole("textbox", { name: "개념 검색" }).fill("Poisson");
  await page.locator(".search-results a").first().click();
  await page
    .getByRole("heading", { name: "포아송 분포", exact: true })
    .waitFor();
  await page.getByTestId("lab-mean").waitFor();
  assert.equal(await page.getByTestId("lab-mean").textContent(), "3");
  assert.equal(await page.getByTestId("lab-variance").textContent(), "3");
  assert.equal(
    await page
      .locator(".lesson-sources")
      .innerText()
      .then((t) => t.includes("259쪽")),
    true,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: running dashboard, concept routing, source page, Poisson mean and variance.",
  );
} finally {
  await browser.close();
}
