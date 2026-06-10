import { useEffect, useRef } from 'react';

/**
 * PERFORMANCE OPTIMIZATIONS vs. original:
 * 1. Removed querySelectorAll('*') loop — was setting cursor:none on every DOM node
 *    (hundreds of inline style writes). cursor:none now lives in index.css on body.
 * 2. Hard particle cap (MAX_PARTICLES = 55) prevents unbounded memory growth.
 * 3. Skip rendering particles with life < 0.06 — avoids drawing invisible shapes.
 * 4. Removed the hover pulse ring re-draw on every frame (Date.now() based).
 * 5. Passive event listeners so scroll performance is unaffected.
 */

interface Particle {
  x:       number;
  y:       number;
  vx:      number;
  vy:      number;
  life:    number; // 1 → 0
  size:    number;
  hue:     number;
}

const MAX_PARTICLES = 55;

export default function MagicalCursor() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const stateRef    = useRef({ x: -200, y: -200, tx: -200, ty: -200, hue: 240, hovering: false });
  const particleRef = useRef<Particle[]>([]);
  const frameRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip entirely on touch/stylus devices — no custom cursor needed
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const s = stateRef.current;

    // Track pointer
    const onMove = (e: MouseEvent) => { s.tx = e.clientX; s.ty = e.clientY; };

    // Detect interactive elements for hover state
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      s.hovering = !!(
        t.tagName === 'A'      || t.tagName === 'BUTTON' ||
        t.closest('a')        || t.closest('button')    ||
        t.classList.contains('cursor-pointer') ||
        t.classList.contains('card-base')
      );
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Smooth cursor follow
      s.x += (s.tx - s.x) * 0.15;
      s.y += (s.ty - s.y) * 0.15;

      // Slowly cycle hue for iridescent trail
      s.hue = (s.hue + 0.28) % 360;

      // Emit particles when moving fast enough and cap is not reached
      const speed = Math.hypot(s.tx - s.x, s.ty - s.y);
      if (speed > 0.4 && particleRef.current.length < MAX_PARTICLES) {
        const count = s.hovering ? 2 : 1;
        for (let i = 0; i < count; i++) {
          particleRef.current.push({
            x:    s.x + (Math.random() - 0.5) * 5,
            y:    s.y + (Math.random() - 0.5) * 5,
            vx:   (Math.random() - 0.5) * 1.4,
            vy:   (Math.random() - 0.5) * 1.4,
            life: 1,
            size: 1.2 + Math.random() * 2.4,
            hue:  s.hue + (Math.random() - 0.5) * 40,
          });
        }
      }

      // Clear
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Particles
      const ps = particleRef.current;
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.life -= 0.026;
        if (p.life <= 0) { ps.splice(i, 1); continue; }

        // Skip nearly-invisible particles to save draw calls
        if (p.life < 0.06) continue;

        p.x  += p.vx; p.y  += p.vy;
        p.vx *= 0.97;  p.vy *= 0.97;

        const alpha = p.life * (s.hovering ? 0.6 : 0.42);
        const r     = p.size * p.life;

        // Soft glow halo
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3.5);
        g.addColorStop(0, `hsla(${p.hue},80%,72%,${alpha * 0.55})`);
        g.addColorStop(1, `hsla(${p.hue},80%,72%,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},100%,88%,${alpha})`;
        ctx.fill();
      }

      // Main cursor glow
      const glowR = s.hovering ? 26 : 17;
      const glowA = s.hovering ? 0.32 : 0.22;
      const cg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
      cg.addColorStop(0, `hsla(${s.hue},80%,70%,${glowA})`);
      cg.addColorStop(1, `hsla(${s.hue},80%,70%,0)`);
      ctx.beginPath();
      ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = cg;
      ctx.fill();

      // Outer ring
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.hovering ? 8 : 5, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${s.hue},100%,88%,0.82)`;
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      // Centre dot
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    };

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 9999, pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    />
  );
}
