import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, Mail, MessageCircle, X } from "lucide-react";

const OPTIONS = [
  {
    key: "whatsapp",
    icon: MessageCircle,
    title: "WhatsApp",
    subtitle: "Fastest response",
    href: "https://wa.me/8801632220987?text=Hi%20Ifteakar%2C%20I%20want%20to%20start%20a%20project.",
    external: true,
    accent: "rgba(37,211,102,0.7)",
  },
  {
    key: "email",
    icon: Mail,
    title: "Email directly",
    subtitle: "contact@ifteakar.dev",
    href: "mailto:contact@ifteakar.dev",
    external: false,
    accent: "rgba(232,227,213,0.5)",
  },
  {
    key: "form",
    icon: ArrowDown,
    title: "Fill the project form",
    subtitle: "↓",
    href: "#contact-form",
    external: false,
    scrollToForm: true,
    accent: "rgba(200,184,154,0.6)",
  },
];

export function ProjectStartModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const handleOptionClick = (option: (typeof OPTIONS)[number]) => {
    if (option.scrollToForm) {
      onClose();
      setTimeout(() => {
        document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
      }, 200);
      return;
    }
    if (option.external) {
      window.open(option.href, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = option.href;
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="project-overlay"
          data-project-modal="overlay"
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <motion.div
            key="project-panel"
            data-project-modal="panel"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full"
            style={{
              maxWidth: "480px",
              background: "#0E0E0E",
              border: "1px solid rgba(232,227,213,0.12)",
              borderRadius: "20px",
              padding: "40px",
              color: "#E8E3D5",
            }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(232,227,213,0.15)] text-[#E8E3D5] transition-colors hover:bg-[rgba(232,227,213,0.07)]"
            >
              <X size={16} strokeWidth={1.5} />
            </button>

            <h2
              className="font-display leading-[1.1]"
              style={{ fontSize: "28px" }}
            >
              LET'S BUILD SOMETHING.
            </h2>
            <p
              className="mt-2 font-sans"
              style={{ fontSize: "14px", color: "rgba(232,227,213,0.5)" }}
            >
              Choose how you'd like to connect:
            </p>

            <div className="mt-8 flex flex-col gap-3">
              {OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => handleOptionClick(option)}
                    className="psm-option group relative flex w-full items-center gap-3 overflow-hidden text-left"
                    style={
                      {
                        background: "rgba(232,227,213,0.04)",
                        border: "1px solid rgba(232,227,213,0.12)",
                        borderRadius: "12px",
                        padding: "16px 20px",
                        transition: "all 220ms ease",
                        ["--psm-accent" as string]: option.accent,
                      } as React.CSSProperties
                    }
                  >
                    <span
                      aria-hidden
                      className="psm-bar"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "3px",
                        background: option.accent,
                        transform: "scaleY(0)",
                        transformOrigin: "top",
                        transition: "transform 220ms ease",
                      }}
                    />
                    <Icon
                      size={18}
                      strokeWidth={1.5}
                      className="psm-icon"
                      style={{
                        color: "rgba(232,227,213,0.6)",
                        flexShrink: 0,
                        transform: "translateX(0)",
                        transition: "transform 220ms ease",
                      }}
                    />
                    <span
                      className="flex-1 font-sans"
                      style={{ fontSize: "14px", color: "#E8E3D5" }}
                    >
                      {option.title}
                    </span>
                    <span
                      className="font-mono"
                      style={{ fontSize: "11px", color: "rgba(232,227,213,0.5)" }}
                    >
                      {option.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return mounted ? createPortal(modal, document.body) : null;
}
