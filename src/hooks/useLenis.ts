import { useEffect } from "react";

export function useLenis() {
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      lenis.on("scroll", ScrollTrigger.update);
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;

      // Scroll velocity skew — elastic feel
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const coarse =
        typeof window !== "undefined" &&
        window.matchMedia("(pointer: coarse)").matches;
      const skewMax = coarse ? 2 : 4;
      let currentSkew = 0;
      let targetSkew = 0;

      const skewTargets = () =>
        document.querySelectorAll<HTMLElement>("[data-skew-target]");

      if (!reduce) {
        lenis.on("scroll", ({ velocity }: { velocity: number }) => {
          const v = Math.max(-40, Math.min(40, velocity));
          targetSkew = (v / 40) * skewMax;
        });

        const skewTick = () => {
          currentSkew += (targetSkew - currentSkew) * 0.1;
          targetSkew *= 0.92;
          if (Math.abs(currentSkew) > 0.02) {
            const value = `skewY(${currentSkew.toFixed(2)}deg)`;
            skewTargets().forEach((el) => {
              el.style.transform = value;
            });
          } else if (Math.abs(currentSkew) <= 0.02 && currentSkew !== 0) {
            currentSkew = 0;
            skewTargets().forEach((el) => {
              el.style.transform = "";
            });
          }
        };
        gsap.ticker.add(skewTick);

        const raf = (time: number) => {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        cleanup = () => {
          gsap.ticker.remove(raf);
          gsap.ticker.remove(skewTick);
          lenis.destroy();
        };
      } else {
        const raf = (time: number) => {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(raf);
        cleanup = () => {
          gsap.ticker.remove(raf);
          lenis.destroy();
        };
      }
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);
}
