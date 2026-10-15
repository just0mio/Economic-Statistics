import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
async function ready(page: Page) {
  await page.locator("main h1").waitFor();
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
}
test("L6 범위·실제 원문 연결·안전재고 계산", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#/chapters?chapter=6");
  await ready(page);
  await expect(
    page.locator(".lesson-list h3").filter({ hasText: "연속확률변수·밀도" }),
  ).toBeVisible();
  await expect(
    page.locator(".lesson-list h3").filter({ hasText: "지수분포" }),
  ).toHaveCount(0);
  await page
    .getByRole("checkbox", { name: "시험 범위 밖 보충 포함", exact: true })
    .check();
  await expect(
    page.locator(".lesson-list h3").filter({ hasText: "지수분포" }),
  ).toContainText("범위 밖 보충");
  await page.goto("/#/learn/normal-stock");
  await ready(page);
  await expect(page.getByTestId("stock-integer")).toHaveText("624");
  await expect(page.getByTestId("stock-continuous")).toHaveText("623.2249");
  await expect(page.locator(".lesson-sources")).toContainText("18쪽");
  await expect(page.locator(".original-examples a")).toHaveAttribute(
    "href",
    "./materials/L6_Continuous_Random_Variables.pdf#page=18",
  );
  await page
    .getByRole("spinbutton", { name: "허용 부족확률 (%)", exact: true })
    .fill("5");
  await expect(page.getByTestId("stock-integer")).toHaveText("599");
  await page
    .getByRole("spinbutton", { name: "허용 부족확률 (%)", exact: true })
    .fill("0");
  await expect(page.getByRole("status")).toContainText("0%와 100% 사이");
  await page
    .getByRole("spinbutton", { name: "허용 부족확률 (%)", exact: true })
    .fill("2");
  await ready(page);
  await page.screenshot({
    path: `public/artifacts/lecture6-${info.project.name}.png`,
    fullPage: true,
  });
  await page.goto("/#/sources");
  await ready(page);
  for (const file of [
    "L4_Probability.pdf",
    "L5_Discrete_Random_Variables.pdf",
    "L6_Exam_Scope_Through_Normal.pdf",
    "LESE152_Practice_Set_4.pdf",
    "LESE152_Practice_Set_5.pdf",
  ]) {
    const response = await page.request.get(`/materials/${file}`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  }
  expect(errors).toEqual([]);
});
test("원본4 범위 연습은 지수 소문항만 제외하고 조건·배점·복원을 유지", async ({
  page,
}) => {
  await page.goto("/#/practice");
  await ready(page);
  await expect(page.locator(".set-card")).toHaveCount(5);
  const card = page
    .locator(".set-card")
    .filter({
      has: page.getByRole("heading", { name: "Practice Set 4", exact: true }),
    });
  await card
    .getByRole("button", { name: "시험범위 연습", exact: true })
    .click();
  await ready(page);
  const attempt = await page.evaluate(
    () => JSON.parse(localStorage.getItem("lese152-studio-v1")!).activeAttempt,
  );
  expect(attempt.questionIds).toHaveLength(29);
  expect(attempt.questionIds).not.toContain("original-4-C3-d");
  expect(attempt.mode).toBe("practice");
  expect(attempt.deadline).toBeNull();
  await page.getByRole("button", { name: "문제 21", exact: true }).click();
  await expect(page.locator(".question-context")).toContainText(
    "12,14,15,17,19,21,23,39",
  );
  await page
    .getByRole("textbox", { name: /평균·중앙값.*풀이/ })
    .fill("평균20, 중앙값18.");
  await page.reload();
  await ready(page);
  await expect(
    page.getByRole("textbox", { name: /평균·중앙값.*풀이/ }),
  ).toHaveValue("평균20, 중앙값18.");
  await page.getByRole("button", { name: "제출하고 결과 보기" }).click();
  await page.getByRole("button", { name: "제출 확정" }).click();
  await expect(page.locator(".result-main")).toContainText("95");
});
test("원본5 오류 문항 자동채점 보류·자가평가·새로고침", async ({ page }) => {
  await page.goto("/#/practice");
  await ready(page);
  const card = page
    .locator(".set-card")
    .filter({
      has: page.getByRole("heading", { name: "Practice Set 5", exact: true }),
    });
  await expect(card).toContainText("원문 오류 보류 2문항");
  await card.getByRole("button", { name: "연습 시작", exact: true }).click();
  await page.getByRole("button", { name: "문제 4", exact: true }).click();
  await expect(page.locator(".question-panel")).toContainText(
    "자동채점을 보류",
  );
  await page.locator("input[type=radio]").nth(2).check();
  await page.getByRole("button", { name: "문제 20", exact: true }).click();
  await page.locator("input[type=radio]").first().check();
  await page.getByRole("button", { name: "제출하고 결과 보기" }).click();
  await page.getByRole("button", { name: "제출 확정" }).click();
  await expect(page.locator(".result-main")).toContainText("미채점");
  const before = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("lese152-studio-v1")!),
  );
  expect(before.weak).not.toContain("original-5-MC4");
  expect(before.weak).not.toContain("original-5-TF10");
  const self = page.getByRole("spinbutton", {
    name: "original-5-MC4 자가평가 점수",
    exact: true,
  });
  await expect(self).toBeVisible();
  await self.fill("1");
  await page.reload();
  await ready(page);
  await expect(
    page.getByRole("spinbutton", {
      name: "original-5-MC4 자가평가 점수",
      exact: true,
    }),
  ).toHaveValue("1");
  await expect(
    page.getByRole("spinbutton", {
      name: "original-5-TF10 자가평가 점수",
      exact: true,
    }),
  ).toHaveValue("");
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("lese152-studio-v1")!),
  );
  expect(stored.weak).toContain("original-5-MC4");
  expect(stored.weak).not.toContain("original-5-TF10");
});
