"use client";

import { useState, useEffect } from "react";
import BookReader from "../Reader/BookReader";

function ViewBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const res = await fetch("/api/books");
    const data = await res.json();
    setBooks(data);
  };

  const handlePreview = async (book: any) => {
    if (!book?.file_path) return;
    setLoadingPreview(true);
    try {
      const res = await fetch(
        `/api/storage-url?path=${encodeURIComponent(book.file_path)}`
      );
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Books</h2>

      <div className="grid grid-cols-4 gap-6">
        {books.length === 0 && (
          <p className="text-gray-600 col-span-4">No books found.</p>
        )}

        {books.map((book) => (
          <div key={book.id} className="bg-white p-4 rounded shadow">
            <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded">
              <p className="text-sm text-gray-600">{book.file_path?.split("/").pop()}</p>
            </div>
            <h3 className="font-bold mt-2">{book.title}</h3>
            <p>{book.author}</p>
            
            <p>Status: {book.status}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handlePreview(book)}
                className="bg-black text-white px-3 py-1 rounded hover:bg-zinc-800 transition"
              >
                {loadingPreview ? "Loading..." : "Preview"}
              </button>
            </div>
          </div>
        ))}
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

export default ViewBooks;