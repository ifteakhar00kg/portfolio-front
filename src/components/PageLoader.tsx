import { useEffect, useState } from "react";

export function PageLoader() {
  const [count, setCount] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setCount(100);
      setReveal(true);
      const t = setTimeout(() => setHidden(true), 200);
      return () => clearTimeout(t);
    }

    let n = 0;
    const id = setInterval(() => {
      n += Math.max(1, Math.round((100 - n) * 0.07));
      if (n >= 100) {
        n = 100;
        setCount(100);
        clearInterval(id);
        setTimeout(() => setReveal(true), 250);
        setTimeout(() => setHidden(true), 1500);
      } else {
        setCount(n);
      }
    }, 30);
    return () => clearInterval(id);
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[10000]"
    >
      {/* Top half */}
      <div
        className={`absolute inset-x-0 top-0 h-1/2 bg-[#080808] transition-transform duration-[900ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
          reveal ? "-translate-y-full" : "translate-y-0"
        }`}
      />
      {/* Bottom half */}
      <div
        className={`absolute inset-x-0 bottom-0 h-1/2 bg-[#080808] transition-transform duration-[900ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
          reveal ? "translate-y-full" : "translate-y-0"
        }`}
      />
      {/* Counter */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-transparent transition-opacity duration-300 ${
          reveal ? "opacity-0" : "opacity-100"
        }`}
      >
        <span
          className="font-mono tabular-nums leading-none text-[var(--fg)]"
          style={{ fontSize: "clamp(64px, 16vw, 120px)" }}
        >
          {count}
          <span className="text-[var(--accent)]">%</span>
        </span>
      </div>
    </div>
  );
}
