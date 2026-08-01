"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import OutputDisplay from "../dashboard/OutputDisplay";
import { Platform } from "../dashboard/ContentForm";

interface HistoryItem {
  _id: string;
  title: string;
  inputType: string;
  tone: string;
  createdAt: string;
  outputs: { platform: Platform; content: string }[];
  sourceUrl?: string;
  sourceFileName?: string;
}

const INPUT_TYPE_LABELS: Record<string, string> = {
  youtube: "🎥 YouTube",
  blog: "📝 Blog",
  audio: "🎙️ Audio",
};

const TONE_LABELS: Record<string, string> = {
  professional: "Professional",
  casual: "Casual",
  storytelling: "Storytelling",
  genz: "Gen-Z",
};

export default function HistoryClient() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [selected, setSelected] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/history");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load history");
        setItems(data.contents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Navbar */}
      <nav style={{
        background: "var(--surface)", borderBottom: "1px solid var(--border)",
        padding: "0 32px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span className="font-display" style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
            Repurpose<span style={{ color: "var(--primary)" }}>AI</span>
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/dashboard" style={{
            fontSize: 14, fontWeight: 500, color: "var(--text-muted)", textDecoration: "none"
          }}>
            New content
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
              fontSize: 13, fontWeight: 500, color: "var(--text-muted)",
              background: "var(--surface-2)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "6px 14px", cursor: "pointer"
            }}
          >
            Log out
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 className="font-display" style={{
            fontSize: 32, fontWeight: 700, color: "var(--text)", marginBottom: 8
          }}>
            Content history
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-muted)" }}>
            All your past generations, saved and ready to reuse.
          </p>
        </div>

        {loading && (
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Loading...</p>
        )}

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#DC2626"
          }}>
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div style={{
            textAlign: "center", padding: "60px 24px",
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 16
          }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>📭</p>
            <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 20 }}>
              No content generated yet.
            </p>
            <Link href="/dashboard" style={{
              background: "var(--primary)", color: "#fff", textDecoration: "none",
              padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600
            }}>
              Create your first piece →
            </Link>
          </div>
        )}

        {/* History grid */}
        {items.length > 0 && !selected && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16
          }}>
            {items.map((item) => (
              <button
                key={item._id}
                onClick={() => setSelected(item)}
                style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: 12, padding: 20, textAlign: "left", cursor: "pointer",
                  transition: "border-color 0.15s"
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--primary)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 500, color: "var(--text-muted)",
                    background: "var(--surface-2)", border: "1px solid var(--border)",
                    borderRadius: 6, padding: "3px 10px"
                  }}>
                    {INPUT_TYPE_LABELS[item.inputType] || item.inputType}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 style={{
                  fontSize: 14, fontWeight: 600, color: "var(--text)",
                  marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                }}>
                  {item.title}
                </h3>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {item.outputs.length} platform{item.outputs.length !== 1 ? "s" : ""}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {TONE_LABELS[item.tone] || item.tone}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Selected item detail view */}
        {selected && (
          <div>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 24, padding: "16px 20px",
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12
            }}>
              <div>
                <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
                  {selected.title}
                </h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                  {INPUT_TYPE_LABELS[selected.inputType]} · {TONE_LABELS[selected.tone]} · {new Date(selected.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  fontSize: 13, fontWeight: 500, color: "var(--text-muted)",
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  borderRadius: 8, padding: "6px 14px", cursor: "pointer"
                }}
              >
                ← Back
              </button>
            </div>
            <OutputDisplay result={{ contentId: selected._id, outputs: selected.outputs }} />
          </div>
        )}
      </main>
    </div>
  );
}