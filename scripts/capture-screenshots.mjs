import { chromium } from '@playwright/test';
import { existsSync,mkdirSync } from 'node:fs';
const address=process.argv[2]??'http://127.0.0.1:5173';
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE??(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
mkdirSync('public/artifacts',{recursive:true});
try {
 for(const [name,width,height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844]]){
  const context=await browser.newContext({viewport:{width,height}});const page=await context.newPage();
  const ready=async()=>{await page.locator('main h1').waitFor();await page.evaluate(()=>document.fonts.ready);};
  await page.goto(address);await ready();await page.screenshot({path:`public/artifacts/dashboard-${name}.png`,fullPage:true});
  await page.goto(`${address}/#/lab`);await ready();await page.getByLabel('분포 선택',{exact:true}).selectOption('poisson');await page.getByTestId('lab-mean').waitFor();await page.screenshot({path:`public/artifacts/distribution-${name}.png`,fullPage:true});
  await page.goto(`${address}/#/practice?mode=exam`);await ready();await page.getByRole('button',{name:'모의시험 시작',exact:true}).first().click();await page.getByRole('button',{name:'문제 21',exact:true}).click();await page.locator('.subquestions textarea').first().fill('평균 19, 중앙값 17. 큰 관측값 40이 평균을 높인다.');await page.locator('.subquestions textarea').first().blur();await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`public/artifacts/exam-${name}.png`,fullPage:true});
  if(name==='desktop'){await page.goto(`${address}/#/learn/bernoulli`);await ready();await page.locator('.katex').first().waitFor();await page.screenshot({path:'public/artifacts/concept-desktop.png',fullPage:true});}
  await context.close();
 }
 console.log('Captured 10 screenshots: dashboard, distribution, exam at 3 sizes; concept desktop.');
} finally {await browser.close();}
