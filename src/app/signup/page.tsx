"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/login?signup=success");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px"
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", marginBottom: 40 }}>
        <span className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>
          Repurpose<span style={{ color: "var(--primary-light)" }}>AI</span>
        </span>
      </Link>

      <div style={{
        width: "100%", maxWidth: 420,
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 16, padding: "40px 36px"
      }}>
        <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>
          Create your account
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 32 }}>
          Free forever. No credit card required.
        </p>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 8, padding: "12px 16px", marginBottom: 20,
            fontSize: 14, color: "#FCA5A5"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 8 }}>
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "var(--text)",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 8 }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "var(--text)",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 8 }}>
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "var(--text)",
                outline: "none"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", background: "var(--primary)", color: "#fff",
              border: "none", borderRadius: 8, padding: "12px",
              fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1, marginTop: 8,
              boxShadow: "0 0 20px var(--primary-glow)"
            }}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 24 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--primary-light)", textDecoration: "none", fontWeight: 500 }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}