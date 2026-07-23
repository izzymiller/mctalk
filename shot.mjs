import puppeteer from 'puppeteer-core';
import fs from 'fs';
const slides = parseInt(process.argv[2] || '41', 10);
const out = process.argv[3] || 'shots';
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: '/Users/izzy/mctalk/chrome/mac_arm-148.0.7778.167/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  headless: 'new',
  defaultViewport: { width: 1600, height: 1000 }
});
const page = await browser.newPage();
await page.goto(`http://localhost:8765/index.html`, { waitUntil: 'networkidle0' });
for (let i = 1; i <= slides; i++) {
  await page.evaluate((idx) => {
    window.location.hash = String(idx);
    const slides = document.querySelectorAll('#deck .slide');
    slides.forEach((s, k) => s.classList.toggle('active', k === idx - 1));
    const cur = document.getElementById('cur');
    if (cur) cur.textContent = idx;
    // reveal all fragments
    const active = slides[idx - 1];
    if (active) active.querySelectorAll('.fragment').forEach(f => f.classList.add('revealed'));
  }, i);
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: `${out}/slide-${String(i).padStart(2,'0')}.png` });
  process.stderr.write(`.${i}`);
}
process.stderr.write('\n');
await browser.close();
