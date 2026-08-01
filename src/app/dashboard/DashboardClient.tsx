"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import ContentForm, { GenerationResult } from "./ContentForm";
import OutputDisplay from "./OutputDisplay";

export default function DashboardClient({ userName }: { userName: string }) {
  const [result, setResult] = useState<GenerationResult | null>(null);

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
          <Link href="/history" style={{
            fontSize: 14, fontWeight: 500, color: "var(--text-muted)",
            textDecoration: "none"
          }}>
            History
          </Link>
          <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
            Hi, {userName}
          </span>
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
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 className="font-display" style={{
            fontSize: 32, fontWeight: 700, color: "var(--text)", marginBottom: 8
          }}>
            Create content
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6 }}>
            Paste a YouTube link, blog URL, or upload an audio file — get content for every platform instantly.
          </p>
        </div>

        {/* Form */}
        <ContentForm onResult={(r) => {
          setResult(r);
          setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
          }, 100);
        }} />

        {/* Output */}
        {result && (
          <div style={{ marginTop: 48 }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 24
            }}>
              <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>
                Generated content
              </h2>
              <button
                onClick={() => setResult(null)}
                style={{
                  fontSize: 13, color: "var(--text-muted)", background: "none",
                  border: "none", cursor: "pointer"
                }}
              >
                Clear
              </button>
            </div>
            <OutputDisplay result={result} />
          </div>
        )}
      </main>
    </div>
  );
}