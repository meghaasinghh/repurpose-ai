import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 40px", borderBottom: "1px solid var(--border)",
        position: "relative", zIndex: 10
      }}>
        <span className="font-display" style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
          Repurpose<span style={{ color: "var(--primary-light)" }}>AI</span>
        </span>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/login" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
            Log in
          </Link>
          <Link href="/signup" style={{
            background: "var(--primary)", color: "#fff", textDecoration: "none",
            padding: "8px 18px", borderRadius: 8, fontSize: 14, fontWeight: 600
          }}>
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero glow */}
      <div className="hero-glow" style={{ top: "10%", left: "50%", transform: "translateX(-50%)" }} />

      {/* Hero */}
      <main style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", padding: "100px 24px 80px", position: "relative", zIndex: 10
      }}>
        <div style={{
          display: "inline-block", background: "var(--surface-2)",
          border: "1px solid var(--border)", borderRadius: 999,
          padding: "6px 16px", marginBottom: 32, fontSize: 13,
          color: "var(--primary-light)", fontWeight: 500
        }}>
          ✦ Powered by Google Gemini 2.5 Flash
        </div>

        <h1 className="font-display" style={{
          fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 800,
          lineHeight: 1.05, maxWidth: 800, marginBottom: 24,
          color: "var(--text)"
        }}>
          One input.<br />
          <span style={{ color: "var(--primary-light)" }}>Every platform.</span>
        </h1>

        <p style={{
          fontSize: 18, color: "var(--text-muted)", maxWidth: 520,
          lineHeight: 1.7, marginBottom: 48
        }}>
          Paste a YouTube link, blog URL, or audio file — get a Twitter thread,
          LinkedIn post, Instagram caption, blog article, and email newsletter. Instantly.
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/signup" style={{
            background: "var(--primary)", color: "#fff", textDecoration: "none",
            padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 600,
            boxShadow: "0 0 24px var(--primary-glow)"
          }}>
            Start repurposing free →
          </Link>
          <Link href="/login" style={{
            background: "var(--surface-2)", color: "var(--text)", textDecoration: "none",
            padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 500,
            border: "1px solid var(--border)"
          }}>
            Log in
          </Link>
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 64, justifyContent: "center" }}>
          {[
            "🎥 YouTube transcripts",
            "🎙️ Audio transcription",
            "📝 Blog scraping",
            "🐦 Twitter threads",
            "💼 LinkedIn posts",
            "📸 Instagram captions",
            "✍️ SEO blog articles",
            "📧 Email newsletters",
          ].map((feature) => (
            <span key={feature} style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 999, padding: "8px 16px", fontSize: 13,
              color: "var(--text-muted)", fontWeight: 500
            }}>
              {feature}
            </span>
          ))}
        </div>

        {/* How it works */}
        <div style={{ marginTop: 100, width: "100%", maxWidth: 900 }}>
          <h2 className="font-display" style={{
            fontSize: 32, fontWeight: 700, marginBottom: 48, color: "var(--text)"
          }}>
            How it works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {[
              { step: "1", title: "Add your source", desc: "Paste a YouTube URL, blog link, or upload an MP3/WAV audio file." },
              { step: "2", title: "Choose your style", desc: "Pick a tone — professional, casual, storytelling, or Gen-Z." },
              { step: "3", title: "Select platforms", desc: "Check which platforms you want content for. All 5 or just one." },
              { step: "4", title: "Get your content", desc: "AI generates platform-optimized content in seconds. Copy and post." },
            ].map((item) => (
              <div key={item.step} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 12, padding: 24, textAlign: "left"
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: "var(--primary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 16
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 100, background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 16, padding: "60px 40px", maxWidth: 600, width: "100%"
        }}>
          <h2 className="font-display" style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>
            Ready to save hours every week?
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: 15 }}>
            Free to use. No credit card required.
          </p>
          <Link href="/signup" style={{
            background: "var(--primary)", color: "#fff", textDecoration: "none",
            padding: "14px 40px", borderRadius: 10, fontSize: 15, fontWeight: 600,
            display: "inline-block", boxShadow: "0 0 24px var(--primary-glow)"
          }}>
            Create your free account →
          </Link>
        </div>

        {/* Footer */}
        <footer style={{ marginTop: 80, color: "var(--text-muted)", fontSize: 13 }}>
          Built with Next.js · Google Gemini · AssemblyAI · MongoDB
        </footer>
      </main>
    </div>
  );
}