import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type TransitionCtx = {
  triggerTransition: (sectionId: string, label?: string) => void;
};

const Ctx = createContext<TransitionCtx>({ triggerTransition: () => {} });

export const useTransition = () => useContext(Ctx);

const STRIP_COUNT = 5;

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<"idle" | "drop" | "rise">("idle");
  const [label, setLabel] = useState("");
  const [labelVisible, setLabelVisible] = useState(false);
  const [labelOut, setLabelOut] = useState(false);
  const timeouts = useRef<number[]>([]);

  const clearTimers = () => {
    timeouts.current.forEach((t) => clearTimeout(t));
    timeouts.current = [];
  };
  useEffect(() => clearTimers, []);

  const triggerTransition = useCallback((sectionId: string, lbl?: string) => {
    clearTimers();
    const text = (lbl ?? sectionId).toUpperCase();
    setLabel(text);
    setLabelVisible(false);
    setLabelOut(false);
    setActive(true);
    setPhase("drop");

    // Step 2: label in at 550ms (after curtain drop completes)
    timeouts.current.push(
      window.setTimeout(() => setLabelVisible(true), 550),
    );
    // Step 2b: label out at 1250ms (visible ~700ms)
    timeouts.current.push(
      window.setTimeout(() => setLabelOut(true), 1250),
    );
    // Step 3: instant jump at 1350ms (after label fade-out)
    timeouts.current.push(
      window.setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top, behavior: "auto" });
        }
        setPhase("rise");
      }, 1350),
    );
    // Step 5: section entrance + cleanup at 1750ms
    timeouts.current.push(
      window.setTimeout(async () => {
        try {
          const { gsap } = await import("gsap");
          const target = document.getElementById(sectionId);
          if (target) {
            const els = target.querySelectorAll<HTMLElement>(
              "h1, h2, h3, p, a, button, li",
            );
            gsap.fromTo(
              els,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.06,
                ease: "power3.out",
                overwrite: "auto",
              },
            );
          }
        } catch {}
        setActive(false);
        setPhase("idle");
        setLabelVisible(false);
        setLabelOut(false);
      }, 1750),
    );
  }, []);

  return (
    <Ctx.Provider value={{ triggerTransition }}>
      {children}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{ visibility: active ? "visible" : "hidden" }}
      >
        {Array.from({ length: STRIP_COUNT }).map((_, i) => {
          const dropDelay = i * 40;
          const riseDelay = (STRIP_COUNT - 1 - i) * 50;
          const translate =
            phase === "drop"
              ? "translate3d(0, 0%, 0)"
              : "translate3d(0, -100%, 0)";
          const delay = phase === "drop" ? dropDelay : riseDelay;
          return (
            <div
              key={i}
              className="absolute top-0 h-full bg-[#0A0A0A]"
              style={{
                width: "20vw",
                left: `${i * 20}vw`,
                transform: translate,
                transition: `transform 550ms cubic-bezier(0.45, 0, 0.55, 1) ${delay}ms`,
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
            />
          );
        })}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: labelVisible && !labelOut ? 1 : 0,
            transform: `scale(${labelOut ? 1.1 : labelVisible ? 1 : 0.9})`,
            transition: labelOut
              ? "opacity 150ms ease-out, transform 150ms ease-out"
              : "opacity 200ms ease-out, transform 200ms ease-out",
          }}
        >
          <span
            className="font-display text-[#E8E3D5]"
            style={{ fontSize: "clamp(48px, 8vw, 80px)" }}
          >
            {label}
          </span>
        </div>
      </div>
    </Ctx.Provider>
  );
}
