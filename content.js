// WEbDle — se inyecta al pulsar el icono. Si ya existe en la página, alterna su visibilidad.
(() => {
  if (window.__webdle) {
    window.__webdle.toggle();
    return;
  }

  // Estilos del panel. Van dentro de este archivo para que el panel nunca dependa de otro script.
  const PANEL_CSS = `
:host {
  --bg: #16181d;
  --surface: #1f2229;
  --border: #353a45;
  --text: #f1f3f6;
  --muted: #9aa3b2;
  --correct: #3fa34d;
  --present: #d4a72c;
  --absent: #4b5260;
  --accent: #5b8def;
}

*, *::before, *::after { box-sizing: border-box; }

button {
  font: inherit;
  cursor: pointer;
  border: none;
  margin: 0;
}

.panel {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  width: 320px;
  max-height: calc(100vh - 32px);
  overflow: auto;
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
  outline: none;
  font-size: 14px;
  line-height: 1.4;
  user-select: none;
}
.panel:focus-visible { box-shadow: 0 0 0 2px var(--accent), 0 12px 40px rgba(0, 0, 0, 0.45); }

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 8px 8px 14px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
  touch-action: none;
}
.bar:active { cursor: grabbing; }
.title { font-size: 17px; font-weight: 600; letter-spacing: 0.5px; }
.title b { color: var(--correct); }
.actions { display: flex; gap: 4px; }
.icon-btn {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: transparent;
  color: var(--muted);
  font-size: 16px;
  line-height: 28px;
}
.icon-btn:hover { background: var(--surface); color: var(--text); }

.panel.minimized .body { display: none; }
.panel.minimized .bar { border-bottom: none; }

.body { padding: 10px 12px 12px; position: relative; }

.info {
  margin: 0 0 10px;
  text-align: center;
  color: var(--muted);
  font-size: 12px;
}

/* Tablero */
.board { display: grid; gap: 5px; justify-content: center; margin-bottom: 12px; }
.row { display: grid; grid-template-columns: repeat(5, 48px); gap: 5px; }
.tile {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border);
  border-radius: 6px;
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  transition: background-color 0s, border-color 0s, color 0s;
}
.tile.filled { border-color: var(--muted); animation: pop 0.1s ease; }
.tile.flip { animation: flip 0.5s ease both; }
.tile.correct { background: var(--correct); border-color: var(--correct); }
.tile.present { background: var(--present); border-color: var(--present); color: #1a1a1a; }
.tile.absent { background: var(--absent); border-color: var(--absent); }

.row.shake { animation: shake 0.4s ease; }

@keyframes pop {
  50% { transform: scale(1.08); }
}
@keyframes flip {
  0% { transform: rotateX(0); }
  50% { transform: rotateX(90deg); }
  100% { transform: rotateX(0); }
}
@keyframes shake {
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

/* Aviso */
.toast {
  position: absolute;
  top: 34px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--text);
  color: var(--bg);
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 2;
}
.toast.show { opacity: 1; }

/* Fin de partida */
.end {
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 12px;
}
.end.won { border-color: var(--correct); }
.end.hidden { display: none; }
.end-msg { margin: 0 0 8px; }
.end-msg b { letter-spacing: 2px; }
.end-actions { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
.btn {
  padding: 7px 12px;
  border-radius: 8px;
  background: var(--border);
  color: var(--text);
  font-size: 13px;
  font-weight: 600;
}
.btn:hover { filter: brightness(1.15); }
.btn.primary { background: var(--accent); }

.hint {
  margin: 0;
  text-align: center;
  color: var(--muted);
  font-size: 11px;
}

@media (prefers-reduced-motion: reduce) {
  .tile.flip, .tile.filled, .row.shake { animation: none; }
}
`;

  const LEN = 5;
  const ROWS = 6;
  const HOST_ID = 'webdle-host';
  const SKIP_TAGS = new Set([
    'SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION',
    'CODE', 'PRE', 'SVG', 'TEMPLATE', 'IFRAME', 'CANVAS',
  ]);

  // ---------- Palabras de la página ----------

  // Mayúsculas y sin tildes/diéresis, pero conservando la Ñ.
  function normalize(word) {
    return word
      .normalize('NFC')
      .toUpperCase()
      .replace(/Ñ/g, '\u0001')
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .replace(/\u0001/g, 'Ñ');
  }

  const VALID = /^[A-ZÑ]{5}$/;

  // Recorre los nodos de texto visibles de la página (fuera del panel).
  function walkTextNodes(callback) {
    const visibleCache = new Map();
    const isVisible = (el) => {
      if (visibleCache.has(el)) return visibleCache.get(el);
      let ok = true;
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        if (SKIP_TAGS.has(n.tagName) || n.id === HOST_ID) { ok = false; break; }
      }
      if (ok && typeof el.checkVisibility === 'function') {
        ok = el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
      }
      visibleCache.set(el, ok);
      return ok;
    };
    if (!document.body) return;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        return parent && isVisible(parent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    let node;
    while ((node = walker.nextNode())) {
      if (callback(node) === false) return;
    }
  }

  function extractWords() {
    const words = new Set();
    walkTextNodes((node) => {
      for (const m of node.nodeValue.matchAll(/\p{L}+/gu)) {
        const w = normalize(m[0]);
        if (VALID.test(w)) words.add(w);
      }
    });
    return words;
  }

  // ---------- Lógica del juego ----------

  function scoreGuess(guess, secret) {
    const g = Array.from(guess);
    const s = Array.from(secret);
    const result = Array(LEN).fill('absent');
    const remaining = {};
    for (let i = 0; i < LEN; i++) {
      if (g[i] === s[i]) result[i] = 'correct';
      else remaining[s[i]] = (remaining[s[i]] || 0) + 1;
    }
    for (let i = 0; i < LEN; i++) {
      if (result[i] !== 'correct' && remaining[g[i]] > 0) {
        result[i] = 'present';
        remaining[g[i]]--;
      }
    }
    return result;
  }

  const state = {
    words: new Set(),
    secret: '',
    row: 0,
    current: '',
    over: false,
    revealing: false,
    gameId: 0,
  };

  // ---------- Interfaz ----------

  const host = document.createElement('div');
  host.id = HOST_ID;
  const hostStyle = {
    all: 'initial',
    position: 'fixed',
    top: '16px',
    right: '16px',
    'z-index': '2147483647',
    display: 'block',
  };
  for (const [k, v] of Object.entries(hostStyle)) host.style.setProperty(k, v, 'important');

  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `
    <div class="panel" tabindex="0" aria-label="WEbDle">
      <header class="bar">
        <span class="title">WEb<b>Dle</b></span>
        <div class="actions">
          <button class="icon-btn" data-act="new" title="Nueva partida">↻</button>
          <button class="icon-btn" data-act="min" title="Minimizar">–</button>
          <button class="icon-btn" data-act="close" title="Cerrar">×</button>
        </div>
      </header>
      <div class="body">
        <p class="info"></p>
        <div class="board"></div>
        <div class="toast" role="status" aria-live="polite"></div>
        <div class="end hidden">
          <p class="end-msg"></p>
          <div class="end-actions">
            <button class="btn" data-act="highlight">Resaltar en la página</button>
            <button class="btn primary" data-act="new">Nueva partida</button>
          </div>
        </div>
        <p class="hint">Escribe con tu teclado · Enter envía</p>
      </div>
    </div>
  `;

  const $ = (sel) => root.querySelector(sel);
  const panel = $('.panel');
  const board = $('.board');
  const info = $('.info');
  const toastEl = $('.toast');
  const endBox = $('.end');
  const endMsg = $('.end-msg');
  const tiles = [];

  for (let r = 0; r < ROWS; r++) {
    const rowEl = document.createElement('div');
    rowEl.className = 'row';
    tiles.push([]);
    for (let c = 0; c < LEN; c++) {
      const t = document.createElement('div');
      t.className = 'tile';
      rowEl.appendChild(t);
      tiles[r].push(t);
    }
    board.appendChild(rowEl);
  }

  let toastTimer;
  function toast(msg, ms = 1600) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
  }

  function renderRow(r) {
    const letters = Array.from(r === state.row ? state.current : '');
    for (let c = 0; c < LEN; c++) {
      const t = tiles[r][c];
      t.textContent = letters[c] || '';
      t.classList.toggle('filled', !!letters[c]);
    }
  }

  function newGame(words = extractWords()) {
    clearHighlight();
    state.gameId++;
    state.words = words;
    state.row = 0;
    state.current = '';
    state.over = false;
    state.revealing = false;
    for (const row of tiles) {
      for (const t of row) {
        t.textContent = '';
        t.className = 'tile';
        t.style.animationDelay = '';
        t.style.transitionDelay = '';
      }
    }
    endBox.classList.add('hidden');

    const list = Array.from(state.words);
    if (list.length === 0) {
      state.secret = '';
      state.over = true;
      info.textContent = 'Esta página no tiene palabras de 5 letras. Prueba en otra.';
      return;
    }
    let pick = list[Math.floor(Math.random() * list.length)];
    if (list.length > 1 && pick === state.secret) {
      pick = list[(list.indexOf(pick) + 1) % list.length];
    }
    state.secret = pick;
    info.textContent = `${list.length} palabra${list.length === 1 ? '' : 's'} de 5 letras en esta página`;
  }

  function shakeRow() {
    const rowEl = board.children[state.row];
    rowEl.classList.remove('shake');
    void rowEl.offsetWidth;
    rowEl.classList.add('shake');
  }

  function submit() {
    if (state.current.length < LEN) {
      shakeRow();
      toast('Faltan letras');
      return;
    }
    if (!state.words.has(state.current)) {
      shakeRow();
      toast('No está en la página');
      return;
    }
    const guess = state.current;
    const result = scoreGuess(guess, state.secret);
    const r = state.row;
    state.revealing = true;
    result.forEach((res, c) => {
      const t = tiles[r][c];
      t.style.animationDelay = `${c * 250}ms`;
      t.style.transitionDelay = `${c * 250 + 250}ms`; // el color cambia a mitad del giro
      t.classList.add('flip', res);
    });

    const revealMs = (LEN - 1) * 250 + 500;
    const gameId = state.gameId;
    setTimeout(() => {
      if (gameId !== state.gameId) return; // se empezó otra partida mientras tanto
      state.revealing = false;
      if (guess === state.secret) {
        const msgs = ['¡Genial!', '¡Magnífico!', '¡Impresionante!', '¡Muy bien!', '¡Bien!', '¡Por los pelos!'];
        finish(true, `${msgs[r]} La palabra era <b>${state.secret}</b>.`);
      } else if (r === ROWS - 1) {
        finish(false, `La palabra era <b>${state.secret}</b>.`);
      }
    }, revealMs);

    state.row++;
    state.current = '';
    if (guess === state.secret || state.row >= ROWS) state.over = true;
  }

  function finish(won, html) {
    state.over = true;
    endMsg.innerHTML = html;
    endBox.classList.toggle('won', won);
    endBox.classList.remove('hidden');
  }

  function handleKey(k) {
    if (state.over || state.revealing) return;
    if (k === 'ENTER') return submit();
    if (k === 'BACK') {
      state.current = Array.from(state.current).slice(0, -1).join('');
    } else if (Array.from(state.current).length < LEN) {
      state.current += k;
    }
    renderRow(state.row);
  }

  // ---------- Resaltar la palabra en la página ----------

  let markEl = null;
  function clearHighlight() {
    if (markEl && markEl.parentNode) {
      const parent = markEl.parentNode;
      parent.replaceChild(document.createTextNode(markEl.textContent), markEl);
      parent.normalize();
    }
    markEl = null;
  }

  function highlightSecret() {
    clearHighlight();
    let found = false;
    walkTextNodes((node) => {
      for (const m of node.nodeValue.matchAll(/\p{L}+/gu)) {
        if (normalize(m[0]) !== state.secret) continue;
        const range = document.createRange();
        range.setStart(node, m.index);
        range.setEnd(node, m.index + m[0].length);
        markEl = document.createElement('mark');
        const markStyle = {
          background: '#ffd54f',
          color: '#111',
          padding: '0 2px',
          'border-radius': '3px',
          'box-shadow': '0 0 0 3px #ff9800',
        };
        for (const [k, v] of Object.entries(markStyle)) markEl.style.setProperty(k, v, 'important');
        range.surroundContents(markEl);
        markEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        found = true;
        return false;
      }
    });
    if (!found) toast('No se encontró en el texto visible');
  }

  // ---------- Eventos ----------

  root.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'new') { newGame(); panel.focus(); }
    else if (act === 'min') panel.classList.toggle('minimized');
    else if (act === 'close') hide();
    else if (act === 'highlight') highlightSecret();
  });

  panel.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    let handled = false;
    if (e.key === 'Enter') { handleKey('ENTER'); handled = true; }
    else if (e.key === 'Backspace') { handleKey('BACK'); handled = true; }
    else if (e.key === 'Escape') { hide(); handled = true; }
    else if (e.key.length === 1) {
      const ch = normalize(e.key);
      if (/^[A-ZÑ]$/.test(ch)) { handleKey(ch); handled = true; }
    }
    if (handled) e.preventDefault();
    e.stopPropagation();
  });
  for (const type of ['keyup', 'keypress']) {
    panel.addEventListener(type, (e) => e.stopPropagation());
  }

  // Arrastrar el panel desde la cabecera.
  const bar = $('.bar');
  bar.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('button')) return;
    const rect = host.getBoundingClientRect();
    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;
    bar.setPointerCapture(e.pointerId);
    const move = (ev) => {
      const x = Math.min(Math.max(0, ev.clientX - dx), window.innerWidth - rect.width);
      const y = Math.min(Math.max(0, ev.clientY - dy), window.innerHeight - 40);
      host.style.setProperty('left', `${x}px`, 'important');
      host.style.setProperty('top', `${y}px`, 'important');
      host.style.setProperty('right', 'auto', 'important');
    };
    const up = () => {
      bar.removeEventListener('pointermove', move);
      bar.removeEventListener('pointerup', up);
      bar.removeEventListener('pointercancel', up);
    };
    bar.addEventListener('pointermove', move);
    bar.addEventListener('pointerup', up);
    bar.addEventListener('pointercancel', up);
  });

  function show() {
    host.style.setProperty('display', 'block', 'important');
    panel.focus();
  }
  function hide() {
    host.style.setProperty('display', 'none', 'important');
  }
  function toggle() {
    if (host.style.display === 'none') show();
    else hide();
  }

  window.__webdle = { toggle };

  // ---------- Webs que cambian de página sin recargar ----------
  // Si la dirección cambia y el texto es otro, se empieza una partida nueva con las palabras nuevas.

  const pageKey = () => location.href.split('#')[0]; // los saltos a un #ancla no cuentan
  let lastKey = pageKey();
  let watch = null;

  function contentChanged(newWords) {
    if (state.secret && !newWords.has(state.secret)) return true;
    let shared = 0;
    for (const w of newWords) if (state.words.has(w)) shared++;
    const total = newWords.size + state.words.size - shared;
    return total > 0 && shared / total < 0.9;
  }

  function stopWatch() {
    if (!watch) return;
    watch.observer.disconnect();
    clearTimeout(watch.timer);
    clearTimeout(watch.endTimer);
    watch = null;
  }

  function onUrlMaybeChanged() {
    const key = pageKey();
    if (key === lastKey) return;
    lastKey = key;
    stopWatch();

    const start = Date.now();
    let restarted = false;
    const check = () => {
      const words = extractWords();
      // Tras el primer reinicio, solo se vuelve a leer si el jugador aún no ha escrito nada
      // (p. ej. la web mostró «Cargando…» y el texto real llegó después).
      const untouched = state.row === 0 && state.current === '';
      if ((!restarted || untouched) && contentChanged(words)) {
        newGame(words);
        if (!restarted && host.style.display !== 'none') toast('La página cambió: nueva partida', 2400);
        restarted = true;
      }
    };
    const w = { observer: null, timer: null, endTimer: null };
    const schedule = () => {
      clearTimeout(w.timer);
      // Espera a que la web deje de cambiar 0,7 s; la primera lectura, como mucho a los 3 s.
      const wait = restarted ? 700 : Math.max(0, Math.min(700, start + 3000 - Date.now()));
      w.timer = setTimeout(check, wait);
    };
    w.observer = new MutationObserver(schedule);
    w.observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    w.endTimer = setTimeout(() => { check(); stopWatch(); }, 6000);
    watch = w;
    schedule();
  }

  window.navigation?.addEventListener('currententrychange', onUrlMaybeChanged);
  window.addEventListener('popstate', onUrlMaybeChanged);
  setInterval(onUrlMaybeChanged, 1000); // respaldo para webs que cambian la URL de otras formas

  // ---------- Arranque ----------

  function init() {
    // Hoja de estilos construida: no la bloquean las webs con políticas de seguridad estrictas.
    try {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(PANEL_CSS);
      root.adoptedStyleSheets = [sheet];
    } catch {
      const style = document.createElement('style');
      style.textContent = PANEL_CSS;
      root.prepend(style);
    }
    newGame();
    (document.body || document.documentElement).appendChild(host);
    panel.focus();
  }

  init();
})();
