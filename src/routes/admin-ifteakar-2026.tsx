import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ENDPOINTS, API_BASE } from "../config/api";

export const Route = createFileRoute("/admin-ifteakar-2026")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin · IFTEAKAR." }, { name: "robots", content: "noindex,nofollow" }] }),
});

const SESSION_KEY = "ift_admin_unlocked";
const TOKEN_KEY = "ift_admin_token";
const CATEGORIES = ["Full Stack", "FRONTEND", "BACKEND"] as const;

type ProjectRow = {
  id: number;
  title: string;
  description?: string;
  techStack?: string;
  category?: string;
  year?: string;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
};

type CvInfo = { filename: string; uploadDate?: string; downloadUrl?: string };

const emptyForm = {
  title: "",
  description: "",
  techStack: "",
  category: "Full Stack",
  year: "",
  githubUrl: "",
  liveUrl: "",
  imageUrl: "",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0B0B0B",
  border: "1px solid rgba(232,227,213,0.3)",
  color: "#E8E3D5",
  padding: "10px 12px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  outline: "none",
  borderRadius: 8,
  cursor: "text", // Forces input fields to show text cursor
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'DM Mono', monospace",
  fontSize: 11,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "rgba(232,227,213,0.6)",
  marginBottom: 6,
};

function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);
  const [denied, setDenied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1") {
      setUnlocked(true);
    }
  }, []);

  const onUnlock = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim() || loading) return;

    setLoading(true);
    setDenied(false);

    try {
      const res = await fetch(ENDPOINTS.adminLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem(SESSION_KEY, "1");
        sessionStorage.setItem(TOKEN_KEY, data.token);
        setUnlocked(true);
      } else {
        setDenied(true);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      setDenied(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  if (!unlocked) {
    return (
      <div
        style={{ background: "#080808", color: "#E8E3D5", minHeight: "100vh" }}
        className="flex items-center justify-center px-5"
      >
        {/* Global Cursor Override style for Admin Page */}
        <style>{`
          body, html, * { cursor: auto !important; }
          @keyframes ift-shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
          .ift-shake { animation: ift-shake 0.45s ease; }
        `}</style>
        <form onSubmit={onUnlock} className="w-full max-w-[340px] text-center">
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, letterSpacing: "0.02em" }}>
            IFTEAKAR.
          </div>
          <div
            style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "rgba(232,227,213,0.5)", marginTop: 8, textTransform: "uppercase", letterSpacing: "0.2em" }}
          >
            Admin Access
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setDenied(false); }}
            placeholder="Password"
            className={shake ? "ift-shake" : ""}
            disabled={loading}
            style={{
              marginTop: 28,
              width: "100%",
              background: "#0B0B0B",
              border: "1px solid #E8E3D5",
              color: "#E8E3D5",
              padding: "12px 14px",
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              outline: "none",
              borderRadius: 4,
            }}
          />
          {denied && (
            <div style={{ marginTop: 10, fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#a85a5a" }}>
              Access denied.
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 20,
              background: "transparent",
              border: "none",
              color: "#E8E3D5",
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.2em",
              cursor: "pointer",
            }}
          >
            {loading ? "VERIFYING..." : "ENTER"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <AdminPanel
      onLogout={() => {
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        setUnlocked(false);
        setPassword("");
      }}
    />
  );
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  return (
    <div style={{ background: "#080808", color: "#E8E3D5", minHeight: "100vh" }}>
      {/* Global Cursor Override style for Admin Panel */}
      <style>{`
        body, html, * { cursor: auto !important; }
        .ift-fade-out { opacity: 0; transition: opacity 0.3s ease; }
        .ift-row { transition: opacity 0.3s ease; }
        button, a, select { cursor: pointer !important; }
      `}</style>
      <header
        style={{
          borderBottom: "1px solid rgba(232,227,213,0.1)",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.2em" }}>
          ADMIN PANEL
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link to="/" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(232,227,213,0.7)", textDecoration: "none", letterSpacing: "0.15em" }}>
            Back to site
          </Link>
          <button
            onClick={onLogout}
            style={{ background: "transparent", border: "1px solid rgba(232,227,213,0.3)", color: "#E8E3D5", padding: "6px 12px", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", cursor: "pointer", borderRadius: 4 }}
          >
            Log out
          </button>
        </div>
      </header>
      <main style={{ maxWidth: 880, margin: "0 auto", padding: "48px 24px 80px" }}>
        <CvManager />
        <div style={{ marginTop: 64, borderTop: "1px solid rgba(232,227,213,0.1)", paddingTop: 32 }} />
        <ProjectManager />
      </main>
    </div>
  );
}

function CvManager() {
  const [cv, setCv] = useState<CvInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const adminToken = sessionStorage.getItem(TOKEN_KEY) || "";

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(ENDPOINTS.cv);
      if (res.ok) {
        const data = (await res.json()) as CvInfo;
        setCv(data);
      } else {
        setCv(null);
      }
    } catch {
      setCv(null);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const upload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(ENDPOINTS.cvUpload, {
        method: "POST",
        headers: { "X-Admin-Token": adminToken },
        body: fd,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMsg({ kind: "ok", text: "CV uploaded successfully!" });
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      load();
    } catch (err) {
      setMsg({ kind: "err", text: `Upload failed. ${(err as Error).message}` });
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    if (!confirm("Delete current CV?")) return;
    try {
      const res = await fetch(ENDPOINTS.cv, {
        method: "DELETE",
        headers: { "X-Admin-Token": adminToken },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMsg({ kind: "ok", text: "CV deleted." });
      setCv(null);
    } catch (err) {
      setMsg({ kind: "err", text: `Delete failed. ${(err as Error).message}` });
    }
  };

  return (
    <section>
      <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, marginBottom: 4 }}>CV Manager</h1>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(232,227,213,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
        Current status
      </p>
      <div style={{ marginTop: 16, padding: "14px 16px", border: "1px solid rgba(232,227,213,0.1)", borderRadius: 8 }}>
        {loading ? (
          <div style={{ height: 20, background: "rgba(232,227,213,0.04)", borderRadius: 4 }} />
        ) : cv ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>{cv.filename}</div>
              {cv.uploadDate && (
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(232,227,213,0.5)", marginTop: 2 }}>
                  Uploaded {cv.uploadDate}
                </div>
              )}
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#7ec07e", marginTop: 4, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Current CV active
              </div>
            </div>
            <button
              onClick={remove}
              style={{ background: "transparent", border: "none", color: "#a85a5a", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", cursor: "pointer" }}
            >
              DELETE CV
            </button>
          </div>
        ) : (
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(232,227,213,0.5)" }}>
            No CV uploaded
          </div>
        )}
      </div>
      <form onSubmit={upload} style={{ marginTop: 20, display: "grid", gap: 12 }}>
        <label style={labelStyle}>Upload new CV (PDF)</label>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <label
            style={{
              display: "inline-block",
              padding: "10px 14px",
              border: "1px solid rgba(232,227,213,0.3)",
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 4,
            }}
          >
            Select PDF file
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              style={{ display: "none" }}
            />
          </label>
          {file && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(232,227,213,0.6)" }}>
              {file.name}
            </span>
          )}
          <button
            type="submit"
            disabled={!file || uploading}
            style={{
              background: "#E8E3D5",
              color: "#080808",
              border: "none",
              padding: "10px 16px",
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              cursor: !file || uploading ? "not-allowed" : "pointer",
              borderRadius: 4,
              opacity: !file || uploading ? 0.4 : 1,
            }}
          >
            {uploading ? "UPLOADING..." : "UPLOAD CV"}
          </button>
          {msg && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: msg.kind === "ok" ? "#7ec07e" : "#a85a5a" }}>
              {msg.text}
            </span>
          )}
        </div>
      </form>
    </section>
  );
}

function ProjectManager() {
  const [form, setForm] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ knd: "ok" | "err"; text: string } | null>(null);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<Record<number, boolean>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ProjectRow | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [flashId, setFlashId] = useState<number | null>(null);

  const adminToken = sessionStorage.getItem(TOKEN_KEY) || "";

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(ENDPOINTS.projects);
      if (res.ok) {
        const data = (await res.json()) as ProjectRow[];
        setProjects(Array.isArray(data) ? data : []);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { loadProjects(); }, []);

  const onChange = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const onEditChange = (k: keyof ProjectRow) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditForm((f) => (f ? { ...f, [k]: e.target.value } : f));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!form.title || !form.description || !form.techStack || !form.year) {
      setMsg({ knd: "err", text: "Please fill all required fields." });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(ENDPOINTS.projects, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": adminToken },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMsg({ knd: "ok", text: "Project added successfully!" });
      setForm({ ...emptyForm });
      loadProjects();
    } catch (err) {
      setMsg({ knd: "err", text: `Failed to add project. ${(err as Error).message}` });
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (p: ProjectRow) => {
    if (!confirm(`Delete ${p.title}?`)) return;
    setRemoving((r) => ({ ...r, [p.id]: true }));
    try {
      const res = await fetch(`${API_BASE}/api/v1/projects/${p.id}`, {
        method: "DELETE",
        headers: { "X-Admin-Token": adminToken },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setTimeout(() => {
        setProjects((arr) => arr.filter((x) => x.id !== p.id));
        setRemoving((r) => { const n = { ...r }; delete n[p.id]; return n; });
      }, 300);
    } catch (err) {
      alert(`Delete failed: ${(err as Error).message}`);
      setRemoving((r) => { const n = { ...r }; delete n[p.id]; return n; });
    }
  };

  const startEdit = (p: ProjectRow) => {
    setEditingId(p.id);
    setEditForm({ ...p });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    setSavingId(editForm.id);
    try {
      const res = await fetch(`${API_BASE}/api/v1/projects/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-Admin-Token": adminToken },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const id = editForm.id;
      setProjects((arr) => arr.map((p) => (p.id === id ? { ...p, ...editForm } : p)));
      setEditingId(null);
      setEditForm(null);
      setFlashId(id);
      setTimeout(() => setFlashId((f) => (f === id ? null : f)), 1600);
    } catch (err) {
      alert(`Save failed: ${(err as Error).message}`);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32 }}>Project Manager</h2>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "rgba(232,227,213,0.5)" }}>
          ({String(projects.length).padStart(2, "0")} projects)
        </span>
      </div>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(232,227,213,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>
        Add new project
      </p>
      <form onSubmit={submit} style={{ marginTop: 28, display: "grid", gap: 16 }}>
        <div>
          <label style={labelStyle}>Project Title *</label>
          <input style={inputStyle} value={form.title} onChange={onChange("title")} required />
        </div>
        <div>
          <label style={labelStyle}>Description *</label>
          <textarea style={{ ...inputStyle, resize: "vertical" }} rows={3} value={form.description} onChange={onChange("description")} required />
        </div>
        <div>
          <label style={labelStyle}>Tech Stack * (comma separated)</label>
          <input style={inputStyle} placeholder="Spring Boot, React, PostgreSQL" value={form.techStack} onChange={onChange("techStack")} required />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Category</label>
            <select style={inputStyle} value={form.category} onChange={onChange("category")}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Year *</label>
            <input style={inputStyle} value={form.year} onChange={onChange("year")} placeholder="2024" required />
          </div>
        </div>
        <div>
          <label style={labelStyle}>GitHub URL</label>
          <input style={inputStyle} value={form.githubUrl} onChange={onChange("githubUrl")} />
        </div>
        <div>
          <label style={labelStyle}>Live URL</label>
          <input style={inputStyle} value={form.liveUrl} onChange={onChange("liveUrl")} />
        </div>
        <div>
          <label style={labelStyle}>Image URL</label>
          <input style={inputStyle} value={form.imageUrl} onChange={onChange("imageUrl")} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
          <button
            type="submit"
            disabled={submitting}
            style={{ background: "#E8E3D5", color: "#080808", border: "none", padding: "12px 20px", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.2em", cursor: submitting ? "not-allowed" : "pointer", borderRadius: 4, opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? "ADDING..." : "ADD PROJECT"}
          </button>
          {msg && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: msg.knd === "ok" ? "#7ec07e" : "#a85a5a" }}>
              {msg.text}
            </span>
          )}
        </div>
      </form>
      <div style={{ marginTop: 64, borderTop: "1px solid rgba(232,227,213,0.1)", paddingTop: 32 }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(232,227,213,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Existing projects
        </p>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column" }}>
          {loading ? (
            [0, 1, 2].map((i) => (
              <div key={i} style={{ height: 56, background: "rgba(232,227,213,0.04)", borderRadius: 6, marginBottom: 10 }} />
            ))
          ) : projects.length === 0 ? (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(232,227,213,0.5)" }}>
              No projects yet. Add your first project above.
            </p>
          ) : (
            projects.map((p, i) => {
              const isEditing = editingId === p.id;
              return (
                <div
                  key={p.id}
                  className={`ift-row group/row ${removing[p.id] ? "ift-fade-out" : ""}`}
                  style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid rgba(232,227,213,0.08)",
                    borderRadius: "8px",
                    transition: "background-color 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isEditing) e.currentTarget.style.backgroundColor = "rgba(232,227,213,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(232,227,213,0.5)" }}>
                          {String(i + 1).padStart(2, "0")}.
                        </span>
                        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16 }}>{p.title}</span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(232,227,213,0.5)" }}>{p.year}</span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(232,227,213,0.4)", textTransform: "uppercase", letterSpacing: "0.15em" }}>{p.category}</span>
                        {flashId === p.id && (
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#7ec07e", letterSpacing: "0.15em" }}>
                            UPDATED!
                          </span>
                        )}
                      </div>
                      {!isEditing && (
                        <div style={{ marginTop: 4, fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(232,227,213,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.techStack}
                        </div>
                      )}
                    </div>
                    {!isEditing && (
                      <div style={{ display: "flex", gap: 16 }}>
                        <button
                          onClick={() => startEdit(p)}
                          style={{ background: "transparent", border: "none", color: "rgba(232,227,213,0.7)", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", cursor: "pointer" }}
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => onDelete(p)}
                          style={{ background: "transparent", border: "none", color: "#a85a5a", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", cursor: "pointer" }}
                        >
                          DELETE
                        </button>
                      </div>
                    )}
                  </div>
                  {isEditing && editForm && (
                    <form onSubmit={saveEdit} style={{ marginTop: 16, display: "grid", gap: 12, paddingTop: 12, borderTop: "1px dashed rgba(232,227,213,0.08)" }}>
                      <div>
                        <label style={labelStyle}>Title</label>
                        <input style={inputStyle} value={editForm.title ?? ""} onChange={onEditChange("title")} />
                      </div>
                      <div>
                        <label style={labelStyle}>Description</label>
                        <textarea style={{ ...inputStyle, resize: "vertical" }} rows={3} value={editForm.description ?? ""} onChange={onEditChange("description")} />
                      </div>
                      <div>
                        <label style={labelStyle}>Tech Stack</label>
                        <input style={inputStyle} value={editForm.techStack ?? ""} onChange={onEditChange("techStack")} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                          <label style={labelStyle}>Category</label>
                          <select style={inputStyle} value={editForm.category ?? "Full Stack"} onChange={onEditChange("category")}>
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Year</label>
                          <input style={inputStyle} value={editForm.year ?? ""} onChange={onEditChange("year")} />
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>GitHub URL</label>
                        <input style={inputStyle} value={editForm.githubUrl ?? ""} onChange={onEditChange("githubUrl")} />
                      </div>
                      <div>
                        <label style={labelStyle}>Live URL</label>
                        <input style={inputStyle} value={editForm.liveUrl ?? ""} onChange={onEditChange("liveUrl")} />
                      </div>
                      <div>
                        <label style={labelStyle}>Image URL</label>
                        <input style={inputStyle} value={editForm.imageUrl ?? ""} onChange={onEditChange("imageUrl")} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <button
                          type="submit"
                          disabled={savingId === p.id}
                          style={{ background: "#E8E3D5", color: "#080808", border: "none", padding: "10px 16px", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.2em", cursor: savingId === p.id ? "not-allowed" : "pointer", borderRadius: 4, opacity: savingId === p.id ? 0.6 : 1 }}
                        >
                          {savingId === p.id ? "SAVING..." : "SAVE CHANGES"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          style={{ background: "transparent", border: "none", color: "rgba(232,227,213,0.6)", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em", cursor: "pointer", textDecoration: "underline" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}