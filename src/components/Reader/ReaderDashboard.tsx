"use client";

import { useState, useEffect } from "react";
import React from "react";
import { FiSearch, FiBookOpen } from "react-icons/fi";
import SignOutButton from "../Logout";
import AvailableBooks from "@/components/Reader/AvailableBooks";
import MyBooks from "../Reader/MyBooks";

export default function ReaderDashboard() {
  const [active, setActive] = useState<"available" | "my-books">("available");
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const [session, setSession] = useState<any>(null);
  const [user_id, setUserId] = useState<string | null>(null);

  const navBtn = (
    key: "available" | "my-books",
    icon: React.ReactNode,
    label: string
  ) => {
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
          background: isActive
            ? "rgba(255, 202, 40, 0.15)"
            : isHovered
            ? "rgba(255,255,255,0.06)"
            : "transparent",
          color: isActive
            ? "#FFCA28"
            : isHovered
            ? "rgba(255,255,255,0.9)"
            : "rgba(255,255,255,0.55)",
          fontSize: 14,
          cursor: "pointer",
          width: "100%",
        }}
      >
        <span style={{ fontSize: 16, width: 20 }}>{icon}</span>
        {label}
      </button>
    );
  };

  /* ---------------- SESSION FETCH ---------------- */

  const fetchSession = async () => {
    return fetch("/api/session")
      .then((res) => res.json())
      .then((data) => {
        setSession(data.session || null);
        setUserId(data.session?.user?.id || null);
      });
  };

  /* ---------------- LOAD SESSION ---------------- */

  useEffect(() => {
    fetchSession();
  }, []);

  /* ---------------- LOAD BOOKS WHEN USER READY ---------------- */

  useEffect(() => {
    if (user_id) {
      console.log("User ID loaded:", user_id);
    }
  }, [user_id]);

  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          backgroundColor: "#FFF8E7",
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            width: 260,
            backgroundColor: "#111",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
          }}
        >
            <div
            style={{
              padding: "28px 24px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
   

            {/* Welcome card */}
            <div
              style={{
                background: "rgba(255,202,40,0.08)",
                border: "1px solid rgba(255,202,40,0.15)",
                borderRadius: 8,
                padding: "10px 12px",
              }}
            >
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Welcome back
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: "#FFCA28" }}>
                {session?.user?.name || "Admin"}
              </p>
            </div>
          </div>


          {/* Nav */}
          <nav style={{ padding: 16 }}>
            {navBtn("available", <FiSearch />, "Available Books")}
            {navBtn("my-books", <FiBookOpen />, "My Books")}
          </nav>

          <div style={{ marginTop: "auto", padding: 16 }}>
            <SignOutButton />
          </div>
        </aside>

        {/* Content */}
        <div style={{ flex: 1, padding: 36 }}>
          <h2>
            {active === "available" ? "Available Books" : "My Books"}
          </h2>

          {active === "available" && <AvailableBooks />}
          {active === "my-books" && <MyBooks />}
        </div>
      </main>
    </>
  );
}