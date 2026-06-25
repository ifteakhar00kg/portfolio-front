import { useState } from "react";
import { ENDPOINTS } from "../config/api";

export function CvDownloadButton({ className = "" }: { className?: string }) {
  const [toast, setToast] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      const res = await fetch(ENDPOINTS.cvDownload, { redirect: "follow" });
      if (!res.ok) throw new Error("not available");
      // Try to parse JSON { downloadUrl } else use response URL
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = (await res.json()) as { downloadUrl?: string; url?: string };
        const url = data.downloadUrl || data.url;
        if (!url) throw new Error("no url");
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        window.open(res.url || ENDPOINTS.cvDownload, "_blank", "noopener,noreferrer");
      }
    } catch {
      setToast("CV not available yet");
      setTimeout(() => setToast(null), 2400);
    }
  };

  return (
    <div className={`inline-flex flex-col items-start gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        className="cv-dl-btn"
        style={{
          background: "transparent",
          border: "none",
          borderBottom: "1px solid rgba(232,227,213,0.3)",
          color: "rgba(232,227,213,0.6)",
          fontFamily: "'DM Mono', monospace",
          fontSize: "12px",
          letterSpacing: "0.1em",
          padding: "4px 0",
          cursor: "pointer",
          transition: "color 200ms ease, border-color 200ms ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#E8E3D5";
          (e.currentTarget as HTMLButtonElement).style.borderBottomColor = "rgba(232,227,213,0.8)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(232,227,213,0.6)";
          (e.currentTarget as HTMLButtonElement).style.borderBottomColor = "rgba(232,227,213,0.3)";
        }}
      >
        Download CV ↓
      </button>
      {toast && (
        <span
          role="status"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: "rgba(232,227,213,0.5)",
          }}
        >
          {toast}
        </span>
      )}
    </div>
  );
}
