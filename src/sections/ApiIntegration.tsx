import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ApiCube } from "../components/ApiCube";

const ROW_1 = [
  "OpenAI",
  "Stripe",
  "Google Maps",
  "Twilio",
  "SendGrid",
  "Firebase",
  "Cloudinary",
  "PayPal",
  "Razorpay",
  "YouTube API",
];
const ROW_2 = [
  "WhatsApp API",
  "Slack API",
  "Telegram Bot",
  "GitHub API",
  "Shopify",
  "HubSpot",
  "Mailchimp",
  "AWS S3",
  "Zoom",
  "Discord",
];

const LANGS = ["Java", "C++", "JavaScript", "Python", "TypeScript"] as const;
type Lang = (typeof LANGS)[number];

const SNIPPETS: Record<Lang, string> = {
  Java: `// Spring Boot — Stripe charge
@PostMapping("/charge")
public ResponseEntity<?> charge(@RequestBody ChargeReq req) {
  Stripe.apiKey = env.get("STRIPE_SECRET");
  PaymentIntent intent = PaymentIntent.create(Map.of(
    "amount", req.amount(),
    "currency", "usd",
    "automatic_payment_methods", Map.of("enabled", true)
  ));
  return ResponseEntity.ok(intent);
}`,
  JavaScript: `// Express — OpenAI proxy
app.post("/ai/chat", async (req, res) => {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${process.env.OPENAI_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "gpt-4o", messages: req.body.messages }),
  });
  res.json(await r.json());
});`,
  "C++": `// libcurl — Stripe charge
#include <iostream>
#include <curl/curl.h>
#include <nlohmann/json.hpp>
using json = nlohmann::json;

int main() {
    CURL* curl = curl_easy_init();
    if (!curl) return 1;

    std::string apiKey = "your-stripe-api-key";
    std::string url = "https://api.stripe.com/v1/charges";

    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_USERPWD, apiKey.c_str());

    CURLcode res = curl_easy_perform(curl);
    curl_easy_cleanup(curl);
    return 0;
}`,
  Python: `# FastAPI — Twilio SMS
from fastapi import APIRouter
from twilio.rest import Client

router = APIRouter()
client = Client(env("TWILIO_SID"), env("TWILIO_TOKEN"))

@router.post("/sms")
def send_sms(to: str, body: str):
    msg = client.messages.create(
        from_=env("TWILIO_FROM"), to=to, body=body
    )
    return {"sid": msg.sid}`,
  TypeScript: `// Next.js — Google Maps geocode
export async function POST(req: Request) {
  const { address } = await req.json();
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", address);
  url.searchParams.set("key", process.env.GMAPS_KEY!);
  const r = await fetch(url);
  return Response.json(await r.json());
}`,
};

function Marquee({ items, direction = "left" }: { items: string[]; direction?: "left" | "right" }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div
        className={`flex gap-3 whitespace-nowrap ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
        style={{ width: "max-content" }}
      >
        {doubled.map((label, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--divider)] bg-[var(--surface)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--muted)]"
          >
            <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

const STEPS = [
  {
    n: "01",
    title: "You share your stack",
    body: "Send me your existing codebase or describe the framework and runtime you're on.",
  },
  {
    n: "02",
    title: "I plan the architecture",
    body: "Auth flow, rate limits, retries, error contracts — mapped before a line of code.",
  },
  {
    n: "03",
    title: "Delivered, documented",
    body: "Clean integration with tests, env config, and a README your team can hand off.",
  },
];

export function ApiIntegration() {
  const [lang, setLang] = useState<Lang>("Java");
  const cubeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      if (!cubeRef.current) return;
      const ctx = gsap.context(() => {
        gsap.from(cubeRef.current, {
          y: -100,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: cubeRef.current, start: "top 85%" },
        });
      });
      cleanup = () => ctx.revert();
    })();
    return () => cleanup?.();
  }, []);

  return (
    <section data-skew-target className="relative mx-auto max-w-[1280px] px-5 py-20 sm:px-6 md:px-12 md:py-[140px]">
      {/* Decor — rotating cube */}
      <div ref={cubeRef} aria-hidden className="pointer-events-none absolute right-6 top-24 hidden lg:block">
        <ApiCube />
      </div>

      {/* Header */}
      <div className="relative">
        <span
          aria-hidden
          data-bg-num
          className="pointer-events-none absolute -top-10 left-[-10px] select-none font-mono leading-none md:-top-16 md:left-[-12px]"
          style={{ color: "rgba(232,227,213,0.04)" }}
        >
          03
        </span>
        <p className="relative font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
          Integrations
        </p>
        <h2 className="relative mt-6 max-w-[820px] font-display leading-[1.05]" style={{ fontSize: "clamp(36px, 6vw, 56px)" }}>
          Any API. <span className="italic text-[var(--accent)]">Your language.</span> Your stack.
        </h2>
        <p className="relative mt-8 max-w-[640px] leading-relaxed text-[var(--muted)]" style={{ fontSize: "clamp(15px, 2vw, 18px)" }}>
          I integrate payment systems, AI models, maps, social platforms, and custom APIs into your
          existing product — using whatever language or framework you're already on.
        </p>
        <div className="relative mt-16 h-px w-full bg-[var(--divider)]" />
      </div>

      {/* Body */}
      <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 lg:grid-cols-12">
        {/* LEFT */}
        <div className="lg:col-span-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
            APIs I've worked with
          </p>

          <div className="mt-6 space-y-3">
            <Marquee items={ROW_1} direction="left" />
            <Marquee items={ROW_2} direction="right" />
          </div>

          {/* Languages */}
          <div className="mt-14">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Languages I deliver in
            </p>

             <div className="mt-5 flex flex-wrap gap-2 border-b border-[var(--divider)] pb-3">
              {LANGS.map((l) => {
                const active = lang === l;
                return (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`relative min-h-[44px] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
                      active ? "text-[var(--fg)]" : "text-[var(--muted)] hover:text-[var(--fg)]"
                    }`}
                  >
                    {l}
                    <span
                      className={`absolute -bottom-[13px] left-0 h-px bg-[var(--accent)] transition-all duration-500 ${
                        active ? "w-full" : "w-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-[var(--divider)] bg-[var(--surface)]">
              <div className="flex items-center justify-between border-b border-[var(--divider)] px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(232,227,213,0.15)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(232,227,213,0.1)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(232,227,213,0.07)]" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                  {lang.toLowerCase()}.snippet
                </span>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-[var(--fg)]/90 md:p-5 md:text-[12.5px]">
                <code>{SNIPPETS[lang]}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
            How it works
          </p>
          <div className="mt-6 space-y-2">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="group relative border-l border-[var(--divider)] py-6 pl-8 transition-colors hover:border-[var(--accent)]"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--muted)]">
                  Step {s.n}
                </span>
                <h3 className="mt-2 font-display text-[22px] leading-tight">{s.title}</h3>
                <p className="mt-2 max-w-[380px] text-[14px] leading-relaxed text-[var(--muted)]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          <a
            href="#contact"
            className="group mt-12 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg)]"
          >
            Need a specific API integrated? Tell me
            <ArrowRight
              size={14}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1 text-[var(--accent)]"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
