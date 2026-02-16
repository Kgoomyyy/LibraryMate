"use client";

import { useState, useEffect } from "react";
import SignOutButton from "./Logout";
import { useSession } from "next-auth/react";
import {auth} from "@/auth";
import BookReader from "@/components/BookReader";


export default function ReaderDashboard() {
  const [active, setActive] = useState<"available" | "my-books">("available");

  return (
    <main className="min-h-screen flex bg-[#FFECB3] text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Reader Dashboard</h2>

        <button
          onClick={() => setActive("available")}
          className={`text-left px-4 py-2 rounded mb-2 transition ${
            active === "available" ? "bg-zinc-800" : "hover:bg-zinc-800"
          }`}
        >
          Available Books
        </button>

        <button
          onClick={() => setActive("my-books")}
          className={`text-left px-4 py-2 rounded transition ${
            active === "my-books" ? "bg-zinc-800" : "hover:bg-zinc-800"
          }`}
        >
          My Books
        </button>

        <SignOutButton />
      </aside>

      {/* Content Area */}
      <section className="flex-1 p-8">
        {active === "available" && <AvailableBooks />}
        {active === "my-books" && <MyBooks />}
      </section>
    </main>
  );
}

/* ---------- AvailableBooks Section ---------- */
function AvailableBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const { data: session } = useSession();
  const user_id = session?.user?.id;

  useEffect(() => {
    if (user_id) fetchBooks();
  }, [user_id]);

  const fetchBooks = async () => {
    const res = await fetch("/api/books?available=true");
    const data = await res.json();
    setBooks(data);
  };

  const handleBorrow = async (bookId: string) => {
    if (!user_id) return alert("You must be logged in to borrow a book");

    const res = await fetch("/api/borrowed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, book_id: bookId }),
    });
    const data = await res.json();
    if (data.error) return alert(data.error);

    fetchBooks(); // update quantity after borrow
    alert("Book borrowed!");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Available Books</h2>
      <div className="grid grid-cols-4 gap-6">
        {books.length === 0 && (
          <p className="text-gray-600 col-span-4">No books available.</p>
        )}
        {books.map((book) => (
          <div key={book.id} className="bg-white p-4 rounded shadow">
            <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded">
              <p className="text-sm text-gray-600">{book.file_path?.split("/").pop()}</p>
            </div>
            <h3 className="font-bold mt-2">{book.title}</h3>
            <p>{book.author}</p>
            <p>Available: {book.quantity}</p>
            <div className="mt-2">
              <button
                onClick={() => handleBorrow(book.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
                disabled={book.quantity <= 0}
              >
                Borrow
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ---------- MyBooks Section ---------- */
function MyBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const { data: session } = useSession();
  const user_id = session?.user?.id;

  useEffect(() => {
    if (user_id) fetchMyBooks();
  }, [user_id]);

  const fetchMyBooks = async () => {
    try {
      const res = await fetch("/api/borrowed");
      const data = await res.json();
      if (Array.isArray(data)) setBooks(data);
      else setBooks([]);
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
    } catch (err) {
      alert("Failed to fetch preview");
    } finally {
      setLoadingPreview(false);
    }
  };



  // Handle returning a book
  const handleReturn = async (bookId: string) => {
    if (!user_id) return alert("You must be logged in to return a book");

    try {
      const res = await fetch("/api/return-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_id: bookId }),
      });

      const data = await res.json();
      if (data.error) return alert(data.error);

      let message = "Book returned successfully!";
      if (data.late_fee && data.late_fee > 0) {
        message += ` Late fee: ${data.late_fee} ZAR`;
      }

      alert(message);
      fetchMyBooks(); // refresh list after return
    } catch (err) {
      console.error(err);
      alert("Error returning book");
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date() > new Date(dueDate);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Books</h2>

      <div className="grid grid-cols-4 gap-6">
        {books.length === 0 ? (
          <p className="text-gray-600 col-span-4">
            No borrowed books yet.
          </p>
        ) : (
          books.map((item: any) => {
            const overdue = isOverdue(item.due_date);

            return (
              <div key={item.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold mt-2">{item.books?.title}</h3>
                <p>{item.books?.author}</p>
                <p>
                  Borrowed at: {new Date(item.borrowed_at).toLocaleDateString()}
                </p>
                <p className={overdue ? "text-red-600 font-bold" : ""}>
                  Due date: {new Date(item.due_date).toLocaleDateString()}{" "}
                  {overdue && "(Overdue)"}
                </p>

              <div className="mt-2 flex gap-2">
                  {/* PREVIEW BUTTON */}
                  <button
                    onClick={() => handlePreview(item.books)}
                    className="px-3 py-1 bg-black text-white rounded"
                  >
                    {loadingPreview ? "Loading..." : "Preview"}
                  </button>

                  {/* RETURN BUTTON */}
                  <button
                    onClick={() => handleReturn(item.book_id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Return
                  </button>
                </div>
                </div>
            
            );
          })
        )}
      </div>

      {showPreview && previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-6 z-50">
          <div className="bg-white w-full max-w-4xl h-[80vh] rounded overflow-auto p-4 relative">
            <button
              onClick={() => {
                setShowPreview(false);
                setPreviewUrl(null);
              }}
              className="absolute right-4 top-4 bg-red-500 text-white px-3 py-1 rounded"
            >
              Close
            </button>
            <div className="h-full">
              <BookReader file={previewUrl} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
