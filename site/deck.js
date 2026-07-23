// Lightweight slide deck driver
// Features: arrow/space nav, F fullscreen, P presenter mode, O overview, ? help,
// URL hash sync, BroadcastChannel for presenter sync.

(function() {
  const slides = Array.from(document.querySelectorAll('#deck .slide'));
  const total = slides.length;
  document.getElementById('total').textContent = total;

  const params = new URLSearchParams(window.location.search);
  const isPresenterWindow = params.get('presenter') === '1';
  document.body.classList.toggle('presenter-mode', isPresenterWindow);

  let current = 0;
  const hashIdx = parseInt(window.location.hash.replace('#', ''), 10);
  if (!isNaN(hashIdx) && hashIdx >= 1 && hashIdx <= total) {
    current = hashIdx - 1;
  }

  const channel = ('BroadcastChannel' in window) ? new BroadcastChannel('mctalk-deck') : null;

  function setSlide(i, broadcast = true, fragmentIndex = 0) {
    if (i < 0) i = 0;
    if (i >= total) i = total - 1;
    current = i;
    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx === i);
    });
    document.getElementById('cur').textContent = i + 1;
    document.getElementById('progress-bar').style.width = ((i + 1) / total * 100) + '%';
    window.location.hash = String(i + 1);
    setFragmentIndex(slides[i], fragmentIndex);
    updateOverviewCurrent();
    if (broadcast && channel) {
      channel.postMessage({ type: 'goto', index: i, fragment: fragmentIndex });
    }
    if (isPresenterWindow) {
      renderPresenterView(i);
    }
  }

  function getFragments(slide) {
    return Array.from(slide.querySelectorAll('.fragment'));
  }
  function setFragmentIndex(slide, idx) {
    const frags = getFragments(slide);
    frags.forEach((f, k) => {
      f.classList.toggle('revealed', k < idx);
      f.classList.toggle('current', k === idx - 1);
    });
    slide.dataset.fragIdx = String(idx);
  }
  function currentFragmentIndex(slide) {
    return parseInt(slide.dataset.fragIdx || '0', 10);
  }

  function next() {
    const slide = slides[current];
    const frags = getFragments(slide);
    const idx = currentFragmentIndex(slide);
    if (idx < frags.length) {
      setFragmentIndex(slide, idx + 1);
      if (channel) channel.postMessage({ type: 'goto', index: current, fragment: idx + 1 });
      return;
    }
    setSlide(current + 1);
  }
  function prev() {
    const slide = slides[current];
    const idx = currentFragmentIndex(slide);
    if (idx > 0) {
      setFragmentIndex(slide, idx - 1);
      if (channel) channel.postMessage({ type: 'goto', index: current, fragment: idx - 1 });
      return;
    }
    // moving back: go to previous slide with all fragments revealed
    const prevSlide = slides[current - 1];
    const prevFrags = prevSlide ? getFragments(prevSlide).length : 0;
    setSlide(current - 1, true, prevFrags);
  }

  // ============ Keyboard ============
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

    if (document.getElementById('overview').classList.contains('hidden') === false) {
      // Overview mode
      if (e.key === 'Escape' || e.key === 'o' || e.key === 'O') {
        hideOverview();
        e.preventDefault();
        return;
      }
    }

    switch (e.key) {
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
      case 'n':
      case 'j':
        next(); e.preventDefault(); break;
      case 'ArrowLeft':
      case 'PageUp':
      case 'p':
      case 'k':
        prev(); e.preventDefault(); break;
      case 'Home':
        setSlide(0); e.preventDefault(); break;
      case 'End':
        setSlide(total - 1); e.preventDefault(); break;
      case 'f':
      case 'F':
        toggleFullscreen(); e.preventDefault(); break;
      case 'o':
      case 'O':
        toggleOverview(); e.preventDefault(); break;
      case 's':
      case 'S':
        openPresenter(); e.preventDefault(); break;
      case '?':
        alert(`Keyboard shortcuts:

→ / Space / N    next slide
← / P            previous slide
Home / End       first / last slide
F                fullscreen
S                open speaker / presenter window
O                overview grid
? / H            this help

A presenter window mirrors your navigation. Drag it to a second screen.`);
        e.preventDefault();
        break;
    }
  });

  // ============ Click to advance (with shift to go back) ============
  document.addEventListener('click', (e) => {
    if (e.target.closest('button, a, .overview-card, #hint, #presenter-view, #overview')) return;
    if (isPresenterWindow) return;
    if (e.shiftKey) prev();
    else next();
  });

  // ============ Fullscreen ============
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }

  // ============ Overview ============
  const overviewEl = document.getElementById('overview');
  function buildOverview() {
    overviewEl.innerHTML = '';
    slides.forEach((s, idx) => {
      const card = document.createElement('div');
      card.className = 'overview-card';
      card.dataset.idx = idx;
      // Pull a representative chunk
      const clone = s.cloneNode(true);
      clone.style.cssText = 'transform: scale(0.12); transform-origin: top left; width: 800px; pointer-events: none; position: relative; display: flex;';
      // Try to grab a title or first line of text
      const h = s.querySelector('h1, h2, .punch-line, .thesis-body, .big-text, .city-name, .section-title');
      const title = h ? h.textContent.trim().slice(0, 60) : `Slide ${idx + 1}`;
      card.innerHTML = `<div style="font-family: var(--serif); font-size: 0.85rem; line-height: 1.3; color: var(--ink-soft); padding: 0.4em; height: 100%; overflow: hidden; display: flex; align-items: center;">${title}</div><div class="ov-num">${idx + 1}</div>`;
      card.addEventListener('click', () => {
        setSlide(idx);
        hideOverview();
      });
      overviewEl.appendChild(card);
    });
  }
  function updateOverviewCurrent() {
    const cards = overviewEl.querySelectorAll('.overview-card');
    cards.forEach((c, i) => c.classList.toggle('current', i === current));
  }
  function showOverview() {
    overviewEl.classList.remove('hidden');
    updateOverviewCurrent();
  }
  function hideOverview() {
    overviewEl.classList.add('hidden');
  }
  function toggleOverview() {
    if (overviewEl.classList.contains('hidden')) showOverview();
    else hideOverview();
  }

  // ============ Presenter mode ============
  function openPresenter() {
    const url = new URL(window.location.href);
    url.searchParams.set('presenter', '1');
    url.hash = String(current + 1);
    const w = window.open(url.toString(), 'presenter', 'width=1280,height=800');
    if (w) w.focus();
  }

  // Broadcast sync (both directions)
  if (channel) {
    channel.onmessage = (e) => {
      const msg = e.data || {};
      if (msg.type === 'goto') {
        if (msg.index !== current) {
          setSlide(msg.index, false, msg.fragment || 0);
        } else if (msg.fragment != null) {
          setFragmentIndex(slides[current], msg.fragment);
        }
      }
    };
  }

  // ============ Presenter view rendering ============
  function ensurePresenterDOM() {
    if (document.getElementById('presenter-view')) return;
    const pv = document.createElement('div');
    pv.id = 'presenter-view';
    pv.innerHTML = `
      <div class="pv-header">
        <div class="pv-counter">slide <strong id="pv-cur">1</strong> / <span id="pv-total">${total}</span></div>
        <div class="pv-time" id="pv-time">00:00:00</div>
        <div class="pv-elapsed" id="pv-elapsed">elapsed 00:00</div>
      </div>
      <div class="pv-current"><div class="pv-mini" id="pv-current-mini"></div></div>
      <div class="pv-notes" id="pv-notes-body"></div>
      <div class="pv-next"><div class="pv-mini" id="pv-next-mini"></div></div>
    `;
    document.body.appendChild(pv);
  }

  function buildMini(intoEl, sourceSlide) {
    intoEl.innerHTML = '';
    if (!sourceSlide) {
      intoEl.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;font-family:var(--mono);font-size:0.75rem;letter-spacing:0.2em;">— END —</div>`;
      return;
    }
    const stage = document.createElement('div');
    stage.className = 'mini-stage';
    const clone = sourceSlide.cloneNode(true);
    clone.classList.add('active');
    stage.appendChild(clone);
    intoEl.appendChild(stage);
  }

  function scaleMini(containerEl) {
    const stage = containerEl.querySelector('.mini-stage');
    if (!stage) return;
    const cw = containerEl.clientWidth;
    const ch = containerEl.clientHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (!cw || !ch || !vw || !vh) return;
    const scale = Math.min(cw / vw, ch / vh);
    stage.style.transform = `scale(${scale})`;
    // center
    const offsetX = (cw - vw * scale) / 2;
    const offsetY = (ch - vh * scale) / 2;
    stage.style.left = offsetX + 'px';
    stage.style.top = offsetY + 'px';
  }

  function renderPresenterView(i) {
    ensurePresenterDOM();
    document.getElementById('pv-cur').textContent = (i + 1);

    const currentMini = document.getElementById('pv-current-mini');
    const nextMini = document.getElementById('pv-next-mini');
    const notesBody = document.getElementById('pv-notes-body');

    buildMini(currentMini, slides[i]);
    buildMini(nextMini, i + 1 < total ? slides[i + 1] : null);

    requestAnimationFrame(() => {
      scaleMini(currentMini);
      scaleMini(nextMini);
    });

    // Notes (allow lightweight markdown: *italic*, **bold**, `code`)
    const notes = (window.SPEAKER_NOTES || [])[i] || '';
    notesBody.innerHTML = notes
      .split(/\n\n+/)
      .map(p => '<p>' + renderInline(p) + '</p>')
      .join('');
  }

  function renderInline(s) {
    return escapeHtml(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[\s—])\*([^*]+)\*/g, '$1<em>$2</em>')
      .replace(/\n/g, '<br/>');
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Clock + elapsed
  let startedAt = null;
  function tickClock() {
    if (!isPresenterWindow) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const t = document.getElementById('pv-time');
    if (t) t.textContent = `${hh}:${mm}:${ss}`;
    const e = document.getElementById('pv-elapsed');
    if (e) {
      if (!startedAt) startedAt = Date.now();
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const em = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const es = String(elapsed % 60).padStart(2, '0');
      e.textContent = `elapsed ${em}:${es}`;
    }
  }

  // Click anywhere on presenter view to reset elapsed by double-click
  document.addEventListener('dblclick', (e) => {
    if (!isPresenterWindow) return;
    if (e.target.closest('#pv-elapsed')) {
      startedAt = Date.now();
    }
  });

  // ============ Init ============
  buildOverview();
  setSlide(current, false);

  if (isPresenterWindow) {
    ensurePresenterDOM();
    renderPresenterView(current);
    setInterval(tickClock, 1000);
    tickClock();
    // Resize listener re-scales preview
    window.addEventListener('resize', () => renderPresenterView(current));
  }

  // Visibility on the hint
  let hintTimer;
  function flashHint() {
    const h = document.getElementById('hint');
    if (!h) return;
    h.classList.add('visible');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => { h.classList.remove('visible'); }, 1800);
  }
  document.addEventListener('mousemove', flashHint);
})();
