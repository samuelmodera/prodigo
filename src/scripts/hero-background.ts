/**
 * Hero halftone alive — la imagen renaissance se ve crisp, y un sistema de
 * partículas dot anima sólo las zonas donde el grabado ya tiene halftone.
 * El cursor genera bursts locales que se dispersan.
 */

import heroSrc from '../assets/hero-renaissance.png';

const MAX_PARTICLES = 420;
const SPAWN_PER_FRAME = 10;
const MOUSE_RADIUS = 130;
const MOUSE_BURST = 6;

const readVar = (name: string, fallback: string) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
};

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  life: number;        // frames vividos
  maxLife: number;
  size: number;
  alive: boolean;
};

const init = async () => {
  const canvas = document.querySelector<HTMLCanvasElement>('.hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const img = new Image();
  img.decoding = 'async';
  img.src = heroSrc.src;
  try { await img.decode(); }
  catch { canvas.classList.add('hero-canvas--fallback'); return; }

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0;

  // Mapa de spawn weight: por celda grande (8px), cuánto peso tiene
  // como zona halftone (luminancia en banda media-alta del grabado).
  const CELL = 8;
  let cols = 0, rows = 0;
  let weights = new Float32Array(0);
  let cumulative = new Float32Array(0); // CDF para sampling rápido
  let totalWeight = 0;

  let dotColor = readVar('--olive-deep', '#415141');
  // Pre-render del sprite del dot (1 talla, escalamos con drawImage)
  let dotSprite = document.createElement('canvas');
  const buildSprite = (color: string) => {
    const SIZE = 8;
    dotSprite.width = SIZE * dpr;
    dotSprite.height = SIZE * dpr;
    const g = dotSprite.getContext('2d')!;
    g.scale(dpr, dpr);
    g.fillStyle = color;
    g.beginPath();
    g.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
    g.fill();
  };

  const sample = document.createElement('canvas');
  const sctx = sample.getContext('2d', { willReadFrequently: true })!;

  const measure = () => {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, Math.floor(rect.width));
    H = Math.max(1, Math.floor(rect.height));

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cols = Math.floor(W / CELL);
    rows = Math.floor(H / CELL);

    sample.width = cols;
    sample.height = rows;

    // cover behavior
    const ir = img.width / img.height;
    const cr = cols / rows;
    let sx = 0, sy = 0, sw = img.width, sh = img.height;
    if (ir > cr) {
      sw = img.height * cr;
      sx = (img.width - sw) / 2;
    } else {
      sh = img.width / cr;
      sy = (img.height - sh) / 2;
    }
    sctx.clearRect(0, 0, cols, rows);
    sctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
    const data = sctx.getImageData(0, 0, cols, rows).data;

    const n = cols * rows;
    weights = new Float32Array(n);
    cumulative = new Float32Array(n);
    totalWeight = 0;

    for (let i = 0; i < n; i++) {
      const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
      const L = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

      // Banda halftone: ni fondo blanco puro, ni líneas oscuras del grabado.
      // Sweet spot: L ∈ [0.62, 0.93] → tonos medios + suaves del degradado punteado.
      let w = 0;
      if (L >= 0.62 && L <= 0.93) {
        // peso en forma de campana centrada en 0.82
        const t = (L - 0.62) / 0.31;            // 0..1
        w = Math.sin(t * Math.PI);              // curva campana
        w *= 0.7 + 0.3 * (1 - Math.abs(L - 0.82) / 0.15); // refuerza centro
      }
      weights[i] = w;
      totalWeight += w;
      cumulative[i] = totalWeight;
    }

    dotColor = document.documentElement.dataset.theme === 'dark'
      ? readVar('--olive-l', '#9BC79E')
      : readVar('--olive-deep', '#415141');
    buildSprite(dotColor);
  };

  // Sampling proporcional al peso via binary search en CDF
  const pickWeightedCell = (): number => {
    if (totalWeight <= 0) return -1;
    const r = Math.random() * totalWeight;
    let lo = 0, hi = cumulative.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cumulative[mid] < r) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  // Pool de partículas
  const particles: Particle[] = [];
  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, size: 0, alive: false });
  }

  const spawnAtCell = (idx: number, fromMouse = false) => {
    if (idx < 0) return;
    const p = particles.find(p => !p.alive);
    if (!p) return;
    const cx = idx % cols;
    const cy = (idx / cols) | 0;
    p.x = (cx + Math.random()) * CELL;
    p.y = (cy + Math.random()) * CELL;
    if (fromMouse) {
      const ang = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.2;
      p.vx = Math.cos(ang) * speed;
      p.vy = Math.sin(ang) * speed;
      p.maxLife = 40 + (Math.random() * 30) | 0;
    } else {
      p.vx = (Math.random() - 0.5) * 0.15;
      p.vy = (Math.random() - 0.5) * 0.15 - 0.05;
      p.maxLife = 70 + (Math.random() * 90) | 0;
    }
    p.size = 1.2 + Math.random() * 1.6;
    p.life = 0;
    p.alive = true;
  };

  const mouse = { x: -9999, y: -9999, active: false };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;

  const draw = () => {
    ctx.clearRect(0, 0, W, H);

    // Spawn ambiental ponderado por la imagen
    if (!reduceMotion.matches) {
      for (let s = 0; s < SPAWN_PER_FRAME; s++) {
        spawnAtCell(pickWeightedCell());
      }

      // Mouse: burst local
      if (mouse.active) {
        for (let b = 0; b < MOUSE_BURST; b++) {
          // celda aleatoria dentro del radio del mouse
          const ang = Math.random() * Math.PI * 2;
          const r = Math.random() * MOUSE_RADIUS;
          const mx = mouse.x + Math.cos(ang) * r;
          const my = mouse.y + Math.sin(ang) * r;
          const cx = (mx / CELL) | 0;
          const cy = (my / CELL) | 0;
          if (cx < 0 || cx >= cols || cy < 0 || cy >= rows) continue;
          spawnAtCell(cy * cols + cx, true);
        }
      }
    }

    // Update + render
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!p.alive) continue;
      p.life++;
      if (p.life >= p.maxLife) { p.alive = false; continue; }

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.004; // gravedad muy suave

      // alpha: fade in primer 20%, fade out último 50%
      const t = p.life / p.maxLife;
      let alpha: number;
      if (t < 0.2) alpha = t / 0.2;
      else if (t > 0.5) alpha = 1 - (t - 0.5) / 0.5;
      else alpha = 1;
      alpha *= 0.85;

      ctx.globalAlpha = alpha;
      const s = p.size;
      ctx.drawImage(dotSprite, p.x - s / 2, p.y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;

    raf = requestAnimationFrame(draw);
  };

  const hero = canvas.closest('.hero') as HTMLElement | null;
  hero?.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  }, { passive: true });
  hero?.addEventListener('pointerleave', () => { mouse.active = false; }, { passive: true });

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(measure, 150);
  });

  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !raf) raf = requestAnimationFrame(draw);
    else if (!entry.isIntersecting && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
  io.observe(canvas);

  measure();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
