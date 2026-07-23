import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: '/Users/izzy/mctalk/chrome/mac_arm-148.0.7778.167/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  headless: 'new',
  defaultViewport: { width: 1600, height: 1000 }
});
const page = await browser.newPage();
// load slide 4 directly, no fragments revealed
await page.goto('http://localhost:8765/index.html#4', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: 'frag-0.png' });
// now press right 4 times to reveal all fragments
for (let i = 0; i < 4; i++) { await page.keyboard.press('ArrowRight'); await new Promise(r => setTimeout(r, 400)); }
await page.screenshot({ path: 'frag-4.png' });
await browser.close();
