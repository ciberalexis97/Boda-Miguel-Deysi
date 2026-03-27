/* ============================================
   HEART-PARTICLES.JS  —  Pure Canvas 2D
   Uses ResizeObserver: fires when element has
   REAL painted dimensions. Zero timing issues.
   ============================================ */
'use strict';

(function () {

  const canvas = document.getElementById('heart-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* ─── Heart equation (parametric) ─────────────── */
  // Raw ranges: x ∈ [-16, 16], y (flipped) ∈ [-5, 17]
  function heartPt(t) {
    const x =  16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t)
               - 5 * Math.cos(2 * t)
               - 2 * Math.cos(3 * t)
               -     Math.cos(4 * t));
    return { x, y };
  }

  /* ─── Palette ──────────────────────────────────── */
  const PAL = [
    [201, 168,  76],   // dorado
    [232, 201, 106],   // dorado claro
    [245, 230, 184],   // dorado pálido
    [255, 255, 255],   // blanco
    [163,  37,  61],   // vino claro
    [255, 220, 130],   // cálido
  ];

  /* ─── Particles ─────────────────────────────────── */
  const N  = 950;
  let   pts = [];
  let   W = 0, H = 0;

  function rebuild() {
    if (W === 0 || H === 0) return;

    // Heart width in parametric units = 32 (x: -16 to 16)
    // Scale so heart = 46% of shorter canvas dimension
    const scale = (Math.min(W, H) * 0.46) / 32;

    // Visual center of parametric heart:
    // y ranges from -5 (bottom tip) to ~17 (top humps)
    // midpoint in raw units ≈ (17 + (-5)) / 2 = 6
    // So the "mass centre" of the heart sits at raw y ≈ 5
    // We shift cy upward by that offset to visually center the heart
    const cx = W / 2;
    const cy = H / 2 - 5 * scale + 60;  // compensate for asymmetric y range

    pts = [];
    for (let i = 0; i < N; i++) {
      const t  = (i / N) * Math.PI * 2;
      const hp = heartPt(t);
      const jitter = scale * 0.22;
      const col = PAL[Math.floor(Math.random() * PAL.length)];

      // Scatter: random direction, outside canvas
      const ang  = Math.random() * Math.PI * 2;
      const dist = Math.max(W, H) * (0.52 + Math.random() * 0.42);

      pts.push({
        tx: cx + hp.x * scale + (Math.random() - 0.5) * jitter,
        ty: cy + hp.y * scale + (Math.random() - 0.5) * jitter,
        sx: cx + Math.cos(ang) * dist,
        sy: cy + Math.sin(ang) * dist,
        x: 0, y: 0,
        r: col[0], g: col[1], b: col[2],
        sz:    Math.random() * 2.4 + 0.4,
        phase: Math.random() * Math.PI * 2,
        spd:   Math.random() * 0.5 + 0.22,
        wob:   Math.random() * scale * 0.055 + scale * 0.018,
      });
    }
  }

  /* ─── Easing ─────────────────────────────────────── */
  const eOut   = t => 1 - Math.pow(1 - t, 3);
  const eIn    = t => t * t * t;
  const eInOut = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;

  /* ─── State machine ──────────────────────────────── */
  const SEQ  = ['FORMING','HELD','EXPLODING','SCATTERED','REFORMING'];
  const DUR  = { FORMING:2800, HELD:2300, EXPLODING:1500, SCATTERED:1200, REFORMING:2700 };
  let si = 0, t0 = -1;

  /* ─── Render loop ────────────────────────────────── */
  let running = false;

  function frame(now) {
    requestAnimationFrame(frame);
    if (W === 0 || H === 0 || pts.length === 0) return;

    if (t0 < 0) t0 = now;

    const state = SEQ[si];
    let   prog  = Math.min((now - t0) / DUR[state], 1);
    if (prog >= 1) { si = (si + 1) % SEQ.length; t0 = now; prog = 0; }

    ctx.clearRect(0, 0, W, H);

    const sec = now * 0.001;

    /* Ambient glow when heart is formed */
    if (state !== 'SCATTERED') {
      const pulse = 0.38 + 0.14 * Math.sin(sec * 2.5);
      const gR    = Math.min(W, H) * 0.28;
      const cx    = W / 2, cy = H / 2 - 5 * (Math.min(W,H)*0.46/32);
      const g     = ctx.createRadialGradient(cx, cy, 0, cx, cy, gR);
      g.addColorStop(0,    `rgba(201,168,76,${(pulse*0.18).toFixed(3)})`);
      g.addColorStop(0.45, `rgba(123,28,46,${(pulse*0.09).toFixed(3)})`);
      g.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(cx, cy, gR, 0, Math.PI*2);
      ctx.fillStyle = g; ctx.fill();
    }

    /* Particles */
    for (let i = 0; i < pts.length; i++) {
      const p  = pts[i];
      const wb = Math.sin(sec * p.spd + p.phase) * p.wob;
      let px, py, alpha;

      if (state === 'FORMING') {
        const t = eOut(prog);
        px = p.sx + (p.tx - p.sx)*t + wb*(1-t);
        py = p.sy + (p.ty - p.sy)*t + wb*(1-t);
        alpha = t;
      } else if (state === 'HELD') {
        px = p.tx + Math.sin(sec*p.spd      + p.phase)*p.wob*0.6;
        py = p.ty + Math.cos(sec*p.spd*1.3  + p.phase)*p.wob*0.6;
        alpha = 0.65 + 0.35*Math.sin(sec*2.2 + p.phase);
      } else if (state === 'EXPLODING') {
        const t = eIn(prog);
        px = p.tx + (p.sx - p.tx)*t + wb*(1-t);
        py = p.ty + (p.sy - p.ty)*t + wb*(1-t);
        alpha = 1 - t*0.8;
      } else if (state === 'SCATTERED') {
        px = p.sx + wb*1.5;
        py = p.sy + Math.cos(sec*p.spd + p.phase)*p.wob*1.5;
        alpha = 0.2 + 0.14*Math.sin(sec*3 + p.phase);
      } else { // REFORMING
        const t = eInOut(prog);
        px = p.sx + (p.tx - p.sx)*t + wb*(1-t)*0.5;
        py = p.sy + (p.ty - p.sy)*t + wb*(1-t)*0.5;
        alpha = 0.2 + t*0.8;
      }

      p.x = px; p.y = py;
      const a = Math.max(0, Math.min(1, alpha));
      if (a < 0.015) continue;

      // Glow halo
      const gr = p.sz * 4.5;
      const gd = ctx.createRadialGradient(px,py,0, px,py,gr);
      gd.addColorStop(0,   `rgba(${p.r},${p.g},${p.b},${(a*0.85).toFixed(3)})`);
      gd.addColorStop(0.35,`rgba(${p.r},${p.g},${p.b},${(a*0.35).toFixed(3)})`);
      gd.addColorStop(1,   `rgba(${p.r},${p.g},${p.b},0)`);
      ctx.beginPath(); ctx.arc(px,py,gr,0,Math.PI*2);
      ctx.fillStyle = gd; ctx.fill();

      // Hard dot
      ctx.beginPath(); ctx.arc(px,py,p.sz,0,Math.PI*2);
      ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${Math.min(a*1.3,1).toFixed(3)})`;
      ctx.fill();
    }
  }

  /* ─── ResizeObserver — fires when element has real px ── */
  const ro = new ResizeObserver(entries => {
    for (const e of entries) {
      const rect = e.contentRect;
      if (rect.width > 10 && rect.height > 10) {
        W = Math.floor(rect.width);
        H = Math.floor(rect.height);
        canvas.width  = W;
        canvas.height = H;
        rebuild();
      }
    }
  });
  ro.observe(canvas);

  /* ─── Start render loop immediately ─────────────────── */
  requestAnimationFrame(frame);

})();
