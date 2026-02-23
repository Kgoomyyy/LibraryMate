"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { FaBookOpen } from "react-icons/fa";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Login successful!");
      router.push("/login");
    }

    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px 11px 40px",
    border: "1px solid #FFECB3",
    borderRadius: 8,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: "#111",
    background: "#FFFDF5",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFF8E7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <Toaster position="top-center" />

      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
        <div
          style={{
            width: 40,
            height: 40,
            background: "linear-gradient(135deg, #FFCA28, #FFB300)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(255,180,0,0.3)",
          }}
        >
          <FaBookOpen style={{ fontSize: 18, color: "#111" }} />
        </div>
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22,
            fontWeight: 700,
            color: "#111",
          }}
        >
          LibraryMate
        </span>
      </div>

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #F0E6C8",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          overflow: "hidden",
        }}
      >
        {/* Card header */}
        <div
          style={{
            background: "#111",
            padding: "20px 28px",
            borderBottom: "4px solid #FFCA28",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            Sign In
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            Enter your credentials to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Email */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#FFCA28", fontSize: 15, pointerEvents: "none" }}>
              <FiMail />
            </span>
            <input
              type="email"
              placeholder="Email address"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#FFCA28", fontSize: 15, pointerEvents: "none" }}>
              <FiLock />
            </span>
            <input
              type="password"
              placeholder="Password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p style={{ margin: 0, fontSize: 12, color: "#c62828", fontWeight: 500 }}>⚠ {error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setHoveredBtn(true)}
            onMouseLeave={() => setHoveredBtn(false)}
            style={{
              width: "100%",
              padding: "11px 0",
              borderRadius: 8,
              border: "none",
              background: loading ? "#ccc" : hoveredBtn ? "#FFB300" : "linear-gradient(135deg, #FFCA28, #FFB300)",
              color: "#111",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.18s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 4,
            }}
          >
            <FiLogIn size={15} />
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>

      {/* Register link */}
      <p style={{ marginTop: 20, fontSize: 13, color: "#888" }}>
        Don't have an account yet?{" "}
        <Link
          href="/register"
          style={{ color: "#FFB300", fontWeight: 600, textDecoration: "none" }}
        >
          Register
        </Link>
      </p>
    </main>
  );
}