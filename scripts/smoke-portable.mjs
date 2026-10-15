import { chromium, expect } from "@playwright/test";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const file = resolve(process.argv.slice(2).find((arg) => arg !== "--file") ?? "portable/index.html");
assert.ok(existsSync(file), "Run npm run build:portable first.");
const fileAddress = pathToFileURL(file).href;
const useFile = process.argv.includes("--file");
// The managed cloud Chromium blocks file:// navigation by administrator policy.
// Default validation serves just this one artifact from memory, with networking
// offline. --file additionally verifies direct opening on unrestricted browsers.
const address = useFile ? fileAddress : "http://127.0.0.1:9999/index.html";
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ??
    (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
  args: ["--no-sandbox"],
});

try {
  for (const [name, viewport] of [
    ["desktop", { width: 1440, height: 1000 }],
    ["tablet", { width: 768, height: 1024 }],
    ["mobile", { width: 390, height: 844 }],
  ]) {
    const context = await browser.newContext({ viewport, offline: true });
    if (!useFile) {
      await context.route("**/*", (route) => {
        if (route.request().url() === address) {
          return route.fulfill({ contentType: "text/html; charset=utf-8", body: readFileSync(file) });
        }
        return route.abort();
      });
    }
    const page = await context.newPage();
    const errors = [], network = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (/^https?:/.test(request.url()) && request.url() !== address) network.push(request.url());
    });
    const ready = async () => {
      await page.locator("main h1").waitFor();
      await page.evaluate(() => document.fonts.ready);
      assert.ok(await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ), `${name}: horizontal overflow`);
    };

    await page.goto(address);
    await ready();
    await expect(page.locator("main h1")).toContainText("오늘도, 이해가 쌓이는 시간");
    if (name === "desktop") {
      mkdirSync("public/artifacts", { recursive: true });
      await page.screenshot({ path: "public/artifacts/portable-desktop.png", fullPage: true });
    }
    await page.goto(`${address}#/lab`);
    await ready();
    await page.getByLabel("분포 선택", { exact: true }).selectOption("poisson");
    await expect(page.getByTestId("lab-mean")).toHaveText("3");
    await expect(page.getByTestId("lab-variance")).toHaveText("3");
    await page.getByLabel("분포 선택", { exact: true }).selectOption("normal");
    await expect(page.locator(".quantile-calculator")).toContainText("1.64485");

    await page.goto(`${address}#/learn/bernoulli`);
    await ready();
    await expect(page.locator(".katex").first()).toBeVisible();
    const pdf = page.locator('.lesson-sources a[href*="#page=254"]').first();
    assert.ok(existsSync(fileURLToPath(new URL(await pdf.getAttribute("href"), fileAddress))));
    await page.getByRole("button", { name: "학습 완료로 표시" }).click();
    await page.locator(".concept-quiz input[type=radio]").first().check();
    await page.getByRole("button", { name: "정답 확인", exact: true }).click();
    await page.reload();
    await ready();
    await expect(page.getByRole("button", { name: "학습 완료됨", exact: true })).toBeVisible();
    assert.ok(await page.evaluate(() =>
      JSON.parse(localStorage.getItem("lese152-studio-v1")).weak.includes("concept-bernoulli"),
    ));

    await page.goto(`${address}#/practice?mode=exam`);
    await ready();
    await page.getByRole("button", { name: "모의시험 시작", exact: true }).first().click();
    await page.locator("input[type=radio]").nth(1).check();
    const deadline = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("lese152-studio-v1")).activeAttempt.deadline,
    );
    await page.getByRole("button", { name: "문제 21", exact: true }).click();
    await page.locator(".subquestions textarea").first().fill("평균 19, 중앙값 17.");
    await page.reload();
    await ready();
    await expect(page.locator(".subquestions textarea").first()).toHaveValue("평균 19, 중앙값 17.");
    assert.equal(await page.evaluate(() =>
      JSON.parse(localStorage.getItem("lese152-studio-v1")).activeAttempt.deadline,
    ), deadline);
    await page.getByRole("button", { name: "제출하고 결과 보기" }).click();
    await page.getByRole("button", { name: "제출 확정" }).click();
    await expect(page.locator(".result-main")).toContainText("미채점");
    assert.deepEqual(errors, []);
    assert.deepEqual(network, [], "Offline app must not attempt external resource requests.");
    console.log(`PASS ${name}: ${useFile ? "file://" : "single HTML served from memory"}, offline dashboard, math, distributions, PDF paths, progress and exam restore, grading, no external requests.`);
    await context.close();
  }
} finally {
  await browser.close();
}
