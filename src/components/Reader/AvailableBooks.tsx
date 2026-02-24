"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Search from "../ui/search";
import Pagination from "../ui/pagination";

function AvailableBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([]);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [session, setSession] = useState<any>(null);
  const [user_id, setUserId] = useState<string | null>(null);

  const getCover = (path: string) =>
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/IMAGES/${path}`;

  useEffect(() => {
    fetchSession();

    if (user_id) {
      fetchBooks();
      fetchUserBorrowedBooks();
      
    }
  }, [user_id]);


  const fetchSession = async () => {
    return fetch("/api/session")
      .then((res) => res.json())
      .then((data) => {
        setSession(data.session || null);
        setUserId(data.session?.user?.id || null);
      });
  };

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      setBooks(data.books || []);
    } catch (err) {
      console.error("Failed to fetch books", err);
    }
  };

  const fetchUserBorrowedBooks = async () => {
    try {
      const res = await fetch("/api/borrowed");
      const data = await res.json();
      setBorrowedBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch borrowed books", err);
    }
  };

  /* ---------------- HELPERS ---------------- */

  const getBorrowedBook = (bookId: string) =>
    borrowedBooks.find((b: any) => b.book_id === bookId);

  const isExpired = (dueDate: string) => new Date() > new Date(dueDate);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ---------------- ACTIONS ---------------- */

  const handleBorrow = async (bookId: string) => {
    if (!user_id) return alert("Please log in first");
    try {
      const res = await fetch("/api/borrowed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, book_id: bookId }),
      });
      const data = await res.json();
      if (data.error) return alert(data.error);
      alert("Book rented successfully!");
      fetchUserBorrowedBooks();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while borrowing the book.");
    }
  };

  const handleExtend = async (bookId: string) => {
    const borrowed = getBorrowedBook(bookId);
    if (!borrowed) return;
    const confirmed = confirm("Pay R20 to extend reading access for 2 more weeks?");
    if (!confirmed) return;
    try {
      const res = await fetch("/api/extend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrowed_id: borrowed.id }),
      });
      const data = await res.json();
      if (data.error) return alert(data.error);
      alert("Payment successful. Access extended!");
      setBorrowedBooks((prev) =>
        prev.map((b) =>
          b.id === borrowed.id
            ? { ...b, extended: true, date_extended: data.date_extended }
            : b
        )
      );
    } catch (err) {
      console.error("Extend error:", err);
      alert("Something went wrong while extending the book.");
    }
  };

  return (
    <div>
      {/* Search */}
      <Search search={searchQuery} setSearch={setSearchQuery} />

      {filteredBooks.length === 0 ? (
        <p style={{ color: "#999", fontFamily: "'DM Sans', sans-serif" }}>
          No books available.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 24,
          }}
        >
          {filteredBooks.map((book: any) => {
            const borrowed = getBorrowedBook(book.id);
            const expired = borrowed ? isExpired(borrowed.due_date) : false;
            const btnKey = book.id;
            const isHovered = hoveredBtn === btnKey;

            return (
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
                  transition: "box-shadow 0.2s",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {/* Cover */}
                <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                  <img
                    src={getCover(book.cover_url)}
                    alt={book.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  {borrowed && !expired && (
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        background: "rgba(0,0,0,0.65)",
                        color: "#FFCA28",
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 20,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      Borrowed
                    </div>
                  )}
                  {expired && borrowed && (
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        background: "rgba(220,50,50,0.85)",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 20,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      Expired
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: "16px 16px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#111",
                      lineHeight: 1.3,
                    }}
                  >
                    {book.title}
                  </h3>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 13,
                      color: "#888",
                      fontWeight: 400,
                    }}
                  >
                    {book.author}
                  </p>

                  {borrowed?.extended && borrowed?.date_extended && (
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: 12,
                        color: "#2e7d32",
                        fontWeight: 500,
                      }}
                    >
                      Extended until: {new Date(borrowed.date_extended).toLocaleDateString()}
                    </p>
                  )}

                  <div style={{ marginTop: "auto", paddingTop: 14 }}>
                    {borrowed ? (
                      expired ? (
                        <button
                          onClick={() => handleExtend(book.id)}
                          onMouseEnter={() => setHoveredBtn(btnKey)}
                          onMouseLeave={() => setHoveredBtn(null)}
                          style={{
                            width: "100%",
                            padding: "9px 0",
                            borderRadius: 8,
                            border: "none",
                            background: isHovered
                              ? "#FFB300"
                              : "linear-gradient(135deg, #FFCA28, #FFB300)",
                            color: "#111",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "background 0.18s",
                          }}
                        >
                          Extend (+R20)
                        </button>
                      ) : (
                        <button
                          disabled
                          style={{
                            width: "100%",
                            padding: "9px 0",
                            borderRadius: 8,
                            border: "1px solid #e0e0e0",
                            background: "#f5f5f5",
                            color: "#aaa",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "not-allowed",
                          }}
                        >
                          Already Borrowed
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => handleBorrow(book.id)}
                        onMouseEnter={() => setHoveredBtn(btnKey)}
                        onMouseLeave={() => setHoveredBtn(null)}
                        style={{
                          width: "100%",
                          padding: "9px 0",
                          borderRadius: 8,
                          border: "none",
                          background: isHovered
                            ? "#FFB300"
                            : "linear-gradient(135deg, #FFCA28, #FFB300)",
                          color: "#111",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "background 0.18s",
                          letterSpacing: "0.02em",
                        }}
                      >
                        Rent Book
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          
        </div>

        
      )}

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

export default AvailableBooks;