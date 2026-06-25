import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: mouse.x, y: mouse.y };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x - 4}px, ${mouse.y - 4}px, 0)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest("a, button, [data-cursor='hover'], input, textarea, select"))
        setHovering(true);
      else setHovering(false);
    };

    const tick = () => {
      ring.x += (mouse.x - ring.x) * 0.12;
      ring.y += (mouse.y - ring.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x - 16}px, ${ring.y - 16}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [visible]);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-[var(--fg)] mix-blend-difference"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[9999] h-8 w-8 rounded-full border border-[var(--fg)] mix-blend-difference transition-[width,height,opacity,border-color] duration-200"
        style={{
          opacity: visible ? 1 : 0,
          transform: `translate3d(-100px,-100px,0) scale(${hovering ? 1.6 : 1})`,
        }}
      />
    </>
  );
}
