import puppeteer from 'puppeteer-core';
import fs from 'fs';

const W = 1920, H = 1080;
const out = 'pdf-shots';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: '/Users/izzy/mctalk/chrome/mac_arm-148.0.7778.167/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  headless: 'new',
  defaultViewport: { width: W, height: H, deviceScaleFactor: 2 },
});
const page = await browser.newPage();
await page.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle0' });

const plan = await page.evaluate(() => {
  const slides = document.querySelectorAll('#deck .slide');
  return Array.from(slides).map((s) => s.querySelectorAll('.fragment').length);
});
process.stderr.write(`slides: ${plan.length}, with fragments: ${plan.filter(n => n > 0).length}\n`);

let pageNum = 0;
for (let i = 0; i < plan.length; i++) {
  const fragCount = plan[i];
  // capture each fragment state: 0..fragCount inclusive
  // (state 0 = nothing revealed, state fragCount = all revealed)
  const states = fragCount === 0 ? [0] : Array.from({ length: fragCount + 1 }, (_, k) => k);
  for (const fragIdx of states) {
    await page.evaluate((idx, frag) => {
      window.location.hash = String(idx + 1);
      const slides = document.querySelectorAll('#deck .slide');
      slides.forEach((s, k) => s.classList.toggle('active', k === idx));
      const cur = document.getElementById('cur');
      if (cur) cur.textContent = idx + 1;
      const active = slides[idx];
      if (active) {
        const frags = active.querySelectorAll('.fragment');
        frags.forEach((f, k) => {
          f.classList.toggle('revealed', k < frag);
          f.classList.toggle('current', k === frag - 1);
        });
        active.dataset.fragIdx = String(frag);
      }
    }, i, fragIdx);
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 1800));
    pageNum += 1;
    const name = `page-${String(pageNum).padStart(3, '0')}_slide-${String(i + 1).padStart(2, '0')}_f${fragIdx}.png`;
    await page.screenshot({
      path: `${out}/${name}`,
      clip: { x: 0, y: 0, width: W, height: H },
    });
    process.stderr.write(`.${i + 1}.${fragIdx}`);
  }
}
process.stderr.write(`\ntotal pages: ${pageNum}\n`);
await browser.close();
