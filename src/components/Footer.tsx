import { useEffect, useState } from "react";
import { ENDPOINTS } from "../config/api";

type Status = {
  status?: string;
  database?: string;
  uptimeSeconds?: number;
  latencyMs?: number;
};

function SystemStatus() {
  const [data, setData] = useState<Status | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(ENDPOINTS.status);
        if (!res.ok) throw new Error("bad");
        const json = (await res.json()) as Status;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data && !failed) return null;
  const operational = data?.status === "OPERATIONAL";
  const label = failed
    ? "System Offline"
    : operational
      ? "System Operational"
      : "System Degraded";
  const dotColor = failed
    ? "#9CA3AF"
    : operational
      ? "#22C55E"
      : "#F59E0B";

  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.18em] text-[var(--muted)]"
      style={{ fontSize: "10px" }}
      title={
        data
          ? `DB ${data.database ?? "?"} · ${data.latencyMs ?? "?"}ms · up ${data.uptimeSeconds ?? "?"}s`
          : undefined
      }
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}` }}
      />
      {label}
    </span>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--divider)] px-6 py-10 md:px-12">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-6 md:grid-cols-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
          © 2026 Ifteakar. All rights reserved.
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] md:text-center">
          Dhaka, Bangladesh
        </div>
        <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] md:justify-end">
          <a
            href="https://github.com/ifteakhar00kg"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--fg)]"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/khandokar-ifteakar-ahmed/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--fg)]"
          >
            LinkedIn
          </a>
          <a
            href="mailto:contact@ifteakar.dev"
            className="transition-colors hover:text-[var(--fg)]"
          >
            Email
          </a>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1280px] flex-wrap items-center justify-between gap-4 border-t border-[var(--divider)] pt-6">
        <p
          className="font-mono uppercase tracking-[0.25em] text-[var(--muted)]"
          style={{ fontSize: "10px" }}
        >
          Built with React + Spring Boot
        </p>
        <SystemStatus />
      </div>
    </footer>
  );
}