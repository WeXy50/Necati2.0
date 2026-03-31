/**
 * ═══════════════════════════════════════════════
 *  UNPROVABLE REALITY — Utilities
 * ═══════════════════════════════════════════════
 */

const UR = window.UR || {};
window.UR = UR;

/* ─── Global State ─── */
UR.state = {
  mouse: { x: 0, y: 0, sx: 0, sy: 0 },
  scroll: 0,
  section: 0,
  loaded: false,
  sound: false,
  isMobile: window.innerWidth < 768,
  width: window.innerWidth,
  height: window.innerHeight
};

/* ─── Math Helpers ─── */
UR.lerp = (a, b, t) => a + (b - a) * t;
UR.clamp = (val, min, max) => Math.min(Math.max(val, min), max);
UR.map = (val, inMin, inMax, outMin, outMax) =>
  outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);

/* ─── Debounce ─── */
UR.debounce = (fn, ms) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

/* ─── Grain Generator ─── */
UR.generateGrain = () => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(256, 256);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const v = Math.random() * 255;
    imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = v;
    imgData.data[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
  const el = document.getElementById('grain');
  if (el) {
    el.style.backgroundImage = `url(${canvas.toDataURL()})`;
    el.style.backgroundSize = '256px 256px';
  }
};

/* ─── Ticker Builder ─── */
UR.buildTicker = () => {
  const formulas = [
    '∀ε>0, ∃δ>0 : |x−a|<δ ⟹ |f(x)−L|<ε',
    'G(F) ↔ ¬Prov(⌜G(F)⌝)',
    'dx/dt = σ(y−x)',
    'dy/dt = x(ρ−z)−y',
    'dz/dt = xy−βz',
    '∄ complete consistent system containing arithmetic',
    'W₄ = {(x,y,z,w) ∈ ℝ⁴}',
    'TESSERACT ≡ 4-CUBE',
    'REALITY ⊬ REALITY',
    'ω-CONSISTENCY',
    'ENTROPY → ∞',
    '∃x: ¬PROVABLE(x) ∧ TRUE(x)'
  ].join('   ◆   ') + '   ◆   ';

  const track = document.getElementById('tickerTrack');
  if (track) track.textContent = formulas + formulas;
};

/* ─── Fragment Builder ─── */
UR.buildFragments = () => {
  const fragments = [
    { t: 'TRUTH', x: 10, y: 16 },
    { t: 'UNDECIDABLE', x: 72, y: 10 },
    { t: '∀x∃y', x: 20, y: 72 },
    { t: 'AXIOM', x: 80, y: 58 },
    { t: '¬PROVABLE', x: 6, y: 48 },
    { t: 'CONSISTENT', x: 60, y: 38 },
    { t: 'THEOREM', x: 36, y: 84 },
    { t: '∞', x: 90, y: 24 },
    { t: 'SELF-REFERENCE', x: 15, y: 30 },
    { t: 'INCOMPLETE', x: 55, y: 80 },
    { t: '⊬', x: 84, y: 45 },
    { t: 'PARADOX', x: 42, y: 12 },
    { t: 'G(F)', x: 92, y: 78 },
    { t: 'FORMAL', x: 4, y: 86 },
    { t: 'SYSTEM', x: 68, y: 88 },
    { t: 'DECIDABILITY', x: 28, y: 55 },
    { t: 'RECURSION', x: 76, y: 72 }
  ];

  const container = document.getElementById('godelFrags');
  if (!container) return;

  fragments.forEach(frag => {
    const el = document.createElement('div');
    el.className = 'frag';
    el.textContent = frag.t;
    el.style.left = frag.x + '%';
    el.style.top = frag.y + '%';
    el.setAttribute('data-hover', '');
    container.appendChild(el);
  });
};

/* ─── Resize Handler ─── */
UR.handleResize = () => {
  UR.state.width = window.innerWidth;
  UR.state.height = window.innerHeight;
  UR.state.isMobile = window.innerWidth < 768;
};

window.addEventListener('resize', UR.debounce(UR.handleResize, 150));