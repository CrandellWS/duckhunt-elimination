import Game from './src/modules/Game';

/**
 * DuckHunt-JS — Elimination Mode fork
 *
 * Boot flow:
 *   1. Read ?mode=classic URL param. If present, skip Setup and boot original game.
 *   2. Otherwise, show Setup screen. Wait for user to paste names and click Start.
 *   3. Parse names → pass to Game constructor as { mode: 'elimination', names: [...] }.
 */

function parseNames(raw) {
  const seen = new Set();
  const names = [];
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    // dedupe case-insensitively but preserve original casing
    const key = trimmed.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    names.push(trimmed);
  });
  return names;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getModeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('mode');
}

function bootGame(opts) {
  const setupScreen = document.getElementById('setup-screen');
  if (setupScreen) setupScreen.style.display = 'none';

  if (opts.mode === 'elimination') {
    const panel = document.getElementById('elimination-panel');
    if (panel) panel.style.display = 'block';
  }

  return new Game({
    spritesheet: 'sprites.json',
    mode: opts.mode,
    names: opts.names,
    ducksPerWave: opts.ducksPerWave
  }).load();
}

function initSetupScreen() {
  const textarea = document.getElementById('names-input');
  const countEl = document.getElementById('name-count');
  const startBtn = document.getElementById('start-elimination-btn');
  const classicBtn = document.getElementById('play-classic-btn');
  const shuffleCb = document.getElementById('shuffle-checkbox');
  const ducksInput = document.getElementById('ducks-per-wave');

  function refresh() {
    const names = parseNames(textarea.value);
    const n = names.length;
    countEl.textContent = n === 1 ? '1 valid name' : `${n} valid names`;
    if (n < 3) {
      countEl.textContent += ' (need 3+)';
    }
    startBtn.disabled = n < 3;
  }

  textarea.addEventListener('input', refresh);
  refresh();

  startBtn.addEventListener('click', () => {
    let names = parseNames(textarea.value);
    if (names.length < 3) return;
    if (shuffleCb.checked) names = shuffle(names);
    const ducksPerWave = Math.max(1, Math.min(100, parseInt(ducksInput.value, 10) || 3));
    bootGame({ mode: 'elimination', names, ducksPerWave });
  });

  classicBtn.addEventListener('click', () => {
    bootGame({ mode: 'classic' });
  });

  // Victory screen buttons
  const restartSame = document.getElementById('restart-same-btn');
  const restartNew = document.getElementById('restart-new-btn');
  if (restartSame) {
    restartSame.addEventListener('click', () => {
      // Reload with the same name list still in localStorage
      window.location.href = window.location.pathname + '?replay=1';
    });
  }
  if (restartNew) {
    restartNew.addEventListener('click', () => {
      try { localStorage.removeItem('duckhunt-elimination-names'); } catch (e) { /* ignore */ }
      window.location.href = window.location.pathname;
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const mode = getModeFromUrl();

  // Classic mode skips setup entirely
  if (mode === 'classic') {
    bootGame({ mode: 'classic' });
    return;
  }

  // Replay-with-same-list: reuse last names from localStorage
  const replay = new URLSearchParams(window.location.search).get('replay');
  if (replay === '1') {
    try {
      const stored = localStorage.getItem('duckhunt-elimination-names');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.names) && parsed.names.length >= 3) {
          const names = parsed.shuffle ? shuffle(parsed.names) : parsed.names;
          bootGame({ mode: 'elimination', names, ducksPerWave: parsed.ducksPerWave || 3 });
          return;
        }
      }
    } catch (e) { /* fall through to setup */ }
  }

  initSetupScreen();

  // Stash the chosen names on Start so "Restart with same list" works after reload
  const startBtn = document.getElementById('start-elimination-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      try {
        const names = parseNames(document.getElementById('names-input').value);
        const shuffleChecked = document.getElementById('shuffle-checkbox').checked;
        const ducksPerWave = parseInt(document.getElementById('ducks-per-wave').value, 10) || 3;
        localStorage.setItem('duckhunt-elimination-names', JSON.stringify({
          names, shuffle: shuffleChecked, ducksPerWave
        }));
      } catch (e) { /* ignore */ }
    });
  }
}, false);
