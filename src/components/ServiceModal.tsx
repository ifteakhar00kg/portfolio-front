import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export type ServiceKey = "backend" | "frontend" | "api" | "ai";

type Section = {
  eyebrow: string;
  title: string;
  description: string;
  delivers: string[];
  stack: string[];
  timeline: string;
  cta: string;
};

const CONTENT: Record<ServiceKey, Section> = {
  backend: {
    eyebrow: "01 — ENGINE",
    title: "Backend Engineering",
    description:
      "I architect and build the invisible engine that powers your product. From database schema design to production-ready REST APIs with JWT authentication, Spring Security, and microservice architecture — everything built to scale.",
    delivers: [
      "REST API design & development",
      "JWT authentication & Spring Security",
      "Microservices architecture",
      "Database design (PostgreSQL, MySQL, MongoDB)",
      "Redis caching & performance optimization",
      "Docker containerization",
      "API documentation with Swagger/OpenAPI",
    ],
    stack: [
      "Spring Boot",
      "Java",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Redis",
      "Docker",
      "Maven",
      "Hibernate/JPA",
      "Spring Security",
      "JWT",
      "Microservices",
    ],
    timeline: "Typical delivery: 2–6 weeks depending on scope",
    cta: "Start a Backend Project →",
  },
  frontend: {
    eyebrow: "02 — SURFACE",
    title: "Frontend Development",
    description:
      "Pixel-perfect, performant React interfaces that users actually enjoy using. TypeScript for reliability, Tailwind for speed, Framer Motion for the details that make visitors stop and notice. What you're looking at right now.",
    delivers: [
      "React.js & Next.js application development",
      "TypeScript for type-safe codebases",
      "Responsive design (mobile-first)",
      "Smooth animations with Framer Motion",
      "State management & API integration",
      "Performance optimization",
      "Component library setup",
    ],
    stack: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Framer Motion",
      "HTML5",
      "CSS3",
    ],
    timeline: "Typical delivery: 1–4 weeks depending on scope",
    cta: "Start a Frontend Project →",
  },
  api: {
    eyebrow: "03 — BRIDGE",
    title: "API Integration",
    description:
      "I connect third-party services to your existing product — in your preferred language and framework. Payment gateways, AI models, messaging platforms, maps, social APIs, custom webhooks. You name it, I wire it.",
    delivers: [
      "Payment gateway integration (Stripe, Razorpay, PayPal, bKash)",
      "AI API integration (OpenAI, Gemini, Claude)",
      "Messaging APIs (WhatsApp, Twilio, Telegram Bot)",
      "Social platform APIs (GitHub, Google, Facebook OAuth)",
      "Map & location APIs (Google Maps, Mapbox)",
      "Email services (SendGrid, Mailchimp)",
      "Custom webhook & event systems",
    ],
    stack: [
      "Spring AI",
      "OpenAI API",
      "Gemini API",
      "Stripe",
      "Razorpay",
      "Twilio",
      "WhatsApp API",
      "Google Maps",
      "SendGrid",
    ],
    timeline: "Typical delivery: 3 days – 2 weeks",
    cta: "Discuss an Integration →",
  },
  ai: {
    eyebrow: "04 — INTELLIGENCE",
    title: "AI Integration",
    description:
      "Embed real AI capabilities into your existing product. Not a chatbot bolted on the side — proper AI integration into your backend logic, your database, your user flows. Using OpenAI, Gemini, Claude, or locally-run models with Ollama.",
    delivers: [
      "AI chatbot embedded in your product (like this one)",
      "RAG (Retrieval Augmented Generation) systems",
      "AI-powered search and recommendations",
      "Automated content generation pipelines",
      "Local model deployment with Ollama",
      "LangChain workflow integration",
      "Spring AI integration with Java backends",
      "Gemini & OpenAI API integration",
    ],
    stack: [
      "Spring AI",
      "OpenAI API",
      "Gemini API",
      "Claude API",
      "Ollama",
      "LangChain",
      "PostgreSQL (pgvector)",
      "Spring Boot",
    ],
    timeline: "Typical delivery: 1–3 weeks",
    cta: "Add AI to My Product →",
  },
};

const LANGS: Array<{ key: string; label: string; oneLiner: string }> = [
  { key: "java", label: "Java", oneLiner: "RestTemplate / WebClient with Spring Boot" },
  { key: "js", label: "JavaScript", oneLiner: "Axios / Fetch with Express or Next.js" },
  { key: "ts", label: "TypeScript", oneLiner: "Typed SDK integration with error handling" },
  { key: "py", label: "Python", oneLiner: "requests library with Flask/FastAPI" },
  { key: "php", label: "PHP", oneLiner: "Guzzle HTTP client with Laravel" },
];

export function ServiceModal({
  service,
  onClose,
}: {
  service: ServiceKey | null;
  onClose: () => void;
}) {
  const [lang, setLang] = useState("java");

  useEffect(() => {
    if (!service) return;
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
  }, [service, onClose]);

  const data = service ? CONTENT[service] : null;
  const selectedLang = LANGS.find((l) => l.key === lang) ?? LANGS[0];

  const ctaClick = () => {
    onClose();
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 250);
  };

  return (
    <AnimatePresence>
      {service && data && (
        <motion.div
          key="svc-overlay"
          className="fixed inset-0 z-[100] flex items-end justify-center"
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
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <motion.div
            key="svc-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[720px] overflow-y-auto"
            style={{
              background: "#0E0E0E",
              borderTop: "1px solid rgba(232,227,213,0.12)",
              borderRadius: "24px 24px 0 0",
              padding: "clamp(24px, 5vw, 48px)",
              maxHeight: "90vh",
              color: "#E8E3D5",
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(232,227,213,0.15)] text-[#E8E3D5] transition-colors hover:bg-[rgba(232,227,213,0.07)]"
            >
              <X size={16} strokeWidth={1.5} />
            </button>

            <p
              className="font-mono uppercase"
              style={{ fontSize: "11px", letterSpacing: "0.2em", color: "rgba(232,227,213,0.5)" }}
            >
              {data.eyebrow}
            </p>
            <h2
              className="mt-4 font-display leading-[1.05]"
              style={{ fontSize: "clamp(30px, 6vw, 42px)" }}
            >
              {data.title}
            </h2>
            <p
              className="mt-5 leading-relaxed"
              style={{ color: "rgba(232,227,213,0.75)", fontSize: "16px", maxWidth: "60ch" }}
            >
              {data.description}
            </p>

            <div className="mt-10">
              <p
                className="font-mono uppercase"
                style={{ fontSize: "10px", letterSpacing: "0.22em", color: "rgba(232,227,213,0.5)" }}
              >
                What I Deliver
              </p>
              <ul className="mt-4 grid gap-2">
                {data.delivers.map((d) => (
                  <li
                    key={d}
                    className="flex gap-3 leading-relaxed"
                    style={{ fontSize: "15px", color: "rgba(232,227,213,0.9)" }}
                  >
                    <span style={{ color: "var(--accent, #C9A36B)" }}>—</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {service === "api" && (
              <div className="mt-10">
                <p
                  className="font-mono uppercase"
                  style={{ fontSize: "10px", letterSpacing: "0.22em", color: "rgba(232,227,213,0.5)" }}
                >
                  Languages I Deliver In
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {LANGS.map((l) => {
                    const active = l.key === lang;
                    return (
                      <button
                        type="button"
                        key={l.key}
                        onClick={() => setLang(l.key)}
                        className="rounded-full px-3.5 py-1.5 font-mono uppercase transition-colors"
                        style={{
                          fontSize: "10px",
                          letterSpacing: "0.15em",
                          border: `1px solid ${active ? "rgba(232,227,213,0.6)" : "rgba(232,227,213,0.15)"}`,
                          background: active ? "rgba(232,227,213,0.08)" : "transparent",
                          color: active ? "#E8E3D5" : "rgba(232,227,213,0.6)",
                        }}
                      >
                        {l.label}
                      </button>
                    );
                  })}
                </div>
                <p
                  className="mt-3 font-mono"
                  style={{ fontSize: "13px", color: "rgba(232,227,213,0.7)" }}
                >
                  {selectedLang.oneLiner}
                </p>
              </div>
            )}

            <div className="mt-10">
              <p
                className="font-mono uppercase"
                style={{ fontSize: "10px", letterSpacing: "0.22em", color: "rgba(232,227,213,0.5)" }}
              >
                Tech Stack
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {data.stack.map((t) => (
                  <span
                    key={t}
                    className="rounded-full px-3 py-1 font-mono uppercase"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.15em",
                      border: "1px solid rgba(232,227,213,0.15)",
                      color: "rgba(232,227,213,0.8)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <p
              className="mt-10 font-mono uppercase"
              style={{ fontSize: "11px", letterSpacing: "0.18em", color: "rgba(232,227,213,0.55)" }}
            >
              {data.timeline}
            </p>

            <div className="mt-8">
              <button
                type="button"
                onClick={ctaClick}
                className="group inline-flex min-h-[44px] items-center gap-3 rounded-full px-6 py-3 font-mono uppercase transition-colors"
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.22em",
                  border: "1px solid #E8E3D5",
                  color: "#E8E3D5",
                }}
              >
                <span>{data.cta}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
