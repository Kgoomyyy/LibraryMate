"use client";

import { useState, useEffect } from "react";

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

export default ManageBooks;