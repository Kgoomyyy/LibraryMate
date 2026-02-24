"use client";

import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const [hoveredPrev, setHoveredPrev] = useState(false);
  const [hoveredNext, setHoveredNext] = useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 36 }}>
      <button
        disabled={page === 1}
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        onMouseEnter={() => setHoveredPrev(true)}
        onMouseLeave={() => setHoveredPrev(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 16px",
          borderRadius: 8,
          border: "1px solid #FFECB3",
          background: page === 1 ? "#f5f5f5" : hoveredPrev ? "#FFECB3" : "#fff",
          color: page === 1 ? "#ccc" : "#7a5c00",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          cursor: page === 1 ? "not-allowed" : "pointer",
          transition: "background 0.18s",
        }}
      >
        <FiChevronLeft size={15} /> Prev
      </button>

      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          color: "#888",
          padding: "8px 16px",
          background: "#FFECB3",
          borderRadius: 8,
          border: "1px solid #FFCA28",
        }}
      >
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        onMouseEnter={() => setHoveredNext(true)}
        onMouseLeave={() => setHoveredNext(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 16px",
          borderRadius: 8,
          border: "1px solid #FFECB3",
          background: page === totalPages ? "#f5f5f5" : hoveredNext ? "#FFECB3" : "#fff",
          color: page === totalPages ? "#ccc" : "#7a5c00",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          cursor: page === totalPages ? "not-allowed" : "pointer",
          transition: "background 0.18s",
        }}
      >
        Next <FiChevronRight size={15} />
      </button>
    </div>
  );
}