import { useEffect, useState } from "react";

const SECTIONS: Array<{ id: string; label: string }> = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "integrations", label: "API" },
  { id: "experience", label: "About" },
  { id: "contact", label: "Contact" },
];

export function ScrollProgressRing() {
  const [pct, setPct] = useState(0);
  const [section, setSection] = useState("Home");

  useEffect(() => {
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      setPct(p);

      const mid = window.scrollY + window.innerHeight / 2;
      let current = SECTIONS[0].label;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.offsetTop;
        if (mid >= top) current = s.label;
      }
      setSection(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const visible = pct > 0.05 && pct < 0.98;
  const C = 2 * Math.PI * 20; // r=20
  const offset = C * (1 - pct);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-5 right-5 z-[60] transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="relative h-12 w-12">
        <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(232,227,213,0.08)" strokeWidth="1.5" />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="rgba(232,227,213,0.5)"
            strokeWidth="1.5"
            strokeDasharray={C}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 120ms linear" }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center font-mono uppercase tracking-[0.1em] text-[var(--fg)]"
          style={{ fontSize: "9px" }}
        >
          {section}
        </span>
      </div>
    </div>
  );
}
