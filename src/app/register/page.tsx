"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaBookOpen } from "react-icons/fa";
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";

type Role = { id: number; role_name: string };

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleId, setRoleId] = useState<number | "">("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(false);

  useEffect(() => {
    fetch("/api/roles").then((r) => r.json()).then(setRoles);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role_id: roleId }),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Registration failed");
    else router.push("/login");
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

  const Field = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#FFCA28", fontSize: 15, pointerEvents: "none", zIndex: 1 }}>
        {icon}
      </span>
      {children}
    </div>
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFF8E7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
        <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #FFCA28, #FFB300)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(255,180,0,0.3)" }}>
          <FaBookOpen style={{ fontSize: 18, color: "#111" }} />
        </div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#111" }}>
          LibraryMate
        </span>
      </div>

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #F0E6C8",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          overflow: "hidden",
        }}
      >
        {/* Card header */}
        <div style={{ background: "#111", padding: "20px 28px", borderBottom: "4px solid #FFCA28" }}>
          <h1 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>
            Create Account
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            Fill in your details to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Full Name */}
          <Field icon={<FiUser />}>
            <input
              placeholder="Full Name"
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>

          {/* Email */}
          <Field icon={<FiMail />}>
            <input
              type="email"
              placeholder="Email address"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          {/* Password */}
          <Field icon={<FiLock />}>
            <input
              type="password"
              placeholder="Password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          {/* Confirm Password */}
          <Field icon={<FiLock />}>
            <input
              type="password"
              placeholder="Confirm Password"
              style={inputStyle}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Field>

          {/* Role */}
          <select
            style={{
              ...inputStyle,
              paddingLeft: 14,
              cursor: "pointer",
            }}
            value={roleId}
            onChange={(e) => setRoleId(Number(e.target.value))}
            required
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.role_name}</option>
            ))}
          </select>

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
            <FiUserPlus size={15} />
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>

      {/* Login link */}
      <p style={{ marginTop: 20, fontSize: 13, color: "#888" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "#FFB300", fontWeight: 600, textDecoration: "none" }}>
          Login
        </Link>
      </p>
    </main>
  );
}