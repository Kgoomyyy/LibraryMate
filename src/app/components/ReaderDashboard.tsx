"use client";

import { useState, useEffect } from "react";
import SignOutButton from "./Logout";
import { useSession } from "next-auth/react";
import {auth} from "@/auth";

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
            <img
              src={book.image_url}
              className="w-full h-48 object-cover rounded"
              alt={book.title}
            />
            <h3 className="font-bold mt-2">{book.title}</h3>
            <p>{book.author}</p>
            <p>Available: {book.quantity}</p>
            <button
              onClick={() => handleBorrow(book.id)}
              className="bg-blue-600 text-white px-3 py-1 mt-2 rounded"
              disabled={book.quantity <= 0}
            >
              Borrow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- MyBooks Section ---------- */
function MyBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const { data: session } = useSession();
  const user_id = session?.user?.id;

  useEffect(() => {
    if (user_id) fetchMyBooks();
  }, [user_id]);
  
  const fetchMyBooks = async () => {
    const res = await fetch("/api/borrowed");
    const data = await res.json();
    setBooks(data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Books</h2>
      <div className="grid grid-cols-4 gap-6">
        {books.length === 0 && (
          <p className="text-gray-600 col-span-4">No borrowed books yet.</p>
        )}
        {books.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded shadow">
            <img
              src={item.books.image_url}
              className="w-full h-48 object-cover rounded"
              alt={item.books.title}
            />
            <h3 className="font-bold mt-2">{item.books.title}</h3>
            <p>{item.books.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
