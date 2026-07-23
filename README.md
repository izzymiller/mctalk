# everything's made up & the points don't matter

Slides for Izzy Miller's talk on data/analytics benchmarks, given as a
hand-built HTML deck. No framework — just `index.html`, CSS, and two small
JS files.

## Running the deck

The deck is fully static. Serve the `site/` directory and open it in a
browser:

```sh
npm run serve        # python http.server on port 8765
# then open http://localhost:8765
```

Any static file server works; port 8765 is just what the screenshot/PDF
scripts expect.

### Controls

| Key | Action |
| --- | --- |
| `→` / `Space` | next fragment / slide |
| `←` | previous |
| `F` | fullscreen |
| `S` | open speaker/presenter window |
| `O` or `Esc` | overview grid |
| `?` | help |

Navigation syncs to the URL hash (`#12` jumps to slide 12) and broadcasts
over a `BroadcastChannel`, so the presenter window (opened with `S`, or
directly via `?presenter=1`) mirrors the main window. Drag it to a second
screen. Speaker notes live in `site/notes.js`, one entry per slide.

## Building the PDF

`pdf.mjs` drives headless Chrome over the running deck and screenshots
every slide at every fragment state into `pdf-shots/` as numbered PNGs
(`page-001_slide-01_f0.png`, ...).

One-time setup — the scripts use `puppeteer-core`, which does not bundle a
browser:

```sh
npm install
npx @puppeteer/browsers install chrome@stable --path ./chrome
```

Then update the hardcoded `executablePath` at the top of the `.mjs` scripts
if your Chrome version/path differs.

Build:

```sh
npm run serve        # in one terminal
node pdf.mjs         # in another; writes pdf-shots/*.png
```

Combine the PNGs into a PDF with your tool of choice, e.g.:

```sh
img2pdf pdf-shots/*.png -o deck.pdf
# or: magick pdf-shots/*.png deck.pdf
```

## Other scripts

Small one-off puppeteer helpers, all expecting the deck served on
`localhost:8765` (except `scroll-shot.mjs`, which uses 8080):

- `shot.mjs [n] [outdir]` — screenshot slides 1..n (all fragments revealed) into `shots/`
- `shot1.mjs [n]` — one big high-res screenshot of slide n
- `fshot.mjs` — before/after fragment-reveal shots of a single slide
- `pshot.mjs` — screenshot of the presenter view
- `scroll-shot.mjs` — scroll-position capture of one slide

## Layout

```
site/
  index.html   the deck: one <section class="slide"> per slide
  style.css    all styling, including print + presenter styles
  deck.js      navigation, fragments, presenter mode, overview
  notes.js     speaker notes (window.SPEAKER_NOTES, 0-indexed)
  assets/      images and gifs referenced by slides
pdf.mjs        PDF page renderer (see above)
```
