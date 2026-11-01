'use client';

import { useEffect, useRef } from 'react';

/* Particle vortex — hundreds of cyan motes spiraling slowly into a center.
   Inner orbits move faster (differential rotation, like a real vortex).
   Pure canvas, no deps, pauses when the tab is hidden. */

export function SwirlCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, CX = 0, CY = 0, MAXR = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      CX = W * 0.5;
      CY = H * 0.46;
      MAXR = Math.hypot(W, H) * 0.42;
      ctx.fillStyle = 'rgba(5,7,11,1)';
      ctx.fillRect(0, 0, W, H);
    };
    resize();
    window.addEventListener('resize', resize);

    const N = 300;
    const P = Array.from({ length: N }, () => ({
      r: 90 + Math.random() * (MAXR - 90),
      a: Math.random() * Math.PI * 2,
      s: 0.5 + Math.random() * 0.9,
      o: 0.25 + Math.random() * 0.55,
    }));

    const tick = () => {
      // trail fade — translucent fill leaves short motion trails
      ctx.fillStyle = 'rgba(5,7,11,.16)';
      ctx.fillRect(0, 0, W, H);
      // ambient core glow — additive, balanced against the trail fade
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, H * 0.55);
      g.addColorStop(0, 'rgba(0,140,200,.05)');
      g.addColorStop(0.55, 'rgba(40,60,160,.02)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      for (const p of P) {
        p.a += (14 / p.r) * 0.04;
        p.r -= 0.018 * p.s;
        if (p.r < 70) {
          p.r = MAXR * (0.9 + Math.random() * 0.1);
          p.a = Math.random() * Math.PI * 2;
        }
        const x = CX + p.r * Math.cos(p.a);
        const y = CY + p.r * Math.sin(p.a) * 0.86;
        const fade =
          Math.min(1, (MAXR - p.r) / 140) * Math.min(1, (p.r - 60) / 120);
        ctx.beginPath();
        ctx.arc(x, y, p.s, 0, 7);
        ctx.fillStyle = `rgba(0,212,255,${(p.o * fade).toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    start();

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
