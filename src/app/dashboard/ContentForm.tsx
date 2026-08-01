"use client";

import { useState } from "react";

export type InputType = "youtube" | "blog" | "audio";
export type Tone = "professional" | "casual" | "storytelling" | "genz";
export type Platform = "twitter" | "linkedin" | "instagram" | "blog" | "email";

export interface GenerationResult {
  contentId: string;
  outputs: { platform: Platform; content: string }[];
}

const PLATFORM_LABELS: Record<Platform, string> = {
  twitter: "Twitter Thread",
  linkedin: "LinkedIn Post",
  instagram: "Instagram Caption",
  blog: "Blog Article",
  email: "Email Newsletter",
};

const TONE_LABELS: Record<Tone, string> = {
  professional: "Professional",
  casual: "Casual",
  storytelling: "Storytelling",
  genz: "Gen-Z",
};

interface ContentFormProps {
  onResult: (result: GenerationResult) => void;
}

export default function ContentForm({ onResult }: ContentFormProps) {
  const [inputType, setInputType] = useState<InputType>("youtube");
  const [urlValue, setUrlValue] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [tone, setTone] = useState<Tone>("professional");
  const [platforms, setPlatforms] = useState<Platform[]>(["twitter", "linkedin"]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  function togglePlatform(platform: Platform) {
    setPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (platforms.length === 0) {
      setError("Please select at least one platform.");
      return;
    }
    if (inputType === "audio" && !audioFile) {
      setError("Please select an audio file.");
      return;
    }
    if (inputType !== "audio" && !urlValue.trim()) {
      setError(`Please enter a ${inputType === "youtube" ? "YouTube" : "blog"} URL.`);
      return;
    }

    setLoading(true);

    try {
      setStatusMessage("Extracting content...");
      let transcript = "";
      let title = "";
      let sourceUrl: string | undefined;
      let sourceFileName: string | undefined;

      if (inputType === "youtube") {
        const res = await fetch("/api/extract/youtube", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlValue }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to extract YouTube transcript");
        transcript = data.transcript;
        title = "YouTube Video";
        sourceUrl = urlValue;
      } else if (inputType === "blog") {
        const res = await fetch("/api/extract/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlValue }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to extract blog content");
        transcript = data.transcript;
        title = data.title || "Blog Article";
        sourceUrl = urlValue;
      } else if (inputType === "audio" && audioFile) {
        const formData = new FormData();
        formData.append("file", audioFile);
        const res = await fetch("/api/extract/audio", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to transcribe audio");
        transcript = data.transcript;
        title = audioFile.name;
        sourceFileName = audioFile.name;
      }

      if (!transcript) throw new Error("No content could be extracted.");

      setStatusMessage(`Generating for ${platforms.length} platform${platforms.length > 1 ? "s" : ""}... (${platforms.length * 10}–${platforms.length * 20}s)`);

      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, inputType, tone, title, sourceUrl, sourceFileName, platforms }),
      });
      const genData = await genRes.json();
      if (!genRes.ok) throw new Error(genData.error || "Failed to generate content");

      onResult(genData);
      setStatusMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatusMessage("");
    } finally {
      setLoading(false);
    }
  }

  const inputTypeButtons: { type: InputType; label: string }[] = [
    { type: "youtube", label: "🎥 YouTube" },
    { type: "blog", label: "📝 Blog URL" },
    { type: "audio", label: "🎙️ Audio File" },
  ];

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 16, padding: 32
    }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>

        {/* Input type */}
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Input source
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {inputTypeButtons.map(({ type, label }) => (
              <button
                key={type}
                type="button"
                onClick={() => setInputType(type)}
                style={{
                  padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                  cursor: "pointer", transition: "all 0.15s",
                  background: inputType === type ? "var(--primary)" : "var(--surface-2)",
                  color: inputType === type ? "#fff" : "var(--text-muted)",
                  border: inputType === type ? "1px solid var(--primary)" : "1px solid var(--border)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* URL / File input */}
        {inputType === "audio" ? (
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Audio file
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              style={{ fontSize: 14, color: "var(--text-muted)" }}
            />
          </div>
        ) : (
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {inputType === "youtube" ? "YouTube URL" : "Blog URL"}
            </label>
            <input
              type="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder={inputType === "youtube" ? "https://www.youtube.com/watch?v=..." : "https://example.com/blog-post"}
              style={{
                width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "11px 14px", fontSize: 14, color: "var(--text)",
                outline: "none"
              }}
            />
          </div>
        )}

        {/* Tone + Platforms row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              style={{
                width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "11px 14px", fontSize: 14, color: "var(--text)",
                outline: "none", cursor: "pointer"
              }}
            >
              {(Object.keys(TONE_LABELS) as Tone[]).map((t) => (
                <option key={t} value={t}>{TONE_LABELS[t]}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Platforms
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(Object.keys(PLATFORM_LABELS) as Platform[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  style={{
                    padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500,
                    cursor: "pointer",
                    background: platforms.includes(p) ? "rgba(124,58,237,0.1)" : "var(--surface-2)",
                    color: platforms.includes(p) ? "var(--primary)" : "var(--text-muted)",
                    border: platforms.includes(p) ? "1px solid var(--primary)" : "1px solid var(--border)",
                  }}
                >
                  {PLATFORM_LABELS[p]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#DC2626"
          }}>
            {error}
          </div>
        )}

        {statusMessage && (
          <div style={{
            background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "var(--primary)"
          }}>
            ⏳ {statusMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%", background: "var(--primary)", color: "#fff",
            border: "none", borderRadius: 10, padding: "14px",
            fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            boxShadow: "0 0 20px var(--primary-glow)"
          }}
        >
          {loading ? "Working on it..." : "Generate Content →"}
        </button>
      </form>
    </div>
  );
}