---
name: talk-deck
description: Build a self-contained HTML/CSS/JS slide deck for conference talks with presenter mode, speaker notes, fragment reveals, and a scrapbook-style visual vocabulary. Use when the user wants to convert a PPTX, Keynote, or talk outline into a code-driven deck they can present from a browser, iterate on rapidly, and check into git.
user-invocable: true
---

A lightweight, opinionated approach to building conference-talk decks as a static site. Optimized for talks where the talk track (speaker notes) carries the content and the visuals are typographic + collaged screenshots. Battle-tested on Izzy's MetricCity / "everything's made up and the points don't matter" talk.

## When to reach for this

- The user has a PPTX, Keynote, or markdown outline and wants something faster to iterate on visually.
- The talk leans on screenshots, quotes, and short typographic statements — not bullet lists.
- The user wants to present from a laptop browser with presenter view + speaker notes.
- They want every change to be a diff (no binary `.pptx` churn).

Don't use this for: long-form bullet decks, slides authored by non-technical collaborators, anything that needs PowerPoint animations beyond simple fragment reveals.

## Project layout

```
mctalk/
├── site/
│   ├── index.html      # one <section class="slide"> per slide
│   ├── deck.js         # nav, fragments, presenter mode, broadcast sync
│   ├── notes.js        # window.SPEAKER_NOTES = [...] (one entry per slide, 0-indexed)
│   ├── style.css       # all slide styles
│   └── assets/         # images, named durably (NOT "Screenshot 2026-...")
├── slide_content.md    # the original PPTX export, kept as a reference
└── extracted/          # raw unzipped pptx, used to recover lost notes
```

Serve with any static server: `cd site && python3 -m http.server 8765`.

## Slide authoring conventions

Every slide is `<section class="slide ...">` in `index.html`. Add semantic modifier classes per slide type so styles stay local and don't leak.

Common patterns that worked well:

- **Centered statement**: `class="slide centered thesis"` — large italic prose, one idea per slide.
- **Bench card**: `class="slide bench foo-slide"` — a small `.bench-header` with `<h2>` and a single hero image or grid.
- **Scrapbook collage**: `class="slide bench scrapbook"` with three `.sb-img` tiles (`.sb-1`, `.sb-2`, `.sb-3`) — overlapping rotated screenshots. This is the workhorse for "here are some links/screenshots about a benchmark." See `.scrapbook-stage` in style.css.
- **Section divider**: `class="slide section-divider"` with a single big `<h2>`.
- **Trajectory / transcript**: `class="slide mc-trajectory"` — multi-row agent transcript with `.tkt-row`, `.tkt-thinking`, etc. Reserved for narratively important moments.
- **Contrast cards**: `class="slide mc-contrast"` or `mc-double` — two side-by-side cards comparing model A vs model B on the same task.

The CSS uses a small token set (`--accent`, `--rule`, `--mono`, `--ink`, `--ink-muted`) defined at the top of style.css. New slides should reuse these rather than introducing new colors.

## Fragments (click-to-reveal)

Add `class="fragment"` to any element. `deck.js` reveals them on click/space in order, then advances to the next slide.

Variants in style.css: `.fragment.fade-up` (default), `.fragment.fade` (no transform), `.fragment.strike`, `.fragment.highlight`.

**Gotcha**: the default fragment transition applies `transform: translateY(...)` on reveal, which clobbers any `transform` you set on the element (e.g. `translate(-50%, -50%)` for centering, or `rotate()` for scrapbook tilts). When the element needs its own transform, either:
1. Use `class="fragment fade"` (transform: none), or
2. Position via `top`/`left`/`width` percentages instead of translate-centering.

## Speaker notes

`notes.js` is just `window.SPEAKER_NOTES = [...]` — one entry per slide, 0-indexed, in deck order. Inline `// N: Title` comments above each entry as cosmetic labels.

**The single most important invariant**: notes array length and order must match the slide order in `index.html`. When you insert a slide in the deck, you must insert a notes entry at the same index. When you reorder slides, you must reorder notes.

When notes drift out of alignment, the symptom is "the speaker notes for slide N talk about slide N-1." Fix by reading both files side by side, identifying the actual deck order from `index.html`, and reordering the notes array to match.

The `// N: Title` comments are *cosmetic* — they don't drive anything. You can leave them stale during a refactor and renumber at the end, or skip renumbering entirely (the user is unlikely to care unless they ask).

## Presenter mode

Press `P` to open a second window with current slide + next slide preview + speaker notes + clock/elapsed. The two windows sync via `BroadcastChannel` — keep both open during dress rehearsal.

Keyboard: arrows/space nav, `F` fullscreen, `O` overview, `?` help, shift+click goes back.

## Workflow that worked

1. **Start from the source**: if the user has a `.pptx`, unzip it (`unzip foo.pptx -d extracted/`) and extract slide text + notes from `extracted/ppt/notesSlides/notesSlide*.xml`. Save as `slide_content.md` for reference. **Don't delete this** — when a slide gets lost or notes drift, this is your source of truth.

2. **Build slides incrementally, one per session**: don't try to translate the whole deck in one shot. Get the first 3-5 slides looking right, then the rest is mostly copying the patterns.

3. **Keep images durable**: when the user drops a screenshot named `Screenshot 2026-05-13 at 2.32.34 PM.png`, immediately copy it into `site/assets/` with a meaningful name (`ade-bench-overlay.png`, not the timestamp). The timestamp filename will disappear or be reused; the durable name is what `index.html` references.

   macOS quirk: filenames with spaces sometimes fail with `cp` / direct shell globbing. If `cp 'Screenshot 2026-...'` fails with "No such file or directory" despite `find` locating the file, use `find ... -exec cp {} dest \;` or pipe through `while read`.

4. **When the user says "bring back the slide about X"**: grep `slide_content.md` and `extracted/ppt/notesSlides/` for X before authoring fresh content. The original wording is usually better and shorter than what you'd write from scratch.

5. **Match the existing visual vocabulary**: when adding a new slide, find the closest existing slide type and reuse its classes. Don't invent `.ade-stage` when `.scrapbook-stage` already does the same job.

## Anti-patterns to avoid

- **Inventing new style scaffolding** when an existing slide pattern fits. Search style.css first.
- **Putting talk-track text on slides**. The user's strong preference: visuals only on slides, words in `notes.js`. If they ask "no text on slides, all talk track there" — that applies to the whole deck, not just one slide.
- **Renumbering note comments compulsively** mid-task. They're cosmetic; the user will tell you when they want them tidied.
- **Generating new screenshots / fake content** when the user references something from the original PPTX. Recover it from `slide_content.md` or `extracted/`.
- **Adding bullet lists**. This deck style is statement-per-slide. If you find yourself writing `<ul>`, you're probably making the wrong kind of slide.

## File pointers to read first

- `site/index.html` — slide order is the spine of the deck.
- `site/notes.js` — must stay aligned with `index.html`.
- `site/style.css` — search for the slide class you're touching before adding new CSS.
- `slide_content.md` and `extracted/ppt/notesSlides/` — authoritative for "what was originally on slide X."
