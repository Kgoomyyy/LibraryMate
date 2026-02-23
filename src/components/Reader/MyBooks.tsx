"use client";

import { useState, useEffect } from "react";
import { FiBookOpen } from "react-icons/fi";
import { useSession } from "next-auth/react";
import BookReader from "@/components/Reader/BookReader";

function MyBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const { data: session } = useSession();
  const user_id = session?.user?.id;

  const getCover = (path: string) =>
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/IMAGES/${path}`;

  useEffect(() => {
    if (user_id) fetchMyBooks();

    let interval: NodeJS.Timeout | null = null;
    if (user_id) {
      interval = setInterval(() => fetchMyBooks(), 15000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [user_id]);

  const fetchMyBooks = async () => {
    try {
      const res = await fetch("/api/borrowed");
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setBooks([]);
    }
  };

  const handlePreview = async (book: any) => {
    if (!book?.file_path) return;
    setLoadingPreview(true);
    try {
      const res = await fetch(`/api/storage-url?path=${encodeURIComponent(book.file_path)}`);
      const data = await res.json();
      if (data?.url) {
        setPreviewUrl(data.url);
        setShowPreview(true);
      } else {
        alert(data?.error || "Could not load preview");
      }
    } catch {
      alert("Failed to fetch preview");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handlePreviewWithCheck = async (book: any, isOverdueFlag: boolean) => {
    if (isOverdueFlag) return alert("This book is overdue — preview is disabled.");
    return handlePreview(book);
  };

  const isOverdue = (dueDate: string) => new Date() > new Date(dueDate);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {books.length === 0 ? (
        <p style={{ color: "#999" }}>No borrowed books yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 24,
          }}
        >
          {books.map((item: any) => {
            const overdue = isOverdue(item.due_date);
            const btnKey = item.id;
            const isHovered = hoveredBtn === btnKey;

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  border: overdue ? "1px solid #FFCDD2" : "1px solid #F0E6C8",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Cover */}
                <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                  <img
                    src={getCover(item.books?.cover_url)}
                    alt={item.books?.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  {/* Status badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: overdue ? "rgba(198,40,40,0.85)" : "rgba(0,0,0,0.65)",
                      color: overdue ? "#fff" : "#FFCA28",
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 20,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {overdue ? "Expired" : "Active"}
                  </div>
                </div>

                {/* Info */}
                <div
                  style={{
                    padding: "16px 16px 20px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111", lineHeight: 1.3 }}>
                    {item.books?.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: 13, color: "#888" }}>{item.books?.author}</p>

                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#aaa" }}>
                      Borrowed: {new Date(item.borrowed_at).toLocaleDateString()}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        fontWeight: overdue ? 700 : 400,
                        color: overdue ? "#c62828" : "#888",
                      }}
                    >
                      Expires: {new Date(item.due_date).toLocaleDateString()}
                      {overdue && " (Expired)"}
                    </p>

                    {item.extended && item.date_extended && (
                      <p style={{ margin: 0, fontSize: 12, color: "#2e7d32", fontWeight: 500 }}>
                        Extended: {new Date(item.date_extended).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Button */}
                  <div style={{ marginTop: "auto", paddingTop: 14 }}>
                    <button
                      onClick={() => handlePreviewWithCheck(item.books, overdue)}
                      onMouseEnter={() => !overdue && setHoveredBtn(btnKey)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      disabled={overdue}
                      style={{
                        width: "100%",
                        padding: "9px 0",
                        borderRadius: 8,
                        border: "none",
                        background: overdue
                          ? "#f5f5f5"
                          : isHovered
                          ? "#FFB300"
                          : "linear-gradient(135deg, #FFCA28, #FFB300)",
                        color: overdue ? "#bbb" : "#111",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: overdue ? "not-allowed" : "pointer",
                        transition: "background 0.18s",
                      }}
                    >
                      {loadingPreview ? "Loading..." : overdue ? "Access Expired" : "Read Book"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Preview */}
      {showPreview && previewUrl && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "#1a1a1a",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Minimal top bar — fades into view on hover */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 15,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.02em",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FiBookOpen /> Reading
            </span>
            <button
              onClick={() => { setShowPreview(false); setPreviewUrl(null); }}
              style={{
                padding: "7px 18px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                backdropFilter: "blur(6px)",
                transition: "background 0.18s",
              }}
            >
              ✕ Close
            </button>
          </div>

          {/* Reader fills everything */}
          <div style={{ flex: 1, overflow: "auto" }}>
            <BookReader file={previewUrl} />
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBooks;