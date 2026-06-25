import { useEffect, useState } from "react";
import { MagneticButton } from "./MagneticButton";
import { useTransition } from "./TransitionOverlay";

const links = [
  { label: "Work", to: "#projects", id: "projects" },
  { label: "Services", to: "#services", id: "services" },
  { label: "Experience", to: "#experience", id: "experience" },
  { label: "Contact", to: "#contact", id: "contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { triggerTransition } = useTransition();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNav = (
    e: React.MouseEvent<HTMLElement>,
    id: string,
    label: string,
    fromMobile = false,
  ) => {
    e.preventDefault();
    if (fromMobile && open) {
      setOpen(false);
      setTimeout(() => triggerTransition(id, label), 300);
    } else {
      triggerTransition(id, label);
    }
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-[rgba(8,8,8,0.6)] border-b border-[var(--divider)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-5 md:px-12">
          <a
            href="#home"
            onClick={(e) => handleNav(e, "home", "Home")}
            className="font-display text-[var(--fg)]"
            aria-label="Home"
            style={{
              fontSize: "clamp(18px, 2.2vw, 20px)",
              letterSpacing: "0.02em",
              color: "#E8E3D5",
            }}
          >
            IFTEAKAR<span className="text-[var(--accent)]">.</span>
          </a>

          <nav className="hidden items-center gap-10 md:flex">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.to}
                onClick={(e) => handleNav(e, l.id, l.label)}
                className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <MagneticButton
              href="#contact"
              onClick={(e) => handleNav(e, "contact", "Contact")}
              className="inline-flex items-center gap-2 border border-[var(--fg)] px-5 py-2 font-mono text-xs uppercase tracking-[0.18em] text-[var(--fg)] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)] will-change-transform"
            >
              Hire me
              <span aria-hidden>↗</span>
            </MagneticButton>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative z-[60] flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span
              className={`block h-px w-6 bg-[var(--fg)] transition-transform duration-300 ${
                open ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-[var(--fg)] transition-transform duration-300 ${
                open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        className={`fixed inset-0 z-[55] flex flex-col bg-[#080808] px-6 pb-10 pt-28 transition-all duration-200 md:hidden ${
          open
            ? "pointer-events-auto opacity-100 translate-x-0"
            : "pointer-events-none opacity-0 translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <nav className="flex flex-1 flex-col justify-center gap-6">
          {links.map((l, i) => (
            <a
              key={l.label}
              href={l.to}
              onClick={(e) => handleNav(e, l.id, l.label, true)}
              className="font-display text-[48px] leading-tight text-[var(--fg)] transition-colors hover:text-[var(--accent)]"
              style={{
                transitionDelay: open ? `${0.1 + i * 0.05}s` : "0s",
                transform: open ? "translateY(0)" : "translateY(20px)",
                opacity: open ? 1 : 0,
                transitionProperty: "opacity, transform, color",
                transitionDuration: "500ms",
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
          <span>Dhaka, Bangladesh</span>
          <a
            href="mailto:contact@ifteakar.dev"
            className="hover:text-[var(--fg)]"
          >
            contact@ifteakar.dev
          </a>
        </div>
      </div>
    </>
  );
}
