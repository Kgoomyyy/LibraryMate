"use client";

import { FiSearch } from "react-icons/fi";

interface SearchProps {
  search: string;
  setSearch: (value: string) => void;
}

export default function Search({ search, setSearch }: SearchProps) {
  return (
    <div style={{ position: "relative", marginBottom: 28 }}>
      <span
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#FFCA28",
          fontSize: 16,
          pointerEvents: "none",
        }}
      >
        <FiSearch />
      </span>
      <input
        placeholder="Search books by title or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "11px 14px 11px 40px",
          border: "1px solid #FFECB3",
          borderRadius: 10,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          color: "#111",
          background: "#fff",
          outline: "none",
          boxSizing: "border-box",
          boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
        }}
      />
    </div>
  );
}