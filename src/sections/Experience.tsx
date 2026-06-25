import { useEffect, useRef, useState } from "react";
import { Plus, ArrowUpRight } from "lucide-react";

type Job = {
  range: string;
  company: string;
  role: string;
  bullets: string[];
  tech: string[];
  badge?: string;
};

const JOBS: Job[] = [
  {
    range: "2025 — Present",
    company: "Freelance & Open to hire",
    role: "Full Stack Developer",
    bullets: [
      "Built some complete web applications with Spring Boot + React",
      "Integrated 10+ third-party APIs — payments, AI, messaging",
      "Available for full-time, part-time and project-based work",
    ],
    tech: ["Spring Boot", "Vibe Coding", "React", "PostgreSQL", "Docker"],
  },
  {
    range: "2023 — Present",
    company: "Personal Projects + Learning",
    role: "Backend Developer",
    bullets: [
      "Developed RESTful APIs with JWT authentication",
      "PostgreSQL database design and query optimization",
      "Spring Security, Redis caching implementation",
    ],
    tech: ["Spring Boot", "Spring Security", "JWT", "Redis"],
  },
  {
    range: "2023 — 2027 (Running)",
    company: "Dhaka International University",
    role: "Bachelor of Science in Computer Science & Engineering",
    bullets: [
      "Focused on algorithms, databases and software engineering",
      "Built first full-stack projects using Java + web technologies",
      "Foundation in data structures, OOP and system design",
    ],
    tech: ["Java", "C++", "Algorithms", "SQL"],
    badge: "Currently Enrolled",
  },
];

type SkillGroup = { name: string; items: string[] };

const SKILLS: SkillGroup[] = [
  {
    name: "Backend Engineering",
    items: [
      "Spring Boot",
      "Java",
      "Spring Security",
      "JWT",
      "REST API",
      "Hibernate / JPA",
      "Microservices",
      "Maven",
    ],
  },
  {
    name: "Frontend",
    items: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Framer Motion",
      "HTML5",
      "CSS3",
    ],
  },
  {
    name: "Database & Cache",
    items: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Redis",
      "Database Design",
      "Query Optimization",
    ],
  },
  {
    name: "DevOps & Cloud",
    items: ["Docker", "Git", "GitHub"],
  },
  {
    name: "AI & APIs",
    items: [
      "Spring AI",
      "OpenAI API",
      "Gemini API",
      "Third-party API Integration",
      "Payment Gateway Integration",
    ],
  },
  {
    name: "Tools",
    items: [
      "IntelliJ IDEA",
      "VS Code",
      "Postman",
      "PyCharm",
      "Swagger/OpenAPI",
      "Figma",
      "Lovable",
    ],
  },
];

// Replaced Testimonials with Real Certifications
const CERTIFICATIONS = [
  {
    title: "Certified Spring Boot Developer",
    description:
      "Successfully completed a comprehensive Spring Boot Developer course, mastering enterprise-level backend architecture, REST APIs, MVC patterns, and database integrations.",
    issuer: "Ostad",
    link: "https://ostad.app/share/certificate/c40205-khandokar-ifteakar-ahmed",
  },
  {
    title: "The Infinity AI Buildfest 2026",
    description:
      "Awarded for successfully participating in the Preliminary Round and demonstrating commitment to building an AI-powered solution with real-world impact.",
    issuer: "CloudCamp BD",
    link: "https://cloudcampbd.com/verify/35338db138d725ac24e0fb41",
  },
];

export function Experience() {
  const rootRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

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
        gsap.from("[data-ex-head] > *", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-ex-head]", start: "top 80%" },
        });

        gsap.from("[data-ex-job]", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-ex-jobs]", start: "top 85%" },
        });

        gsap.from("[data-ex-skill]", {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-ex-skills]", start: "top 85%" },
        });

        gsap.from("[data-ex-quote]", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-ex-quotes]", start: "top 88%" },
        });

        gsap.to("[data-ex-orbit]", {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
        });
      }, rootRef);

      cleanup = () => ctx.revert();
    })();

    return () => cleanup?.();
  }, []);

  return (
    <section
      ref={rootRef}
      data-skew-target
      className="relative mx-auto max-w-[1280px] px-5 py-20 sm:px-6 md:px-12 md:py-[140px]"
    >
      {/* Decor — orbit */}
      <div
        aria-hidden
        data-ex-orbit
        className="pointer-events-none absolute right-8 top-12 hidden md:block"
        style={{ opacity: 0, transform: "scale(0.5)" }}
      >
        <div className="ex-orbit">
          <div className="ex-orbit-path p1" />
          <div className="ex-orbit-path p2" />
          <div className="ex-orbit-center" />
          <div className="ex-orbit-arm a1"><div className="ex-orbit-dot" /></div>
          <div className="ex-orbit-arm a2"><div className="ex-orbit-dot" /></div>
        </div>
      </div>

      {/* Header */}
      <div data-ex-head className="relative">
        <span
          aria-hidden
          data-bg-num
          className="pointer-events-none absolute -top-10 left-[-10px] select-none font-mono leading-none md:-top-16 md:left-[-12px]"
          style={{ color: "rgba(232,227,213,0.04)" }}
        >
          04
        </span>
        <p className="relative font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
          Background
        </p>
        <div className="relative mt-12 h-px w-full bg-[var(--divider)]" />
      </div>

      {/* Two columns */}
      <div className="mt-12 grid grid-cols-1 gap-14 md:mt-16 lg:grid-cols-12 lg:gap-12">
        {/* LEFT — Experience */}
        <div className="lg:col-span-7">
          <h3 className="font-display leading-[1.05]" style={{ fontSize: "clamp(36px, 6vw, 48px)" }}>
            Proof of <span className="italic text-[var(--accent)]">work.</span>
          </h3>

          <div data-ex-jobs className="mt-12">
            {JOBS.map((j, i) => (
              <div
                key={j.range}
                data-ex-job
                className={`grid grid-cols-12 gap-4 py-8 md:py-10 ${
                  i !== 0 ? "border-t border-[var(--divider)]" : ""
                }`}
              >
                <div className="col-span-12 md:col-span-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
                    {j.range}
                  </span>
                </div>
                <div className="col-span-12 md:col-span-9">
                  <h4 className="font-display text-[24px] leading-tight">{j.company}</h4>
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <p className="text-[var(--muted)]" style={{ fontSize: "clamp(15px, 2vw, 18px)" }}>{j.role}</p>
                    {j.badge && (
                      <span className="rounded-full border border-[var(--divider)] bg-[var(--surface)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">
                        {j.badge}
                      </span>
                    )}
                  </div>
                  <ul className="mt-5 space-y-2.5">
                    {j.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex gap-3 leading-relaxed text-[var(--fg)]/85"
                        style={{ fontSize: "clamp(15px, 2vw, 18px)" }}
                      >
                        <span className="mt-2 inline-block h-px w-3 shrink-0 bg-[var(--muted)]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {j.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-[var(--divider)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--muted)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Skills accordion */}
        <div className="lg:col-span-5">
          <h3 className="font-display leading-[1.05]" style={{ fontSize: "clamp(36px, 6vw, 48px)" }}>
            Skill<span className="italic text-[var(--accent)]">set.</span>
          </h3>

          <div data-ex-skills className="mt-12 border-t border-[var(--divider)]">
            {SKILLS.map((s, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={s.name}
                  data-ex-skill
                  className="border-b border-[var(--divider)]"
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-6 text-left transition-colors hover:text-[var(--fg)]"
                  >
                    <span className="flex items-center gap-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)] tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-[22px] leading-tight md:text-[24px]">{s.name}</span>
                    </span>
                    <span className="flex items-center gap-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)] tabular-nums">
                        {String(s.items.length).padStart(2, "0")}
                      </span>
                      <Plus
                        size={16}
                        strokeWidth={1.25}
                        className={`text-[var(--accent)] transition-transform duration-500 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      />
                    </span>
                  </button>
                  <div
                    className="grid transition-all duration-500 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-wrap gap-2 pb-6 pl-12">
                        {s.items.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-[var(--divider)] bg-[var(--surface)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--fg)]/80"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Certifications (Replaced Testimonials) */}
      <div
        data-ex-quotes
        className="mt-24 grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        {CERTIFICATIONS.map((c) => (
          <a
            key={c.title}
            href={c.link}
            target="_blank"
            rel="noopener noreferrer"
            data-ex-quote
            className="group relative flex flex-col justify-between rounded-2xl border border-[var(--divider)] bg-[var(--surface)] p-5 md:p-10 transition-colors hover:bg-[var(--surface-hover)] hover:border-[var(--accent)]"
          >
            <div className="flex justify-between items-start">
               <span
                aria-hidden
                className="font-display text-4xl leading-none text-[var(--accent)] opacity-50"
               >
                ✦
               </span>
               <ArrowUpRight size={22} strokeWidth={1.5} className="text-[var(--muted)] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
            </div>

            <div className="mt-4">
              <h4 className="font-display text-[22px] leading-snug text-[var(--fg)] md:text-[24px]">
                {c.title}
              </h4>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--muted)]">
                {c.description}
              </p>
            </div>
            
            <figcaption className="mt-8 flex flex-col items-start gap-2 border-t border-[var(--divider)] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-display text-[16px]">{c.issuer}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
                View Certificate
              </span>
            </figcaption>
          </a>
        ))}
      </div>
    </section>
  );
}