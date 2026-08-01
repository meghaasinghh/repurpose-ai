"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signupSuccess = searchParams.get("signup") === "success";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div style={{
      width: "100%", maxWidth: 420,
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 16, padding: "40px 36px"
    }}>
      <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>
        Welcome back
      </h1>
      <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 32 }}>
        Log in to your account
      </p>

      {signupSuccess && (
        <div style={{
          background: "rgba(124, 58, 237, 0.1)", border: "1px solid var(--primary)",
          borderRadius: 8, padding: "12px 16px", marginBottom: 20,
          fontSize: 14, color: "var(--primary-light)"
        }}>
          Account created! Please log in.
        </div>
      )}

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
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 24 }}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" style={{ color: "var(--primary-light)", textDecoration: "none", fontWeight: 500 }}>
          Sign up free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px"
    }}>
      <Link href="/" style={{ textDecoration: "none", marginBottom: 40 }}>
        <span className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>
          Repurpose<span style={{ color: "var(--primary-light)" }}>AI</span>
        </span>
      </Link>

      <Suspense fallback={
        <div style={{
          width: "100%", maxWidth: 420, background: "var(--surface)",
          border: "1px solid var(--border)", borderRadius: 16, padding: "40px 36px",
          textAlign: "center", color: "var(--text-muted)", fontSize: 14
        }}>
          Loading...
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}