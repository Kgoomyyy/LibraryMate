"use client";

import { useEffect, useState } from "react";

export default function ViewBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = async () => {
    const res = await fetch(`/api/books?search=${search}&page=${page}`);
    const data = await res.json();
    setBooks(data.books);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchBooks();
  }, [search, page]);

  // ---------------- Get correct URLs ----------------
  const getCover = (path: string) =>
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/IMAGES/${path}`;

  const getPDF = (path: string) =>
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/books/${path}`;

  return (
    <div className="p-8">
      {/* Search */}
      <input
        placeholder="Search books..."
        className="border p-3 rounded w-full mb-8"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />

      {/* Books Grid */}
      <div className="grid grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
            <img
              src={getCover(book.cover_url)}
              className="w-full h-52 object-cover rounded mb-3"
              alt={book.title}
            />
            <h3 className="font-bold">{book.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{book.author}</p>

            <a
              href={getPDF(book.file_path)}
              target="_blank"
              className="mt-auto text-center bg-black text-white py-2 rounded hover:bg-zinc-800 transition"
            >
              Read PDF
            </a>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="border px-4 py-2 rounded"
        >
          Prev
        </button>

        <span className="font-semibold">
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="border px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}