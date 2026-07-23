import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: '/Users/izzy/mctalk/chrome/mac_arm-148.0.7778.167/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  headless: 'new',
  defaultViewport: { width: 1600, height: 1000 }
});
const page = await browser.newPage();
await page.goto(`http://localhost:8765/index.html?presenter=1#3`, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: `presenter-test.png` });
await browser.close();
