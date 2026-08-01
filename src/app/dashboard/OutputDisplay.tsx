"use client";

import { useState } from "react";
import { GenerationResult, Platform } from "./ContentForm";

const PLATFORM_LABELS: Record<Platform, string> = {
  twitter: "Twitter Thread",
  linkedin: "LinkedIn Post",
  instagram: "Instagram Caption",
  blog: "Blog Article",
  email: "Email Newsletter",
};

const PLATFORM_EMOJI: Record<Platform, string> = {
  twitter: "🐦",
  linkedin: "💼",
  instagram: "📸",
  blog: "✍️",
  email: "📧",
};

function OutputCard({ platform, content }: { platform: Platform; content: string }) {
  const [copied, setCopied] = useState(false);
  const isFailed = content.startsWith("Generation failed");

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, overflow: "hidden"
    }}>
      {/* Card header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px", borderBottom: "1px solid var(--border)",
        background: "var(--surface-2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>{PLATFORM_EMOJI[platform]}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
            {PLATFORM_LABELS[platform]}
          </span>
        </div>
        {!isFailed && (
          <button
            onClick={handleCopy}
            style={{
              fontSize: 12, fontWeight: 500, padding: "5px 12px",
              borderRadius: 6, cursor: "pointer",
              background: copied ? "rgba(124,58,237,0.1)" : "var(--surface)",
              color: copied ? "var(--primary)" : "var(--text-muted)",
              border: "1px solid var(--border)"
            }}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        )}
      </div>

      {/* Card content */}
      <div style={{ padding: "20px", maxHeight: 400, overflowY: "auto" }}>
        {isFailed ? (
          <p style={{ fontSize: 14, color: "#DC2626" }}>{content}</p>
        ) : (
          <p style={{
            fontSize: 14, lineHeight: 1.8, color: "var(--text)",
            whiteSpace: "pre-wrap"
          }}>
            {content}
          </p>
        )}
      </div>
    </div>
  );
}

export default function OutputDisplay({ result }: { result: GenerationResult }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {result.outputs.map((output) => (
        <OutputCard key={output.platform} platform={output.platform} content={output.content} />
      ))}
    </div>
  );
}