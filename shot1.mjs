import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: '/Users/izzy/mctalk/chrome/mac_arm-148.0.7778.167/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  headless: 'new',
  defaultViewport: { width: 1920, height: 1200 }
});
const page = await browser.newPage();
await page.goto(`http://localhost:8765/index.html`, { waitUntil: 'networkidle0' });
const i = parseInt(process.argv[2] || '44', 10);
await page.evaluate((idx) => {
  window.location.hash = String(idx);
  const slides = document.querySelectorAll('#deck .slide');
  slides.forEach((s, k) => s.classList.toggle('active', k === idx - 1));
  const active = slides[idx - 1];
  if (active) active.querySelectorAll('.fragment').forEach(f => f.classList.add('revealed'));
}, i);
await new Promise(r => setTimeout(r, 700));
await page.screenshot({ path: 'big-slide.png' });
await browser.close();
