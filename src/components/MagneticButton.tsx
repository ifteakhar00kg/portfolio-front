import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: "button" | "a";
  href?: string;
  children: ReactNode;
  strength?: number;
};

export function MagneticButton({
  children,
  className = "",
  as = "a",
  href,
  strength = 8,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    const state = { x: 0, y: 0, tx: 0, ty: 0 };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const radius = Math.max(rect.width, rect.height);
      if (dist < radius * 1.4) {
        state.tx = (dx / radius) * strength;
        state.ty = (dy / radius) * strength;
      } else {
        state.tx = 0;
        state.ty = 0;
      }
    };
    const onLeave = () => {
      state.tx = 0;
      state.ty = 0;
    };
    const tick = () => {
      state.x += (state.tx - state.x) * 0.15;
      state.y += (state.ty - state.y) * 0.15;
      el.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  if (as === "a") {
    const { onClick } = rest as { onClick?: React.MouseEventHandler<HTMLAnchorElement> };
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}
