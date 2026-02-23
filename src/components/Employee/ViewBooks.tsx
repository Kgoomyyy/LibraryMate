"use client";

import { useEffect, useState } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight, FiBookOpen } from "react-icons/fi";

export default function ViewBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [hoveredPrev, setHoveredPrev] = useState(false);
  const [hoveredNext, setHoveredNext] = useState(false);

  const fetchBooks = async () => {
    const res = await fetch(`/api/books?search=${search}&page=${page}`);
    const data = await res.json();
    setBooks(data.books);
    setTotalPages(data.totalPages);
  };

  useEffect(() => { fetchBooks(); }, [search, page]);

  const getCover = (path: string) =>
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/IMAGES/${path}`;

  const getPDF = (path: string) =>
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/books/${path}`;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Search bar */}
      <div style={{ position: "relative", marginBottom: 28 }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#FFCA28", fontSize: 16, pointerEvents: "none" }}>
          <FiSearch />
        </span>
        <input
          placeholder="Search books by title or author..."
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
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

      {/* Books grid */}
      {books.length === 0 ? (
        <p style={{ color: "#aaa", fontSize: 14, textAlign: "center", marginTop: 60 }}>No books found.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 24 }}>
          {books.map((book) => (
            <div
              key={book.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                border: "1px solid #F0E6C8",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Cover */}
              <div style={{ height: 200, overflow: "hidden", flexShrink: 0 }}>
                <img
                  src={getCover(book.cover_url)}
                  alt={book.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>

              {/* Info */}
              <div style={{ padding: "14px 14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111", lineHeight: 1.3 }}>
                  {book.title}
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#888" }}>{book.author}</p>

                <a
                  href={getPDF(book.file_path)}
                  target="_blank"
                  onMouseEnter={() => setHoveredBook(book.id)}
                  onMouseLeave={() => setHoveredBook(null)}
                  style={{
                    marginTop: "auto",
                    paddingTop: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "9px 0",
                    borderRadius: 8,
                    background: hoveredBook === book.id ? "#FFB300" : "linear-gradient(135deg, #FFCA28, #FFB300)",
                    color: "#111",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "background 0.18s",
                    
                  } as React.CSSProperties}
                >
                  <FiBookOpen size={13} />
                  Read PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 36 }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
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
            
          } as React.CSSProperties}
        >
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
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
    </div>
  );
}