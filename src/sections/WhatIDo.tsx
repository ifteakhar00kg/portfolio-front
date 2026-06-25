import { useEffect, useRef, useState } from "react";
import { Server, Code2, Plug, Sparkles, ArrowUpRight } from "lucide-react";
import { ServiceModal, type ServiceKey } from "../components/ServiceModal";

type Card = {
  key: ServiceKey;
  span: string;
  eyebrow: string;
  title: string;
  body: string;
  tech?: string[];
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  tag?: string;
  extra?: "ai-bubble";
};

const CARDS: Card[] = [
  {
    key: "backend",
    span: "md:col-span-7",
    eyebrow: "01 — Engine",
    title: "Backend Engineering",
    body: "Java Spring Boot APIs that scale. REST, JWT auth, microservices, PostgreSQL, Redis. I build the engine.",
    tech: ["Spring Boot", "Java", "PostgreSQL", "Redis", "Docker"],
    Icon: Server,
  },
  {
    key: "frontend",
    span: "md:col-span-5",
    eyebrow: "02 — Surface",
    title: "Frontend Development",
    body: "React + TypeScript interfaces. What you're looking at right now.",
    tech: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    Icon: Code2,
  },
  {
    key: "api",
    span: "md:col-span-5",
    eyebrow: "03 — Bridge",
    title: "API Integration",
    body: "I connect any API to your product — payment, AI, maps, social, custom. In your preferred language.",
    tech: ["Stripe", "Maps", "OAuth", "Webhooks"],
    Icon: Plug,
    tag: "Speak your language",
  },
  {
    key: "ai",
    span: "md:col-span-7",
    eyebrow: "04 — Intelligence",
    title: "AI Integration",
    body: "Embed AI into your existing product. OpenAI, Claude, Gemini, or custom models — I wire it into your backend.",
    tech: ["OpenAI", "Claude", "Gemini", "RAG"],
    Icon: Sparkles,
    extra: "ai-bubble",
  },
];


function Counter({ to, suffix = "", trigger }: { to: number; suffix?: string; trigger: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, trigger]);
  return (
        <span className="font-display leading-none tabular-nums" style={{ fontSize: "clamp(42px, 9vw, 72px)" }}>
      {n}
      {suffix}
    </span>
  );
}

const STATS = [
  { value: 6, suffix: "+", label: "Categories" },
  { value: 40, suffix: "+", label: "Technologies" },
  { value: 1, suffix: "+", label: "Years" },
  { value: 20, suffix: "+", label: "Projects" },
];

export function WhatIDo() {
  const rootRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsIn, setStatsIn] = useState(false);
  const [openService, setOpenService] = useState<ServiceKey | null>(null);


  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      if (!rootRef.current) return;

      const ctx = gsap.context(() => {
        gsap.from("[data-wid-head] > *", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-wid-head]", start: "top 80%" },
        });

        gsap.utils.toArray<HTMLElement>("[data-wid-card]").forEach((card, i) => {
          gsap.from(card, {
            clipPath: "inset(100% 0 0 0)",
            y: 40,
            opacity: 0,
            duration: 1,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          });
        });

        if (statsRef.current) {
          ScrollTrigger.create({
            trigger: statsRef.current,
            start: "top 85%",
            onEnter: () => setStatsIn(true),
          });
        }

        // Services rings — spring in
        gsap.to("[data-svc-rings]", {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: "elastic.out(1, 0.6)",
          scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
        });
      }, rootRef);

      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, []);

  return (
    <section
      ref={rootRef}
      data-skew-target
      className="relative mx-auto max-w-[1280px] px-5 py-20 sm:px-6 md:px-12 md:py-[140px]"
    >
      {/* Decor — floating rotating rings */}
      <div
        aria-hidden
        data-svc-rings
        className="pointer-events-none absolute right-6 top-10 hidden md:block"
        style={{ opacity: 0, transform: "scale(0)" }}
      >
        <div className="svc-rings">
          <div className="svc-ring svc-ring-1" />
          <div className="svc-ring svc-ring-2" />
          <div className="svc-ring svc-ring-3" />
        </div>
      </div>

      {/* Header */}
      <div data-wid-head className="relative">
        <span
          aria-hidden
          data-bg-num
          className="pointer-events-none absolute -top-10 left-[-10px] select-none font-mono leading-none md:-top-16 md:left-[-12px]"
          style={{ color: "rgba(232,227,213,0.04)" }}
        >
          01
        </span>

        <p className="relative font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
          What I Do
        </p>
        <h2 className="relative mt-6 max-w-[700px] font-display leading-[1.05]" style={{ fontSize: "clamp(36px, 6vw, 56px)" }}>
          I build complete digital systems —{" "}
          <span className="italic text-[var(--accent)]">from database to interface.</span>
        </h2>
        <div className="relative mt-16 h-px w-full bg-[var(--divider)]" />
      </div>

      {/* Bento */}
      <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-12 md:gap-5">
        {CARDS.map((c) => (
          <article
            key={c.title}
            data-wid-card
            role="button"
            tabIndex={0}
            onClick={() => setOpenService(c.key)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpenService(c.key);
              }
            }}
            className={`group relative col-span-1 ${c.span} flex min-h-[240px] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-[var(--divider)] bg-[var(--surface)] p-5 transition-colors duration-500 hover:bg-[rgba(232,227,213,0.07)] md:min-h-[260px] md:p-8`}
          >

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--divider)] text-[var(--accent)]">
                  <c.Icon size={18} strokeWidth={1.5} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
                  {c.eyebrow}
                </span>
              </div>
              {c.tag && (
                <span className="rounded-full border border-[var(--divider)] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent)]">
                  {c.tag}
                </span>
              )}
            </div>

            <div className="mt-10">
              <h3 className="font-display leading-tight" style={{ fontSize: "clamp(28px, 5vw, 34px)" }}>
                {c.title}
              </h3>
              <p className="mt-4 max-w-[440px] leading-relaxed text-[var(--muted)]" style={{ fontSize: "clamp(15px, 2vw, 18px)" }}>
                {c.body}
              </p>
            </div>

            {c.extra === "ai-bubble" && (
              <div
                aria-hidden
                className="pointer-events-none absolute right-6 top-6 max-w-[200px] translate-y-2 rounded-2xl rounded-tr-sm border border-[var(--divider)] bg-[var(--bg)]/80 px-4 py-3 font-mono text-[10px] leading-relaxed text-[var(--muted)] opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
              >
                <span className="text-[var(--accent)]">AI ›</span> Drafting response for user query…
              </div>
            )}

            {c.tech && (
              <div className="mt-8 flex flex-wrap gap-2">
                {c.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--divider)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--muted)] transition-colors group-hover:text-[var(--fg)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <ArrowUpRight
              size={18}
              strokeWidth={1.25}
              className="absolute right-7 bottom-7 text-[var(--muted)] opacity-0 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-[var(--accent)]"
            />
          </article>
        ))}

        {/* Stats bar */}
        <div
          ref={statsRef}
          data-wid-card
          className="col-span-1 md:col-span-12 rounded-2xl border border-[var(--divider)] bg-[var(--surface)] p-5 md:px-10 md:py-12"
        >
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col">
                <Counter to={s.value} suffix={s.suffix} trigger={statsIn} />
                <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ServiceModal service={openService} onClose={() => setOpenService(null)} />
    </section>
  );
}

