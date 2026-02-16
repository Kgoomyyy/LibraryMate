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
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([]);
  const { data: session } = useSession();
  const user_id = session?.user?.id;

  useEffect(() => {
    if (user_id) {
      fetchBooks();
      fetchUserBorrowedBooks();
    }
  }, [user_id]);

  const fetchBooks = async () => {
    const res = await fetch("/api/books?available=true");
    const data = await res.json();
    setBooks(data);
  };

  const fetchUserBorrowedBooks = async () => {
    try {
      const res = await fetch("/api/borrowed");
      const data = await res.json();
      if (Array.isArray(data)) {
        setBorrowedBooks(data);
      }
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
    }
  };

  const getBorrowedBook = (bookId: string) => {
    return borrowedBooks.find((item: any) => item.book_id === bookId);
  };

  const isBookOverdue = (dueDate: string): boolean => {
    return new Date() > new Date(dueDate);
  };

  const isOverdueAndBorrowed = (bookId: string): boolean => {
    const borrowedBook = getBorrowedBook(bookId);
    if (!borrowedBook) return false;
    return isBookOverdue(borrowedBook.due_date);
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

    fetchUserBorrowedBooks(); // update borrowed books list
    alert("Book borrowed!");
  };

  const handleExtend = (bookId: string) => {
    alert("Extend feature coming soon! Cost: R20 for 2 more weeks");
    // will implement extend logic later
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
              <div className="text-center">
                <div className="text-5xl">📄</div>
                <p className="text-xs text-gray-600 mt-2">
                  {book.file_path?.split("/").pop()}
                </p>
              </div>
            </div>
            <h3 className="font-bold mt-2">{book.title}</h3>
            <p>{book.author}</p>
            
            <div className="mt-2">
              {isOverdueAndBorrowed(book.id) ? (
                <button
                  onClick={() => handleExtend(book.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  title="Extend reading period for R20 (2 weeks)"
                >
                  Extend (+R20)
                </button>
              ) : (
                <button
                  onClick={() => handleBorrow(book.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-400"
                  disabled={book.quantity <= 0}
                >
                  Rent Book
                </button>
              )}
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

  // New: preview handler that respects overdue flag
  const handlePreviewWithCheck = async (book: any, isOverdueFlag: boolean) => {
    if (isOverdueFlag) {
      return alert("This book is overdue — preview is disabled.");
    }
    return handlePreview(book);
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
            {/* PDF Preview Box */}
            <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded">
              <div className="text-center">
                <div className="text-5xl">📄</div>
                <p className="text-xs text-gray-600 mt-2">
                  {item.books?.file_path?.split("/").pop()}
                </p>
              </div>
            </div>

            {/* Book Info */}
            <h3 className="font-bold mt-2">{item.books?.title}</h3>
            <p>{item.books?.author}</p>

            <p className="text-sm text-gray-600">
              Borrowed: {new Date(item.borrowed_at).toLocaleDateString()}
            </p>

            <p className={overdue ? "text-red-600 font-bold text-sm" : "text-sm"}>
              Access Expiry: {new Date(item.due_date).toLocaleDateString()}{" "}
              {overdue && "(Expired)"}
            </p>

              {/* Buttons */}
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handlePreviewWithCheck(item.books, overdue)}
                  disabled={overdue}
                  className={
                    overdue
                      ? "px-3 py-1 bg-gray-300 text-white rounded cursor-not-allowed"
                      : "px-3 py-1 bg-black text-white rounded"
                  }
                >
                  {loadingPreview ? "Loading..." : "Preview"}
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
