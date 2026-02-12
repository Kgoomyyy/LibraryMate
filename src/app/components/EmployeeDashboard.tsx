"use client";

import { useState, useEffect } from "react";
import SignOutButton from "./Logout";


export default function EmployeeDashboard() {
  const [active, setActive] = useState<"manage" | "view">("manage");

  return (
    <main className="min-h-screen flex bg-[#FFECB3] text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Employee Dashboard</h2>

        <button
          onClick={() => setActive("manage")}
          className={`text-left px-4 py-2 rounded mb-2 transition ${
            active === "manage" ? "bg-zinc-800" : "hover:bg-zinc-800"
          }`}
        >
          Manage Books
        </button>

        <button
          onClick={() => setActive("view")}
          className={`text-left px-4 py-2 rounded transition ${
            active === "view" ? "bg-zinc-800" : "hover:bg-zinc-800"
          }`}
        >
          View Books
        </button>

        <SignOutButton />
      </aside>

      {/* Content */}
      <section className="flex-1 p-8">
        {active === "manage" && <ManageBooks />}
        {active === "view" && <ViewBooks />}
      </section>
    </main>
  );
}



function ManageBooks() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!file) {
      alert("Please upload a file");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("quantity", String(quantity));
    formData.append("file", file);

    const res = await fetch("/api/books", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
    } else {
      alert("Book added successfully!");
      setTitle("");
      setAuthor("");
      setQuantity(1);
      setFile(null);
    }

    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Add New Book</h2>

      <form
        onSubmit={handleAddBook}
        className="bg-white p-6 rounded shadow max-w-md"
      >
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 mb-4 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Author"
          className="w-full border p-2 mb-4 rounded"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Quantity"
          className="w-full border p-2 mb-4 rounded"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={0}
          required
        />

        <input
          type="file"
          accept="application/pdf,image/*"
          className="w-full border p-2 mb-4 rounded"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded hover:bg-zinc-800 transition"
        >
          {loading ? "Uploading..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}



function ViewBooks() {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const res = await fetch("/api/books");
    const data = await res.json();
    setBooks(data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Books</h2>

      <div className="grid grid-cols-4 gap-6">
        {books.length === 0 && (
          <p className="text-gray-600 col-span-4">No books found.</p>
        )}

        {books.map((book) => (
          <div key={book.id} className="bg-white p-4 rounded shadow">
            <img
              src={book.file_path}
              className="w-full h-48 object-cover rounded"
              alt={book.title}
            />
            <h3 className="font-bold mt-2">{book.title}</h3>
            <p>{book.author}</p>
            <p>Quantity: {book.quantity}</p>
            <p>Status: {book.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
