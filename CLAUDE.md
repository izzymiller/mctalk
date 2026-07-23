# mctalk

HTML slide deck for the talk "everything's made up & the points don't
matter" (data benchmarks). See README.md for full usage.

## Key facts

- `site/` is a fully static deck: `index.html` (one `<section class="slide">`
  per slide), `style.css`, `deck.js` (nav/fragments/presenter/overview),
  `notes.js` (speaker notes array, 0-indexed).
- Serve with `npm run serve` (python http.server on port 8765). The
  puppeteer scripts assume `http://localhost:8765`.
- Fragments: elements with class `fragment` reveal step-by-step; `deck.js`
  toggles `revealed`/`current` classes.
- Presenter window: `?presenter=1`, synced via BroadcastChannel
  `mctalk-deck` and URL hash.
- PDF build: run the server, then `node pdf.mjs` to render every
  slide+fragment state to `pdf-shots/*.png`; combine with img2pdf or
  ImageMagick. Scripts use `puppeteer-core` with a hardcoded Chrome for
  Testing `executablePath` — install via
  `npx @puppeteer/browsers install chrome@stable --path ./chrome` and adjust
  the path if needed.
- Generated artifacts (screenshots, pdf-shots/, deck.pdf, chrome/) are
  gitignored; don't commit them.
