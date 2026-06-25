import { useEffect, useRef } from "react";

/**
 * Fullscreen fixed particle canvas behind the site.
 * - Slow drifting dots
 * - Scroll velocity nudges them in scroll direction
 * - Mouse parallax shift (very subtle, opposite direction for depth)
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const scrollBoostRef = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;

    const COUNT = window.matchMedia("(pointer: coarse)").matches ? 32 : 60;
    type P = { x: number; y: number; vx: number; vy: number; r: number };
    const parts: P[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const seed = () => {
      parts.length = 0;
      for (let i = 0; i < COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = rand(0.15, 0.4);
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: rand(1, 2),
        });
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      lastScrollY.current = y;
      // boost in scroll direction; decays
      scrollBoostRef.current = Math.max(
        -3,
        Math.min(3, scrollBoostRef.current + delta * 0.02),
      );
    };

    const onMouse = (e: MouseEvent) => {
      const nx = (e.clientX / w - 0.5) * 2;
      const ny = (e.clientY / h - 0.5) * 2;
      // opposite direction for depth
      targetOffsetRef.current.x = -nx * 12;
      targetOffsetRef.current.y = -ny * 12;
    };

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      // lerp offsets
      offsetRef.current.x += (targetOffsetRef.current.x - offsetRef.current.x) * 0.08;
      offsetRef.current.y += (targetOffsetRef.current.y - offsetRef.current.y) * 0.08;
      scrollBoostRef.current *= 0.9;

      const boost = scrollBoostRef.current;
      ctx.fillStyle = "rgba(232,227,213,0.12)";
      for (const p of parts) {
        p.x += p.vx + (boost > 0 ? 0 : 0);
        p.y += p.vy * (1 + Math.abs(boost) * 0.5) + boost * 0.6;
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
        if (p.y < -4) p.y = h + 4;
        if (p.y > h + 4) p.y = -4;

        ctx.beginPath();
        ctx.arc(p.x + offsetRef.current.x, p.y + offsetRef.current.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    if (!reduce) raf = requestAnimationFrame(tick);

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (!window.matchMedia("(pointer: coarse)").matches) {
      window.addEventListener("mousemove", onMouse);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
    />
  );
}
