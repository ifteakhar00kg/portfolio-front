import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { ENDPOINTS } from "../config/api";
import { CvDownloadButton } from "../components/CvDownloadButton";
import { ProjectStartModal } from "../components/ProjectStartModal";

const EMAIL = "contact@ifteakar.dev";

export function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!rootRef.current) return;
      const ctx = gsap.context(() => {
        gsap.from("[data-c-reveal]", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
        });
      }, rootRef);
      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg(null);
    try {
      const res = await fetch(ENDPOINTS.contact, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    }
  };

  return (
    <section
      ref={rootRef}
      data-skew-target
      className="relative mx-auto max-w-[1280px] px-5 py-20 sm:px-6 md:px-12 md:py-[160px]"
    >
      {/* Morphing blob (behind content) */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{ left: "50%", top: "20%", transform: "translate(-50%, 0)", zIndex: 0 }}
      >
        <div className="contact-blob" style={{ position: "static" }} />
      </div>

      {/* Big background number */}
      <div
        aria-hidden
        data-bg-num
        className="pointer-events-none absolute -top-6 left-4 select-none font-mono leading-none md:left-8"
        style={{
          fontSize: "clamp(80px, 18vw, 200px)",
          color: "rgba(232,227,213,0.04)",
        }}
      >
        05
      </div>

      {/* Header */}
      <div className="relative">
        <p
          data-c-reveal
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]"
        >
          Let's Talk
        </p>
        <h2
          data-c-reveal
          className="mt-6 max-w-[800px] font-display leading-[1.05]"
          style={{ fontSize: "clamp(36px, 6vw, 56px)" }}
        >
          Whether you need a developer for your project, have a question, or
          just want to say <span className="italic text-[var(--accent)]">hi</span>.
        </h2>

        <div data-c-reveal className="mt-12">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="group relative inline-flex min-h-[44px] items-center gap-3 overflow-hidden rounded-full border border-[var(--fg)] px-7 py-4 font-mono text-xs uppercase tracking-[0.22em] text-[var(--fg)] transition-colors duration-500 hover:text-[var(--bg)]"
          >
            <span
              aria-hidden
              className="absolute inset-0 -z-0 translate-y-full rounded-full bg-[var(--fg)] transition-transform duration-500 ease-out group-hover:translate-y-0"
            />
            <span className="relative z-10">Start a project</span>
            <span aria-hidden className="relative z-10">
              ↗
            </span>
          </button>
        </div>

        <ProjectStartModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>

      <div className="mt-14 h-px w-full bg-[var(--divider)] md:mt-20" data-c-reveal />

      {/* Two columns */}
      <div className="mt-12 grid grid-cols-1 gap-14 md:mt-16 lg:grid-cols-12 lg:gap-16">
        {/* Left */}
        <div className="lg:col-span-5">
          <div data-c-reveal className="font-display text-[24px]">
            ifteakar.dev
          </div>
          <div
            data-c-reveal
            className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]"
          >
            Dhaka, Bangladesh
          </div>

          {/* Email Block */}
          <button
            type="button"
            onClick={copyEmail}
            data-c-reveal
            className="group mt-10 block text-left"
            aria-label="Copy email address"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
              Email
            </div>
            <div className="mt-2 break-all font-display text-[22px] text-[var(--fg)] transition-colors group-hover:text-[var(--accent)] md:text-[28px]">
              {EMAIL}
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent)]">
              {copied ? "Copied!" : "Click to copy"}
            </div>
          </button>

          {/* WhatsApp Option Moved Right Under Email Block */}
          <a
            data-c-reveal
            href="https://wa.me/8801632220987?text=Hi%20Ifteakar%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 block text-left"
            aria-label="Message on WhatsApp"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
              WhatsApp
            </div>
            <div className="mt-2 flex items-center gap-3 font-display text-[22px] text-[var(--fg)] transition-colors group-hover:text-[var(--accent)] md:text-[28px]">
              <MessageCircle size={22} strokeWidth={1.5} />
              <span>+880 1632-220987</span>
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent)]">
              Tap to message
            </div>
          </a>

          <div
            data-c-reveal
            className="mt-10 font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]"
          >
            Response time —{" "}
            <span className="text-[var(--fg)]">Within 24 hours</span>
          </div>

          <div data-c-reveal className="mt-10 flex flex-wrap items-center gap-6 md:gap-8">
            <a
              href="https://github.com/ifteakhar00kg"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
            >
              GitHub ↗
            </a>
            <a
              href="https://linkedin.com/in/khandokarifteakar/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://wa.me/8801632220987?text=Hi%20Ifteakar%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
            >
              WhatsApp ↗
            </a>
          </div>

          <div data-c-reveal className="mt-6">
            <CvDownloadButton />
          </div>
        </div>

        {/* Right — form */}
        <div className="lg:col-span-7">
          {status === "sent" ? (
            <div
              className="rounded-2xl border border-[var(--divider)] bg-[var(--surface)] px-5 py-12 text-center md:px-8 md:py-14"
              role="status"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent)]">
                Sent
              </div>
              <p className="mt-4 font-display text-[28px] leading-tight md:text-[32px]">
                Message sent.{" "}
                <span className="italic text-[var(--accent)]">
                  I'll reply soon.
                </span>
              </p>
            </div>
          ) : (
            <form
              id="contact-form"
              onSubmit={submit}
              data-c-reveal
              className="flex flex-col gap-2"
              noValidate
            >
              <FieldShell>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Khandokar Ifteakar Ahmed"
                  className="w-full bg-transparent py-5 font-sans text-[16px] text-[var(--fg)] outline-none placeholder:text-[var(--muted)] md:text-[18px]"
                  aria-label="Your name"
                />
              </FieldShell>

              <FieldShell>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@ifteakar.dev"
                  className="w-full bg-transparent py-5 font-sans text-[16px] text-[var(--fg)] outline-none placeholder:text-[var(--muted)] md:text-[18px]"
                  aria-label="Your email"
                />
              </FieldShell>

              <FieldShell>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="w-full resize-none bg-transparent py-5 font-sans text-[16px] text-[var(--fg)] outline-none placeholder:text-[var(--muted)] md:text-[18px]"
                  aria-label="Message"
                />
              </FieldShell>

              {errorMsg && (
                <p
                  className="mt-2 font-mono text-xs uppercase tracking-[0.18em]"
                  style={{ color: "oklch(0.62 0.16 25)" }}
                  role="alert"
                >
                  {errorMsg}
                </p>
              )}

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group inline-flex min-h-[44px] items-center gap-3 border-b border-transparent pb-1 font-mono text-xs uppercase tracking-[0.22em] text-[var(--fg)] transition-colors hover:border-[var(--fg)] disabled:opacity-50"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                  <span
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function FieldShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-[var(--divider)] transition-colors focus-within:border-[var(--fg)]">
      {children}
    </div>
  );
}