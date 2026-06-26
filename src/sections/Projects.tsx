import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { projects as fallbackProjects, type Project } from "../data/projects";
import { ENDPOINTS } from "../config/api";

const FILTERS = ["All", "Full Stack", "FRONTEND", "BACKEND"] as const;
type Filter = (typeof FILTERS)[number];

type ApiProject = {
  id: number;
  title: string;
  description?: string;
  techStack?: string;
  category?: string; 
  githubUrl?: string;
  liveUrl?: string;
  year?: string;
  imageUrl?: string;
};

type ExtendedProject = Project & {
  description?: string;
  githubUrl?: string;
  liveUrl?: string;
};

function mapApiProjects(apiList: ApiProject[]): ExtendedProject[] {
  return apiList.map((p, idx) => {
    const tech = (p.techStack || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    
    let finalCategory: Project["category"] = "Full Stack";
    if (p.category === "FRONTEND") {
      finalCategory = "FRONTEND";
    } else if (p.category === "BACKEND" || p.category === "AI Projects" || p.category === "API Integration") {
      finalCategory = "BACKEND";
    } else if (p.category === "Full Stack") {
      finalCategory = "Full Stack";
    }

    return {
      num: String(idx + 1).padStart(2, "0"),
      name: p.title,
      description: p.description, 
      tech,
      year: p.year || "2026",
      category: finalCategory,
      image: p.imageUrl && p.imageUrl.trim() !== "" ? p.imageUrl : `https://picsum.photos/seed/ift-${p.id}/600/440`,
      liveUrl: p.liveUrl || "#",
      githubUrl: p.githubUrl || "",
    };
  });
}

// === NEW FLIPPABLE CARD COMPONENT ===
function FlippableProjectCard({ p, setHovered }: { p: ExtendedProject; setHovered: (p: ExtendedProject | null) => void }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipBackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // component unmount হলে pending timer clear করার জন্য
  useEffect(() => {
    return () => {
      if (flipBackTimer.current) clearTimeout(flipBackTimer.current);
    };
  }, []);

  return (
    <div
      data-pj-card
      onMouseEnter={() => {
        // mouse আবার card-এ আনলে pending auto-flip-back timer cancel
        if (flipBackTimer.current) {
          clearTimeout(flipBackTimer.current);
          flipBackTimer.current = null;
        }
        setHovered(isFlipped ? null : p);
      }}
      onMouseLeave={() => {
        setHovered(null);
        // mouse সরিয়ে ফেললে ২ সেকেন্ড পর auto flip back to front
        if (flipBackTimer.current) clearTimeout(flipBackTimer.current);
        flipBackTimer.current = setTimeout(() => {
          setIsFlipped(false);
          flipBackTimer.current = null;
        }, 1000);
      }}
      className="group relative w-[380px] shrink-0 cursor-pointer"
      // পার্সপেক্টিভ 1000 থেকে 1200 করা হয়েছে আরও রিয়ালিস্টিক 3D ফিল পাওয়ার জন্য
      style={{ height: "60vh", minHeight: "440px", perspective: "1200px" }} 
    >
      <div
        onClick={() => {
          if (flipBackTimer.current) {
            clearTimeout(flipBackTimer.current);
            flipBackTimer.current = null;
          }
          const next = !isFlipped;
          setIsFlipped(next);
          // back face দেখানোর সময় cursor-preview image বন্ধ, front face-এ ফিরলে আবার দেখাবে
          setHovered(next ? null : p);
        }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          // অনেক স্মুথ এবং প্রফেশনাল ফ্লিপ ট্রানজিশন অ্যাড করা হয়েছে (0.85s cubic-bezier)
          transition: "transform 0.85s cubic-bezier(0.64, 0, 0.28, 1)",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* === FRONT FACE === */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--divider)] bg-[var(--surface)] p-7 transition-colors duration-500 hover:bg-[var(--surface-hover)]"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-40"
            style={{
              backgroundImage: `url(${p.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "grayscale(100%) contrast(1.1)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.55) 60%, rgba(8,8,8,0.2) 100%)",
            }}
          />
          <span
            className="pointer-events-none absolute z-10"
            style={{
              top: "16px",
              right: "20px",
              fontFamily: "var(--font-mono, 'DM Mono', monospace)",
              fontSize: "12px",
              color: "rgba(232,227,213,0.5)",
            }}
          >
            {p.year}
          </span>
          <div className="relative flex items-start justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
              {p.num}.
            </span>
          </div>
          <div className="relative">
            <h3 className="font-display text-[32px] leading-tight">{p.name}</h3>
            <div className="mt-4 flex flex-wrap gap-x-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--muted)]">
              {p.tech.map((t, idx) => (
                <span key={t}>
                  {t}
                  {idx < p.tech.length - 1 && <span className="mx-2 opacity-50"> </span>}
                </span>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.2em]">
              {p.liveUrl && p.liveUrl !== "#" && (
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-[var(--fg)] hover:text-[var(--accent)] transition-colors"
                >
                  Live Preview
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.5}
                    className="transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              )}
              {p.githubUrl && p.githubUrl !== "" && (
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
                >
                  <Github size={14} />
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>

        {/* === BACK FACE === */}
        <div
          className="flex flex-col items-center text-center overflow-hidden rounded-2xl border border-[var(--divider)] bg-[var(--surface)] transition-colors duration-500 hover:bg-[var(--surface-hover)]"
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            // থিমের ওপর বেস করে একটি চমৎকার হালকা রেডিয়াল গ্লো ইফেক্ট অ্যাড করা হয়েছে
            backgroundImage: "radial-gradient(circle at top right, rgba(232, 227, 213, 0.06), transparent 55%)",
            padding: "32px",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)" // ডেপথ দেওয়ার জন্য ইনার শ্যাডো
          }}
        >
          {/* Top Meta info */}
          <div style={{ position: "absolute", top: "24px", left: "24px", right: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 2 }}>
            <span style={{ fontFamily: "DM Mono", fontSize: "11px", color: "rgba(232,227,213,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {p.num}. — {p.category}
            </span>
            <span style={{ fontFamily: "DM Mono", fontSize: "11px", color: "rgba(232,227,213,0.35)" }}>
              {p.year}
            </span>
          </div>

          {/* Title + Scrollable Description — full text reachable via slim custom scrollbar */}
          <div
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="pj-back-scroll"
            style={{
              width: "100%",
              marginTop: "58px",
              marginBottom: "30px",
              overflowY: "auto",
              flex: 1,
              minHeight: 0,
              overscrollBehavior: "contain",
              cursor: "auto",
              paddingRight: "6px",
            }}
          >
            <h3
              className="transition-colors duration-500 group-hover:text-white"
              style={{ fontFamily: "DM Serif Display", fontSize: "27px", color: "#E8E3D5", lineHeight: 1.2, marginBottom: "14px" }}
            >
              {p.name}
            </h3>
            <p
              className="transition-colors duration-500 text-[rgba(232,227,213,0.55)] group-hover:text-[rgba(232,227,213,0.9)]"
              style={{ fontFamily: "DM Sans", fontSize: "13.5px", lineHeight: 1.8, textAlign: "left" }}
            >
              {p.description || "No description available for this project."}
            </p>
          </div>

          {/* Fade mask hinting there's more to scroll */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "1px",
              right: "1px",
              bottom: "40px",
              height: "34px",
              background: "linear-gradient(to top, var(--surface), rgba(0,0,0,0))",
              pointerEvents: "none",
            }}
          />

          {/* Bottom Flip Hint */}
          <span style={{ 
            fontFamily: "DM Mono", fontSize: "9px", color: "rgba(232,227,213,0.2)", 
            position: "absolute", bottom: "24px", textTransform: "uppercase", letterSpacing: "0.15em",
            zIndex: 2,
          }}>
            scroll to read · click to flip back
          </span>
        </div>
      </div>
    </div>
  );
}
// === END FLIPPABLE CARD COMPONENT ===

// Slim, premium-styled scrollbar for the back-face description.
// Rendered once at module scope so it isn't duplicated per card.
function PjBackScrollStyles() {
  return (
    <style>{`
      .pj-back-scroll {
        scrollbar-width: thin;
        scrollbar-color: rgba(232,227,213,0.25) transparent;
      }
      .pj-back-scroll::-webkit-scrollbar {
        width: 4px;
      }
      .pj-back-scroll::-webkit-scrollbar-track {
        background: transparent;
      }
      .pj-back-scroll::-webkit-scrollbar-thumb {
        background: rgba(232,227,213,0.22);
        border-radius: 4px;
      }
      .pj-back-scroll::-webkit-scrollbar-thumb:hover {
        background: rgba(232,227,213,0.4);
      }
    `}</style>
  );
}

export function Projects() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [hovered, setHovered] = useState<ExtendedProject | null>(null);
  const [projects, setProjects] = useState<ExtendedProject[]>(fallbackProjects as unknown as ExtendedProject[]);
  const [loading, setLoading] = useState(true);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(ENDPOINTS.projects);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as ApiProject[];
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setProjects(mapApiProjects(data));
        }
      } catch {
        /* keep fallback */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const list = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.16;
      pos.y += (target.y - pos.y) * 0.16;
      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${pos.x - 150}px, ${pos.y - 235}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

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
        gsap.from("[data-pj-head] > *", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-pj-head]", start: "top 80%" },
        });

        const mm = gsap.matchMedia();
        mm.add("(min-width: 1024px) and (pointer: fine)", () => {
          const track = trackRef.current;
          const pin = pinRef.current;
          if (!track || !pin) return;

          const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);

          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          gsap.from("[data-pj-card]", {
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: { trigger: pin, start: "top 80%" },
          });
        });

        mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
          gsap.from("[data-pj-card]", {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: trackRef.current, start: "top 85%" },
          });
        });

        mm.add("(max-width: 767px)", () => {
          gsap.from("[data-pj-mobile-row]", {
            x: -30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: "[data-pj-mobile-track]", start: "top 85%" },
          });
        });
      }, rootRef);

      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, [list.length]);

  return (
    <section ref={rootRef} className="relative">
      <PjBackScrollStyles />
      <div
        ref={previewRef}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-40 h-[220px] w-[300px] overflow-hidden rounded-xl border border-[var(--divider)] bg-[var(--bg)] shadow-2xl transition-[opacity,scale] duration-300 ease-out hidden lg:block ${
          hovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {hovered && (
          <img
            src={hovered.image}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      <div className="mx-auto max-w-[1280px] px-5 pt-20 sm:px-6 md:px-12 md:pt-[140px]">
        <div data-pj-head className="relative">
          <span
            aria-hidden
            data-bg-num
            className="pointer-events-none absolute -top-10 left-[-10px] select-none font-mono leading-none md:-top-16 md:left-[-12px]"
            style={{ color: "rgba(232,227,213,0.04)" }}
          >
            02
          </span>
          <p data-fg-accent className="relative font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
            Selected Work
          </p>
          <div className="relative mt-6 flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-center gap-8">
              <div aria-hidden className="hidden md:block pj-stack">
                <span className="pj-stack-card c3" />
                <span className="pj-stack-card c2" />
                <span className="pj-stack-card c1" />
              </div>
              <h2 className="font-display leading-[1.05]" style={{ fontSize: "clamp(36px, 6vw, 56px)" }}>
                Projects that <span className="italic text-[var(--accent)]">shipped.</span>
              </h2>
            </div>
            <span data-fg-accent className="font-mono text-lg text-[var(--muted)] tabular-nums">(2025 — 2026)</span>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-[var(--divider)] pb-4 md:mt-12 md:gap-8">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
                  active ? "text-[var(--fg)]" : "text-[var(--muted)] hover:text-[var(--fg)]"
                }`}
              >
                {f}
                <span
                  className={`absolute -bottom-[18px] left-0 h-px bg-[var(--accent)] transition-all duration-500 ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div ref={pinRef} className="relative lg:h-screen lg:overflow-hidden">
        <div className="mx-auto hidden max-w-[1280px] px-5 sm:px-6 md:block md:px-12 lg:hidden">
          <div ref={trackRef} className="mt-2">
            {list.map((p) => (
              <div
                key={p.num + p.name}
                data-pj-card
                className="group grid grid-cols-12 items-center gap-x-4 gap-y-2 border-b border-[var(--divider)] py-6 transition-colors duration-300 hover:bg-[var(--surface)]"
              >
                <span className="col-span-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
                  {p.num}.
                </span>
                <h3 className="col-span-6 font-display text-[24px] leading-tight">{p.name}</h3>
                <div className="col-span-4 flex items-center justify-end gap-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
                  <span>{p.year}</span>
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[var(--fg)] hover:text-[var(--accent)] transition-colors"
                  >
                    VIEW <ArrowUpRight size={14} />
                  </a>
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
                    >
                      CODE <Github size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div data-pj-mobile-track className="mx-auto max-w-[1280px] px-5 sm:px-6 md:hidden">
          <div className="mt-2">
            {list.map((p) => {
              const key = p.num + p.name;
              const isOpen = expandedKey === key;
              const initials = p.name
                .replace(/[^A-Za-z]/g, "")
                .slice(0, 2)
                .toUpperCase();
              return (
                <div
                  key={key}
                  data-pj-mobile-row
                  style={{ borderBottom: "1px solid rgba(232,227,213,0.08)" }}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedKey(isOpen ? null : key)}
                    className="flex w-full items-baseline gap-3 py-4 text-left"
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className="font-mono"
                      style={{ fontSize: "11px", color: "rgba(232,227,213,0.5)" }}
                    >
                      {p.num}
                    </span>
                    <span
                      className="font-display"
                      style={{ fontSize: "20px", color: "#E8E3D5", lineHeight: 1.2 }}
                    >
                      {p.name}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            aspectRatio: "16 / 9",
                            maxHeight: "240px",
                            borderRadius: "14px",
                            overflow: "hidden",
                            margin: "12px 0",
                          }}
                        >
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              loading="lazy"
                              style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(135deg, #0E0E0E 0%, #161616 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                className="font-display"
                                style={{ fontSize: "64px", color: "rgba(232,227,213,0.08)" }}
                              >
                                {initials}
                              </span>
                            </div>
                          )}
                          <div
                            aria-hidden
                            style={{
                              position: "absolute",
                              inset: 0,
                              background:
                                "linear-gradient(to bottom, rgba(8,8,8,0.2) 0%, rgba(8,8,8,0.4) 40%, rgba(8,8,8,0.85) 100%)",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              padding: "20px",
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <span
                                className="font-mono"
                                style={{
                                  fontSize: "11px",
                                  color: "rgba(232,227,213,0.5)",
                                }}
                              >
                                {p.num}.
                              </span>
                              <span
                                className="font-mono"
                                style={{
                                  fontSize: "11px",
                                  color: "rgba(232,227,213,0.4)",
                                }}
                              >
                                {p.year}
                              </span>
                            </div>
                            <div>
                              {p.tech?.length > 0 && (
                                <div
                                  className="font-mono"
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "6px 10px",
                                    fontSize: "10px",
                                    color: "rgba(232,227,213,0.55)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.12em",
                                  }}
                                >
                                  {p.tech.map((t, idx) => (
                                    <span key={t}>
                                      {t}
                                      {idx < p.tech.length - 1 && (
                                        <span style={{ marginLeft: "10px", opacity: 0.5 }}> </span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <h3
                                className="font-display"
                                style={{
                                  marginTop: "12px",
                                  fontSize: "24px",
                                  color: "#E8E3D5",
                                  lineHeight: 1.2,
                                }}
                              >
                                {p.name}
                              </h3>
                              <div className="mt-4 flex items-center gap-3">
                                <a
                                  href={p.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-mono inline-flex items-center gap-[6px] uppercase text-[11px] tracking-[0.08em] text-[#E8E3D5] border border-[rgba(232,227,213,0.25)] rounded-md px-3.5 py-2 bg-[rgba(8,8,8,0.4)] backdrop-blur-[4px] transition-all hover:bg-[rgba(232,227,213,0.1)]"
                                >
                                  VIEW PROJECT
                                  <ArrowUpRight size={14} strokeWidth={1.5} />
                                </a>
                                {p.githubUrl && (
                                  <a
                                    href={p.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono inline-flex items-center gap-[6px] uppercase text-[11px] tracking-[0.08em] text-[var(--muted)] border border-transparent rounded-md px-3.5 py-2 hover:text-[var(--fg)] transition-all"
                                  >
                                    <Github size={14} />
                                    CODE
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden lg:flex h-full items-center">
          <div
            ref={trackRef}
            className="flex items-stretch gap-8 pl-12 pr-24"
            style={{ willChange: "transform" }}
          >
            {list.map((p) => (
              <FlippableProjectCard key={p.num + p.name} p={p} setHovered={setHovered} />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-5 pb-20 sm:px-6 md:px-12 md:pb-[140px]">
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] tabular-nums">
            ({String(list.length).padStart(2, "0")} projects)
          </span>
          <a
            href="https://github.com/ifteakhar00kg"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg)]"
          >
            <Github size={14} strokeWidth={1.5} />
            View all on GitHub
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}