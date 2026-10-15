import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
const screenshots = "public/artifacts";
async function ready(page: Page) {
  await page.locator("main h1").waitFor();
  await page.evaluate(() => document.fonts.ready);
}
async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);
}
test("대시보드·메뉴·검색·자료 출처", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await ready(page);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.locator("main").blur();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(
    page.getByRole("heading", { name: /오늘도, 이해가 쌓이는 시간/ }),
  ).toBeVisible();
  await noOverflow(page);
  mkdirSync(screenshots, { recursive: true });
  await page.screenshot({
    path: `${screenshots}/dashboard-${info.project.name}.png`,
    fullPage: true,
  });
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "메뉴 열기" }).click();
    await expect(page.locator(".sidebar")).toBeVisible();
    await page.getByRole("link", { name: "개념 학습 6", exact: true }).click();
    await expect(page.locator("main h1")).toHaveText("개념 학습");
  }
  await page.getByRole("textbox", { name: "개념 검색" }).fill("Bernoulli");
  await page.locator(".search-results a").first().click();
  await expect(page.locator("main h1")).toHaveText("베르누이 분포");
  await expect(page.locator(".lesson-sources")).toContainText("254쪽");
  const source = page.locator('.lesson-sources a[href*="#page=254"]');
  const response = await page.request.get(
    (await source.getAttribute("href"))!.split("#")[0],
  );
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  await page.goto("/#/sources");
  await ready(page);
  await expect(
    page
      .getByText("Practice Set 5", { exact: false })
      .or(page.getByText("LESE152_Practice_Set_5.pdf", { exact: true }))
      .first(),
  ).toBeVisible();
  await expect(page.locator(".missing-tag")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Lecture 6 · 시험범위본", exact: true }),
  ).toBeVisible();
  await noOverflow(page);
  expect(errors).toEqual([]);
});
test("개념 학습 완료·오답·마지막 위치를 새로고침 후 복원", async ({ page }) => {
  await page.goto("/#/learn/bernoulli");
  await ready(page);
  await page.getByRole("button", { name: "학습 완료로 표시" }).click();
  await page.locator(".concept-quiz input[type=radio]").nth(0).check();
  await page.getByRole("button", { name: "정답 확인", exact: true }).click();
  await expect(page.getByText("한 번 더 살펴볼까요?")).toBeVisible();
  await page.reload();
  await ready(page);
  await expect(page.getByRole("button", { name: "학습 완료됨" })).toBeVisible();
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("lese152-studio-v1")!),
  );
  expect(stored.completed).toContain("bernoulli");
  expect(stored.weak).toContain("concept-bernoulli");
  expect(stored.lastLesson).toBe("bernoulli");
  await page.goto("/#/practice?mode=weak");
  await ready(page);
  await expect(page.getByText(/1개 대상 중 1문제/)).toBeVisible();
  await page.getByRole("button", { name: "연습 시작", exact: true }).click();
  await expect(page.locator(".question-panel h2")).toContainText("분산");
  await noOverflow(page);
});
test("분포 모수·확률 계산·확대 그래프", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#/lab");
  await ready(page);
  const slider = page.getByRole("slider", { name: /성공확률 p/ });
  await slider.focus();
  await slider.press("Home");
  for (let i = 0; i < 20; i++) await slider.press("ArrowRight");
  await expect(page.getByTestId("lab-mean")).toHaveText("2");
  await expect(page.getByTestId("lab-variance")).toHaveText("1.6");
  await expect(page.locator(".probability-results")).toContainText("0.201327");
  await page.getByLabel("분포 선택", { exact: true }).selectOption("bernoulli");
  await expect(page.getByTestId("lab-mean")).toHaveText("0.2");
  await expect(page.getByTestId("lab-variance")).toHaveText("0.16");
  await page.getByLabel("분포 선택", { exact: true }).selectOption("poisson");
  await expect(page.getByTestId("lab-mean")).toHaveText("3");
  await expect(page.getByTestId("lab-variance")).toHaveText("3");
  await noOverflow(page);
  await page.screenshot({
    path: `${screenshots}/distribution-${info.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "그래프 확대" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByLabel("분포 선택", { exact: true }).selectOption("normal");
  await expect(page.locator(".quantile-calculator")).toContainText("1.64485");
  await page
    .getByRole("checkbox", { name: "범위 밖 지수분포 포함", exact: true })
    .check();
  for (const distribution of ["uniform", "exponential"]) {
    await page
      .getByLabel("분포 선택", { exact: true })
      .selectOption(distribution);
    await noOverflow(page);
  }
  expect(errors).toEqual([]);
});
test("원본 시험: 키보드 답안·서술형·위치·마감시간 복원, 시간 종료 제출", async ({
  page,
}, info) => {
  await page.clock.install();
  await page.goto("/#/practice?mode=exam");
  await ready(page);
  await page
    .getByRole("button", { name: "모의시험 시작", exact: true })
    .first()
    .click();
  await expect(page.locator(".question-panel h2")).toContainText("서열형");
  await page.locator(".question-panel h2").click();
  await page.keyboard.press("2");
  await expect(page.locator("input[type=radio]").nth(1)).toBeChecked();
  await page.getByRole("button", { name: "나중에 복습", exact: true }).click();
  const deadline = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("lese152-studio-v1")!).activeAttempt
        .deadline,
  );
  await page.getByRole("button", { name: "문제 21", exact: true }).click();
  await page
    .locator(".subquestions textarea")
    .first()
    .fill("평균 19, 중앙값 17. 큰 값 40이 평균을 높인다.");
  await noOverflow(page);
  await page.screenshot({
    path: `${screenshots}/exam-${info.project.name}.png`,
    fullPage: true,
  });
  await page.reload();
  await ready(page);
  await expect(page.locator(".question-panel h2")).toContainText(
    "농산물 시장 방문객",
  );
  await expect(page.locator(".subquestions textarea").first()).toHaveValue(
    "평균 19, 중앙값 17. 큰 값 40이 평균을 높인다.",
  );
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("lese152-studio-v1")!).activeAttempt
          .deadline,
    ),
  ).toBe(deadline);
  await page.clock.fastForward(90 * 60000 + 1000);
  await expect(page.locator("main h1")).toContainText("한 번의 풀이");
  await expect(page.locator(".result-main")).toContainText(
    "30점은 아직 미채점",
  );
  await expect(page.locator(".result-main>strong")).toContainText("2");
  await expect(page.locator(".result-main>strong")).toContainText("70");
  const self = page.getByRole("spinbutton", {
    name: "original-1-C1-a 자가평가 점수",
    exact: true,
  });
  await self.fill("4");
  await page.reload();
  await ready(page);
  await expect(
    page.getByRole("spinbutton", {
      name: "original-1-C1-a 자가평가 점수",
      exact: true,
    }),
  ).toHaveValue("4");
  await expect(page.locator(".result-main")).toContainText(
    "25점은 아직 미채점",
  );
  await noOverflow(page);
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("lese152-studio-v1")!),
  );
  expect(stored.activeAttempt).toBeNull();
  expect(stored.attempts).toHaveLength(1);
  expect(stored.bookmarks).toContain("original-1-MC1");
  expect(stored.weak).toContain("original-1-MC2");
});
test("참거짓 설명 저장·제출·모범해설 비교", async ({ page }) => {
  await page.goto("/#/practice");
  await ready(page);
  await page
    .getByRole("button", { name: "연습 시작", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "문제 11", exact: true }).click();
  await page.getByRole("radio").nth(1).check();
  await page
    .getByRole("textbox", { name: "참거짓 판단 근거" })
    .fill("우편번호는 지역의 명목형 식별자로 평균이 의미 없다.");
  await page.reload();
  await ready(page);
  await expect(
    page.getByRole("textbox", { name: "참거짓 판단 근거" }),
  ).toHaveValue("우편번호는 지역의 명목형 식별자로 평균이 의미 없다.");
  await page.getByRole("button", { name: "제출하고 결과 보기" }).click();
  await page.getByRole("button", { name: "제출 확정" }).click();
  await expect(page.locator("main h1")).toContainText("한 번의 풀이");
  const tf = page
    .locator(".result-question")
    .filter({ hasText: "우편번호는 수량적 측정값" });
  await tf.locator("summary").click();
  await expect(tf).toContainText("우편번호는 지역의 명목형 식별자");
  await expect(tf).toContainText("학습용");
});
test("백업·초기화·복원과 다크 모드", async ({ page }) => {
  await page.goto("/#/learn/binomial");
  await ready(page);
  await page.getByRole("button", { name: "학습 완료로 표시" }).click();
  await page.goto("/#/settings");
  await ready(page);
  await page.getByRole("button", { name: "다크", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "JSON 백업 다운로드" }).click(),
  ]);
  expect(download.suggestedFilename()).toContain("lese152-backup");
  const data = await page.evaluate(() =>
    localStorage.getItem("lese152-studio-v1")!,
  );
  await page
    .getByRole("button", { name: "데이터 초기화", exact: true })
    .click();
  await page.getByRole("button", { name: "모든 기록 삭제" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByLabel("백업 JSON 선택").setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":1}'),
  });
  await expect(page.getByRole("status")).toContainText("올바른 LESE152");
  await page.getByLabel("백업 JSON 선택").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(data),
  });
  await page.getByRole("button", { name: "기록 복원", exact: true }).click();
  await page.reload();
  await ready(page);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("lese152-studio-v1")!).completed,
    ),
  ).toContain("binomial");
  await page.goto("/#/learn/binomial");
  await ready(page);
  await expect(page.getByRole("button", { name: "학습 완료됨" })).toBeVisible();
  await noOverflow(page);
});
test("분포 선택·공식·챕터 연습이 각각 실행된다", async ({ page }) => {
  await page.goto("/#/practice?mode=identify");
  await ready(page);
  await page.getByRole("button", { name: "연습 시작", exact: true }).click();
  await expect(page.locator(".question-panel h2")).toContainText("보험");
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "제출하고 결과 보기" }).click();
  await page.getByRole("button", { name: "제출 확정" }).click();
  await expect(page.locator(".result-main")).toContainText("2");
  await page.goto("/#/practice?mode=formula");
  await ready(page);
  await page.getByRole("button", { name: "연습 시작", exact: true }).click();
  await expect(page.locator(".written-answer textarea")).toHaveCount(1);
  await page
    .locator(".written-answer textarea")
    .fill("공식의 기호와 적용 조건을 설명한다.");
  await page.getByRole("button", { name: "제출하고 결과 보기" }).click();
  await page.getByRole("button", { name: "제출 확정" }).click();
  await expect(page.locator(".result-main")).toContainText("미채점");
  await page.goto("/#/practice?chapter=5");
  await ready(page);
  await page.getByRole("button", { name: "연습 시작", exact: true }).click();
  await expect(page.locator(".question-panel")).toBeVisible();
  await noOverflow(page);
});
