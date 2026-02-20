"use client";

import { useState } from "react";

export default function ManageBooks() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || !pdfFile || !coverFile) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("file", pdfFile);
    formData.append("cover", coverFile);

    const res = await fetch("/api/books", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.error) alert(data.error);
    else {
      alert("Book added successfully!");
      setTitle("");
      setAuthor("");
      setPdfFile(null);
      setCoverFile(null);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">Add New Book</h2>

      <form onSubmit={handleAddBook} className="bg-white p-8 rounded-xl shadow space-y-4">
        <input
          placeholder="Book Title"
          className="w-full border p-3 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          placeholder="Author"
          className="w-full border p-3 rounded"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />

        <div>
          <label className="text-sm font-semibold">Upload PDF</label>
          <input
            type="file"
            accept="application/pdf"
            className="w-full border p-2 rounded mt-1"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Upload Cover Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border p-2 rounded mt-1"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded font-semibold"
        >
          {loading ? "Uploading..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}