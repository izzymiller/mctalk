import puppeteer from 'puppeteer-core';

const W = 1920, H = 1080;
const SLIDE = 45;

const browser = await puppeteer.launch({
  executablePath: '/Users/izzy/mctalk/chrome/mac_arm-148.0.7778.167/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  headless: 'new',
  defaultViewport: { width: W, height: H, deviceScaleFactor: 2 },
});
const page = await browser.newPage();
await page.goto(`http://localhost:8080/index.html`, { waitUntil: 'networkidle0' });

// Activate the target slide the same way pdf.mjs does.
await page.evaluate((idx) => {
  window.location.hash = String(idx);
  const slides = document.querySelectorAll('#deck .slide');
  slides.forEach((s, k) => s.classList.toggle('active', k === idx - 1));
  const cur = document.getElementById('cur');
  if (cur) cur.textContent = idx;
}, SLIDE);

await page.evaluate(() => document.fonts.ready);
await new Promise(r => setTimeout(r, 600));

// Find the scrollable descendant inside the active slide and scroll it to bottom.
const info = await page.evaluate(() => {
  const slide = document.querySelector('#deck .slide.active');
  let best = null, bestOver = 0;
  for (const el of slide.querySelectorAll('*')) {
    const over = el.scrollHeight - el.clientHeight;
    const style = getComputedStyle(el);
    const scrolls = /(auto|scroll)/.test(style.overflowY);
    if (scrolls && over > bestOver) { best = el; bestOver = over; }
  }
  if (best) best.scrollTop = best.scrollHeight;
  return { found: !!best, overflow: bestOver, cls: best ? best.className : null };
});
console.error(JSON.stringify(info));

await new Promise(r => setTimeout(r, 400));
await page.screenshot({
  path: `pdf-shots-scrolled_slide-${SLIDE}.png`,
  clip: { x: 0, y: 0, width: W, height: H },
});
await browser.close();
console.error('done');
