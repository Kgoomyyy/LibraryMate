"use client";

import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiBookOpen } from "react-icons/fi";
import Search from "../ui/search";
import Pagination from "../ui/pagination";

export default function ViewBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  

  const getCover = (path: string) =>
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/IMAGES/${path}`;

  const getPDF = (path: string) =>
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/books/${path}`;

  const fetchBooks = async () => {
    try {
      const res = await fetch(`/api/books?search=${searchQuery}&page=${page}`);
      const data = await res.json();
      setBooks(data.books || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setBooks([]);
      setTotalPages(1);
    }
  };

  // Fetch books whenever search query or page changes
  useEffect(() => {
    setPage(1); // reset page when search changes
  }, [searchQuery]);

  useEffect(() => {
    fetchBooks();
  }, [searchQuery, page]);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "0 16px" }}>
      {/* Search */}
      <Search search={searchQuery} setSearch={setSearchQuery} />

      {/* Books grid */}
      {books.length === 0 ? (
        <p style={{ color: "#aaa", fontSize: 14, textAlign: "center", marginTop: 60 }}>
          No books found.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 24,
          }}
        >
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "9px 0",
                    borderRadius: 8,
                    background:
                      hoveredBook === book.id
                        ? "#FFB300"
                        : "linear-gradient(135deg, #FFCA28, #FFB300)",
                    color: "#111",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "background 0.18s",
                  }}
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
    <Pagination
      page={page}
      totalPages={totalPages}
      onPageChange={(newPage) => setPage(newPage)}
    />
    </div>
  );
}