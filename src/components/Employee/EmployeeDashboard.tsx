"use client";

import { useState, useEffect } from "react";
import React from "react";
import { FaBookOpen } from "react-icons/fa";
import { FiBook, FiEye } from "react-icons/fi";
import SignOutButton from "../Logout";
import ManageBooks from "./ManageBooks";
import ViewBooks from "./ViewBooks";

type ActivePage = "manage" | "view";

export default function EmployeeDashboard() {
  const [active, setActive] = useState<ActivePage>("manage");
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const [session, setSession] = useState<any>(null);
  const [user_id, setUserId] = useState<string | null>(null);

  /* ---------------- SESSION FETCH ---------------- */
  const fetchSession = async () => {
    return fetch("/api/session")
      .then((res) => res.json())
      .then((data) => {
        setSession(data.session || null);
        setUserId(data.session?.user?.id || null);
      });
  };

  useEffect(() => { fetchSession(); }, []);

  useEffect(() => {
    if (user_id) console.log("Employee ID loaded:", user_id);
  }, [user_id]);

  /* ---------------- NAV BUTTON ---------------- */
  const navBtn = (key: ActivePage, icon: React.ReactNode, label: string) => {
    const isActive = active === key;
    const isHovered = hoveredBtn === key;
    return (
      <button
        onClick={() => setActive(key)}
        onMouseEnter={() => setHoveredBtn(key)}
        onMouseLeave={() => setHoveredBtn(null)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "11px 16px",
          borderRadius: 10,
          border: "none",
          background: isActive ? "rgba(255, 202, 40, 0.15)" : isHovered ? "rgba(255,255,255,0.06)" : "transparent",
          color: isActive ? "#FFCA28" : isHovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          width: "100%",
          transition: "background 0.18s, color 0.18s",
        }}
      >
        <span style={{ fontSize: 16, width: 20, display: "flex", alignItems: "center" }}>{icon}</span>
        {label}
        {isActive && (
          <span style={{ display: "block", width: 3, height: 16, background: "#FFCA28", borderRadius: 2, marginLeft: "auto" }} />
        )}
      </button>
    );
  };

  const pageTitles: Record<ActivePage, string> = {
    manage: "Manage Books",
    view: "View Books",
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          backgroundColor: "#FFF8E7",
          fontFamily: "'DM Sans', sans-serif",
          color: "#1a1a1a",
          margin: 0,
          padding: 0,
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            width: 260,
            flexShrink: 0,
            backgroundColor: "#111",
            color: "#f5f5f5",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Amber top stripe */}
          <div style={{ height: 4, background: "linear-gradient(90deg, #FFCA28, #FFB300)", flexShrink: 0 }} />

          {/* Header */}
          <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>


            {/* Welcome card */}
            <div style={{ background: "rgba(255,202,40,0.08)", border: "1px solid rgba(255,202,40,0.15)", borderRadius: 8, padding: "10px 12px" }}>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Welcome back
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: "#FFCA28" }}>
                {session?.user?.name || "Employee"}
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", padding: "0 12px", marginBottom: 8 }}>
              Books
            </div>
            {navBtn("manage", <FiBook />, "Manage Books")}
            {navBtn("view", <FiEye />, "View Books")}
          </nav>

          {/* Sign out */}
          <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <SignOutButton />
          </div>
        </aside>

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Top bar */}
          <div style={{ background: "#FFF8E7", borderBottom: "1px solid #FFECB3", padding: "18px 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 12, color: "#999", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Dashboard
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#111", marginTop: 2 }}>
                {pageTitles[active]}
              </div>
            </div>
            <span style={{ background: "#FFECB3", border: "1px solid #FFCA28", color: "#7a5c00", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, letterSpacing: "0.03em" }}>
              Employee
            </span>
          </div>

          {/* Content */}
          <section style={{ flex: 1, padding: 36, overflowY: "auto" }}>
            {active === "manage" && <ManageBooks />}
            {active === "view" && <ViewBooks />}
          </section>
        </div>
      </main>
    </>
  );
}