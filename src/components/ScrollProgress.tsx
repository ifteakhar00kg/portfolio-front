import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const update = () => {
      const h =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const p = h > 0 ? (window.scrollY / h) * 100 : 0;
      setPct(p);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[9998] h-px bg-transparent"
    >
      <div
        className="h-full bg-[var(--accent)] transition-[width] duration-75"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
