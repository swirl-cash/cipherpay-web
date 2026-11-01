'use client';

import { useEffect, useRef } from 'react';

/* Pixel-vortex hero backdrop: particles spiral into the center and are
   consumed — a nod to the SWIRL swirl mark. Canvas 2D, square pixels,
   cyan with sparse warm accents, motion-blur trails. */
export function VortexCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.offsetWidth;
      h = parent.offsetHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.clearRect(0, 0, w, h);
    };

    interface P {
      r: number;      // radius from center
      a: number;      // angle
      speed: number;  // angular velocity
      fall: number;   // radial fall speed
      size: number;
      warm: boolean;
    }

    const N = 260;
    const parts: P[] = [];
    const spawn = (p: P, randomRadius = false) => {
      const maxR = Math.max(w, h) * 0.62;
      p.r = randomRadius ? maxR * (0.25 + Math.random() * 0.75) : maxR;
      p.a = Math.random() * Math.PI * 2;
      p.speed = (0.004 + Math.random() * 0.01) * (Math.random() < 0.5 ? 1 : 1); // one swirl direction
      p.fall = 0.35 + Math.random() * 1.1;
      p.size = Math.random() < 0.85 ? 2 : 3;
      p.warm = Math.random() < 0.12;
    };
    for (let i = 0; i < N; i++) {
      const p = {} as P;
      spawn(p, true);
      parts.push(p);
    }

    const tick = () => {
      // trail fade
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.085)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';

      const cx = w / 2;
      const cy = h / 2;

      for (const p of parts) {
        p.a += p.speed * (60 / Math.max(p.r, 40) + 0.4); // faster near core
        p.r -= p.fall * (0.35 + 90 / (p.r + 120));       // accelerates inward
        if (p.r < 14) {
          spawn(p);
          continue;
        }
        const x = cx + Math.cos(p.a) * p.r;
        const y = cy + Math.sin(p.a) * p.r * 0.62;       // elliptical, wide swirl
        const fade = Math.min(1, (Math.max(w, h) * 0.62 - p.r) / 90 + 0.25);
        ctx.fillStyle = p.warm
          ? `rgba(244,183,40,${0.55 * fade})`
          : `rgba(0,212,255,${0.5 * fade})`;
        ctx.fillRect(Math.round(x), Math.round(y), p.size, p.size);
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.55,
        WebkitMaskImage: 'radial-gradient(ellipse 62% 70% at 50% 50%, black 0%, rgba(0,0,0,0.5) 55%, transparent 82%)',
        maskImage: 'radial-gradient(ellipse 62% 70% at 50% 50%, black 0%, rgba(0,0,0,0.5) 55%, transparent 82%)',
      }}
    >
      <canvas ref={ref} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
