import { chromium, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import assert from "node:assert/strict";

const address = process.argv[2];
assert.ok(address, "Provide the Pages site or local preview address ending in /Economic-Statistics/.");
const base = new URL(address);
assert.ok(base.pathname.endsWith("/Economic-Statistics/"));
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
  args: ["--no-sandbox"],
});
try {
  for(const [name,viewport] of [["desktop",{width:1440,height:1000}],["mobile",{width:390,height:844}]]) {
    const context=await browser.newContext({viewport});
    const page=await context.newPage();
    const errors=[],failures=[];
    page.on("pageerror",(e)=>errors.push(e.message));
    page.on("response",(response)=>{if(response.status()>=400)failures.push(`${response.status()} ${response.url()}`);});
    await page.goto(base.href);
    await expect(page.locator("main h1")).toContainText("오늘도, 이해가 쌓이는 시간");
    await page.getByRole("textbox",{name:"개념 검색"}).fill("Bernoulli");
    await page.locator(".search-results a").first().click();
    await expect(page.locator("main h1")).toHaveText("베르누이 분포");
    await expect(page.locator(".katex").first()).toBeVisible();
    await page.getByRole("button",{name:"학습 완료로 표시",exact:true}).click();
    await page.reload();
    await expect(page.getByRole("button",{name:"학습 완료됨",exact:true})).toBeVisible();
    const source=page.locator('.lesson-sources a[href*="#page=254"]').first();
    const pdfAddress=new URL(await source.getAttribute("href"),page.url());
    assert.ok(pdfAddress.pathname.startsWith(base.pathname));
    const pdf=await page.request.get(pdfAddress.href);
    assert.equal(pdf.status(),200);
    assert.ok(pdf.headers()["content-type"].includes("application/pdf"));
    await page.goto(`${base.href}#/learn/normal-stock`);
    await expect(page.getByTestId("stock-integer")).toHaveText("624");
    await page.getByRole("spinbutton",{name:"허용 부족확률 (%)",exact:true}).fill("5");
    await expect(page.getByTestId("stock-integer")).toHaveText("599");
    await page.evaluate(()=>document.fonts.ready);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
    console.log(`PASS ${name}: project prefix, lazy scripts, math, progress reload, source PDF and normal calculator.`);
    await context.close();
  }
} finally {await browser.close();}
