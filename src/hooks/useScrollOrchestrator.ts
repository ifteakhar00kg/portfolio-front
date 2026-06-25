import { useEffect } from "react";

/**
 * Global cinematic scroll orchestrator.
 * - 3-layer parallax: [data-bg-num] (slow), normal content (1x), [data-fg-accent] (fast)
 * - Hero text + 3D object scroll-linked parallax
 * - Hero mouse parallax (desktop)
 * - ScrollTrigger.refresh() after fonts settle
 */
export function useScrollOrchestrator() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const distScale = coarse ? 0.5 : 1;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const disposers: Array<() => void> = [];

      const ctx = gsap.context(() => {
        // LAYER 1 (back) — giant background numerals: slow
        document.querySelectorAll<HTMLElement>("[data-bg-num]").forEach((el) => {
          const section = el.closest("section") ?? el.parentElement ?? el;
          gsap.fromTo(
            el,
            { y: 90 * distScale },
            {
              y: -90 * distScale,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 2,
              },
            },
          );
        });

        // LAYER 3 (front) — accent details: faster
        document.querySelectorAll<HTMLElement>("[data-fg-accent]").forEach((el) => {
          const section = el.closest("section") ?? el.parentElement ?? el;
          gsap.fromTo(
            el,
            { y: 50 * distScale },
            {
              y: -50 * distScale,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            },
          );
        });

        // HERO — scroll-linked parallax
        const heroSection = document.querySelector<HTMLElement>("#home");
        if (heroSection) {
          const visual = heroSection.querySelector<HTMLElement>("[data-h-visual]");
          const visualBg = heroSection.querySelector<HTMLElement>("[data-h-visual-bg]");
          const text = heroSection.querySelectorAll<HTMLElement>(
            "[data-h-label], h1, [data-h-sub]",
          );
          const topMeta = heroSection.querySelectorAll<HTMLElement>("[data-h-meta]");

          if (visual) {
            gsap.fromTo(visual,
              { y: 0, rotate: 0 },
              {
                y: -40 * distScale,
                rotate: -4,
                ease: "none",
                scrollTrigger: {
                  trigger: heroSection,
                  start: "top top",
                  end: "bottom top",
                  scrub: 1.5,
                  invalidateOnRefresh: true,
                },
              },
            );
          }
          if (visualBg) {
            gsap.fromTo(visualBg,
              { y: 0 },
              {
                y: -20 * distScale,
                ease: "none",
                scrollTrigger: {
                  trigger: heroSection,
                  start: "top top",
                  end: "bottom top",
                  scrub: 1.5,
                  invalidateOnRefresh: true,
                },
              },
            );
          }
          if (text.length) {
            gsap.fromTo(text,
              { y: 0, opacity: 1 },
              {
                y: -80 * distScale,
                opacity: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: heroSection,
                  start: "top top",
                  end: "bottom top",
                  scrub: 1.5,
                  invalidateOnRefresh: true,
                },
              },
            );
          }
          if (topMeta.length) {
            gsap.fromTo(topMeta,
              { y: 0 },
              {
                y: -40 * distScale,
                ease: "none",
                scrollTrigger: {
                  trigger: heroSection,
                  start: "top top",
                  end: "bottom top",
                  scrub: 1.5,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          // HERO mouse parallax (desktop only)
          if (!coarse) {
            const target = { x: 0, y: 0 };
            const pos = { x: 0, y: 0 };
            const onMove = (e: MouseEvent) => {
              const rect = heroSection.getBoundingClientRect();
              if (e.clientY < rect.top || e.clientY > rect.bottom) return;
              const cx = rect.left + rect.width / 2;
              const cy = rect.top + rect.height / 2;
              target.x = e.clientX - cx;
              target.y = e.clientY - cy;
            };
            let raf = 0;
            const tick = () => {
              pos.x += (target.x - pos.x) * 0.08;
              pos.y += (target.y - pos.y) * 0.08;
              if (visual) {
                visual.style.setProperty("--mx", `${pos.x * 0.05}px`);
                visual.style.setProperty("--my", `${pos.y * 0.05}px`);
              }
              text.forEach((el) => {
                el.style.setProperty("--mx", `${pos.x * -0.015}px`);
                el.style.setProperty("--my", `${pos.y * -0.015}px`);
              });
              raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
            window.addEventListener("mousemove", onMove);
            disposers.push(() => {
              cancelAnimationFrame(raf);
              window.removeEventListener("mousemove", onMove);
            });
          }
        }
      });

      // Refresh after fonts load
      const refresh = () => ScrollTrigger.refresh();
      if (document.fonts?.ready) {
        document.fonts.ready.then(refresh).catch(() => {});
      }
      window.addEventListener("load", refresh, { once: true });
      const t = window.setTimeout(refresh, 600);
      requestAnimationFrame(() => ScrollTrigger.refresh());

      cleanup = () => {
        clearTimeout(t);
        disposers.forEach((d) => d());
        ctx.revert();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);
}
