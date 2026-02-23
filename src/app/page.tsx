
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { FaBookOpen } from "react-icons/fa";

export default function HomePage() {
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
        textAlign: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Icon badge */}
      <div
        style={{
          width: 64,
          height: 64,
          background: "linear-gradient(135deg, #FFCA28, #FFB300)",
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 28,
          boxShadow: "0 8px 24px rgba(255,180,0,0.3)",
        }}
      >
        <FaBookOpen style={{ fontSize: 28, color: "#111" }} />
      </div>

      {/* Heading */}
      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 48,
          fontWeight: 700,
          color: "#111",
          margin: "0 0 16px",
          lineHeight: 1.15,
          maxWidth: 600,
        }}
      >
        Welcome to{" "}
        <span style={{ color: "#FFB300" }}>LibraryMate</span>
      </h1>

      {/* Subtitle */}
      <p
        style={{
          maxWidth: 480,
          fontSize: 17,
          color: "#888",
          lineHeight: 1.7,
          margin: "0 0 40px",
          fontWeight: 400,
        }}
      >
        Discover new books, track borrowed ones, and explore our growing
        collection. Your next favorite book is waiting for you.
      </p>

      {/* CTA button */}
      <Link
        href="/login"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "13px 32px",
          borderRadius: 50,
          background: "linear-gradient(135deg, #FFCA28, #FFB300)",
          color: "#111",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15,
          fontWeight: 700,
          textDecoration: "none",
          boxShadow: "0 4px 16px rgba(255,180,0,0.35)",
          transition: "opacity 0.18s",
          letterSpacing: "0.02em",
        }}
      >
        Get Started
        <FiArrowRight size={16} />
      </Link>

      {/* Subtle footer note */}
      <p style={{ marginTop: 24, fontSize: 12, color: "#ccc", letterSpacing: "0.04em" }}>
        Sign in to access your library
      </p>
    </main>
  );
}