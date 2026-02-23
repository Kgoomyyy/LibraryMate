"use client";

import Link from "next/link";
import { FaBookOpen } from "react-icons/fa";
import { FiHome, FiInfo, FiMail, FiLogIn } from "react-icons/fi";

export default function Navbar() {
  return (
    <nav
      style={{
        width: "100%",
        backgroundColor: "#111",
        padding: "0 32px",
        boxShadow: "0 1px 0 rgba(255,255,255,0.06)",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        zIndex: 100,
      }}
    >
      {/* Amber top stripe */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, #FFCA28, #FFB300)",
        }}
      />

      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
          padding: "0 48px",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #FFCA28, #FFB300)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FaBookOpen style={{ color: "#111", fontSize: 15 }} />
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.01em",
            }}
          >
            LibraryMate
          </span>
        </Link>

        {/* Links */}
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {[
            { href: "/", label: "Home", icon: <FiHome /> },
            { href: "/about", label: "About", icon: <FiInfo /> },
            { href: "/contact", label: "Contact", icon: <FiMail /> },
          ].map(({ href, label, icon }) => (
            <li key={label}>
              <Link
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 8,
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  transition: "color 0.18s, background 0.18s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {icon}
                {label}
              </Link>
            </li>
          ))}

          {/* Login — styled as amber CTA */}
          <li style={{ marginLeft: 8 }}>
            <Link
              href="/login"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 18px",
                borderRadius: 8,
                background: "linear-gradient(135deg, #FFCA28, #FFB300)",
                color: "#111",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 700,
                transition: "opacity 0.18s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "0.85";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
              }}
            >
              <FiLogIn />
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}