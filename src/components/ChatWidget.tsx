import { useEffect, useRef, useState } from "react";
import { Sparkles, X, ArrowUp } from "lucide-react";
import { ENDPOINTS } from "../config/api";

const SUGGESTED = [
  "What are his main skills?",
  "Has he worked with payment APIs?",
  "Is he available for freelance?",
  "What's his strongest tech stack?",
  "Can he integrate custom APIs?",
];

type Msg = { id: string; role: "user" | "assistant"; content: string };
const ERROR_TEXT =
  "My AI service is temporarily unavailable. Reach Ifteakar at contact@ifteakar.dev";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, busy]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
    const lenis = (window as unknown as { __lenis?: { stop?: () => void; start?: () => void } }).__lenis;
    if (open) lenis?.stop?.();
    else lenis?.start?.();
    return () => {
      lenis?.start?.();
    };
  }, [open]);

  const submit = async (text: string) => {
    const t = text.trim();
    if (!t || busy) return;

    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", content: t };
    const nextMsgs = [...messages, userMsg];
    setMessages(nextMsgs);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch(ENDPOINTS.chat, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMsgs.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as { reply?: string };
      const reply = data.reply?.trim() || ERROR_TEXT;

      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: "assistant", content: ERROR_TEXT },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-[var(--fg)]/40 bg-[#0F0F0F] text-[var(--fg)] shadow-2xl transition-transform hover:scale-105 md:bottom-6 md:right-6 md:h-[52px] md:w-[52px]"
      >
        {!open && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full border border-[var(--accent)]/40 animate-ping-slow"
          />
        )}
        <span
          className="relative transition-transform duration-300"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          {open ? (
            <X size={18} strokeWidth={1.5} />
          ) : (
            <Sparkles size={18} strokeWidth={1.5} className="text-[var(--accent)]" />
          )}
        </span>
      </button>

      <div
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className={`fixed bottom-[76px] right-5 z-[60] w-[calc(100vw-40px)] max-w-[380px] origin-bottom-right transition-all duration-300 ease-out md:bottom-[92px] md:right-6 md:w-[calc(100vw-48px)] ${
          open
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex h-[520px] max-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-2xl border border-[var(--divider)] bg-[#0B0B0B] shadow-2xl">
          <header className="flex items-start justify-between gap-3 border-b border-[var(--divider)] px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-[16px] leading-tight">Ask about Ifteakar</h3>
                <span className="rounded-full border border-[var(--accent)]/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent)]">
                  AI
                </span>
              </div>
              <p className="mt-1.5 text-[12px] leading-snug text-[var(--muted)]">
                Answers about skills, projects, availability &amp; rates.
              </p>
            </div>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-5 py-4"
            style={{
              scrollbarWidth: "none",
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                  Try asking
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTED.map((q) => (
                    <button
                      key={q}
                      onClick={() => submit(q)}
                      className="group rounded-full border border-[var(--divider)] bg-[var(--surface)] px-3.5 py-2 text-left text-[13px] text-[var(--fg)]/90 transition-colors hover:border-[var(--accent)]/50 hover:bg-[var(--surface-hover)]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => {
                  const isUser = m.role === "user";
                  return (
                    <div
                      key={m.id}
                      className={`flex animate-msg-in ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {isUser ? (
                        <div
                          className="user-message chat-message user chat-bubble-user"
                          data-role="user"
                          style={{
                            color: "rgba(232,227,213,0.65)",
                            fontSize: "13px",
                            textAlign: "right",
                            display: "block",
                            width: "100%",
                            fontFamily: "'DM Sans', sans-serif",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            border: "none",
                            background: "transparent",
                            backgroundColor: "transparent",
                            boxShadow: "none"
                          }}
                        >
                          {m.content}
                        </div>
                      ) : (
                        <div className="max-w-[85%] whitespace-pre-wrap break-words text-[14px] leading-relaxed text-[var(--fg)]/90">
                          {m.content}
                        </div>
                      )}
                    </div>
                  );
                })}

                {busy && (
                  <div className="flex justify-start animate-msg-in">
                    <span className="inline-flex items-center gap-1 text-[var(--muted)]">
                      <span className="dot-bounce" />
                      <span className="dot-bounce" style={{ animationDelay: "120ms" }} />
                      <span className="dot-bounce" style={{ animationDelay: "240ms" }} />
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
               submit(input);
            }}
            className="border-t border-[var(--divider)] px-3 py-3"
          >
            <div className="flex items-end gap-2 rounded-xl border border-[var(--divider)] bg-[var(--surface)] px-3 py-2 focus-within:border-[var(--accent)]/40">
              <textarea
  ref={inputRef}
  rows={1}
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  }}
  placeholder="Ask anything..."
  className="max-h-32 flex-1 resize-none bg-transparent py-1 text-[14px] leading-normal text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none align-middle"
  style={{ outline: "none", boxShadow: "none" }}
/>
              <button
                type="submit"
                disabled={!input.trim() || busy}
                aria-label="Send"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--fg)] text-[var(--bg)] transition-opacity disabled:opacity-30"
              >
                <ArrowUp size={14} strokeWidth={2} />
              </button>
            </div>
            <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Powered by AI • Answers about Ifteakar only
            </p>
          </form>
        </div>
      </div>
    </>
  );
}