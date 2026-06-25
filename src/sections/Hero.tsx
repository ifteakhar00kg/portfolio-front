import { useEffect, useRef, useState } from "react";
import { CvDownloadButton } from "../components/CvDownloadButton";



function HoverSwap({ base, hover }: { base: string; hover: string }) {
  return (
    <span
      className="relative inline-block align-baseline [@media(pointer:coarse)]:pointer-events-none group"
      style={{ cursor: "default" }}
    >
      <span className="transition-opacity duration-[250ms] ease-out group-hover:opacity-0 [@media(pointer:coarse)]:!opacity-100">
        {base}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 opacity-0 transition-opacity duration-[250ms] ease-out group-hover:opacity-100 [@media(pointer:coarse)]:!opacity-0 whitespace-nowrap"
      >
        {hover}
      </span>
    </span>
  );
}

function useDhakaTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () => {
      const t = new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setTime(`Dhaka · ${t}`);
    };
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const time = useDhakaTime();

  useEffect(() => {
    let cancelled = false;
    // Wait for preloader (~2s) before kicking off entrance timeline
    const start = async () => {
      const { gsap } = await import("gsap");
      if (cancelled || !rootRef.current) return;
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 1.4, defaults: { ease: "power3.out" } });
        tl.from("[data-h-meta]", { y: -10, opacity: 0, duration: 0.6, stagger: 0.05 }, 0)
          .from("[data-h-label]", { x: -24, opacity: 0, duration: 0.7 }, 0.3)
          .from(
            "[data-h-word]",
            {
              yPercent: 110,
              duration: 0.9,
              stagger: 0.2,
              ease: "expo.out",
            },
            0.5,
          )
          .from("[data-h-sub]", { y: 16, opacity: 0, duration: 0.7 }, 1.2)
          .from("[data-h-foot]", { y: 14, opacity: 0, duration: 0.6, stagger: 0.08 }, 1.4)
          .from("[data-h-visual]", { opacity: 0, scale: 0.94, duration: 1.2, ease: "power2.out" }, 1.6);
      }, rootRef);
      return () => ctx.revert();
    };
    const cleanup = start();
    return () => {
      cancelled = true;
      cleanup.then((c) => c?.());
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative min-h-[100svh] w-full overflow-hidden md:h-screen md:min-h-[720px]"
    >
      {/* Desktop CSS-only 3D visual fallback */}
      <div
        data-h-visual
        className="pointer-events-none absolute inset-y-0 right-0 hidden md:flex items-center justify-center"
        style={{
          width: "50vw",
          height: "100vh",
          translate: "var(--mx, 0px) var(--my, 0px)",
          willChange: "transform",
        }}
      >
        {/* Parallax depth layer (moves slower than the cube) */}
        <div
          data-h-visual-bg
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 70% 50%, rgba(200,184,154,0.10) 0%, rgba(8,8,8,0) 65%)",
          }}
        />
        <div className="hero-spline-float">
          <div className="hero-visual-stage" aria-hidden>
            <div className="hero-visual-orbit hero-visual-orbit-a" />
            <div className="hero-visual-orbit hero-visual-orbit-b" />
            <div className="hero-visual-cube">
              <span className="hero-cube-face hero-cube-front" />
              <span className="hero-cube-face hero-cube-back" />
              <span className="hero-cube-face hero-cube-right" />
              <span className="hero-cube-face hero-cube-left" />
              <span className="hero-cube-face hero-cube-top" />
              <span className="hero-cube-face hero-cube-bottom" />
            </div>
            <div className="hero-visual-ring" />
          </div>
        </div>
        {/* fade scrim to bg on the left edge so text stays readable */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, var(--bg) 0%, rgba(8,8,8,0.6) 22%, rgba(8,8,8,0) 55%)",
          }}
        />
      </div>


      {/* Mobile ambient 3D mark */}
      <div aria-hidden className="hero-mobile-mark md:hidden" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1280px] flex-col px-5 sm:px-6 md:h-full md:min-h-0 md:px-12">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 pt-24 md:pt-28">
          <span
            data-h-meta
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]"
          >
            Dhaka, Bangladesh
          </span>
          <span
            data-h-meta
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] tabular-nums"
          >
            {time || "Dhaka · --:-- --"}
          </span>
        </div>

        {/* Center */}
        <div className="flex flex-1 flex-col justify-center">
          <p
            data-h-label
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]"
          >
            FULL STACK DEVELOPER — <HoverSwap base="FRONTEND" hover="REACT.JS" /> / <HoverSwap base="BACKEND" hover="SPRING BOOT" />
          </p>

          <h1 className="mt-8 font-display leading-[0.95] md:leading-[0.9]" style={{ fontSize: "clamp(48px, 10vw, 120px)" }}>
            <span className="block overflow-hidden">
              <span data-h-word className="block">
                Building
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-h-word className="block italic text-[var(--accent)]">
                Digital
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-h-word className="block">
                Products<span className="text-[var(--accent)]">.</span>
              </span>
            </span>
          </h1>

          <p
            data-h-sub
            className="mt-8 max-w-[480px] font-sans leading-relaxed text-[var(--muted)] md:mt-10"
            style={{ fontSize: "clamp(15px, 2vw, 18px)" }}
          >
            Spring Boot APIs. React interfaces. Custom AI integrations.
          </p>

          <div data-h-sub className="mt-6 md:mt-8">
            <CvDownloadButton />
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-start gap-5 pb-7 sm:flex-row sm:items-end sm:justify-between md:pb-10">
          <div
            data-h-foot
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]"
          >
            <span className="relative inline-flex h-[6px] w-[6px]">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
              <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-[var(--accent)]" />
            </span>
            Available for work
          </div>

          <a
            data-h-foot
            href="#work"
            className="group hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] transition-colors hover:text-[var(--fg)] sm:flex"
          >
            Scroll
            <span className="inline-block animate-bounce">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
