"use client";

import { useState } from "react";
import { FiUpload, FiFileText, FiImage, FiBookOpen } from "react-icons/fi";

export default function ManageBooks() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [hoveredSubmit, setHoveredSubmit] = useState(false);

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
    const res = await fetch("/api/books", { method: "POST", body: formData });
    const data = await res.json();
    if (data.error) alert(data.error);
    else {
      alert("Book added successfully!");
      setTitle(""); setAuthor(""); setPdfFile(null); setCoverFile(null);
    }
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #FFECB3",
    borderRadius: 8,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: "#111",
    background: "#FFFDF5",
    outline: "none",
    boxSizing: "border-box",
  };

  const fieldLabel = (icon: React.ReactNode, text: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
      <span style={{ color: "#FFCA28", fontSize: 14 }}>{icon}</span>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "0.07em" }}>
        {text}
      </label>
    </div>
  );

  const FileInput = ({
    accept, file, onChange, icon, label,
  }: { accept: string; file: File | null; onChange: (f: File | null) => void; icon: React.ReactNode; label: string }) => (
    <div>
      {fieldLabel(icon, label)}
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          border: "1px dashed #FFCA28",
          borderRadius: 8,
          background: "#FFFDF5",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: file ? "#111" : "#bbb",
          transition: "border-color 0.18s",
        }}
      >
        <span style={{ color: "#FFCA28", fontSize: 16 }}><FiUpload /></span>
        {file ? file.name : `Click to upload ${label.toLowerCase()}`}
        <input
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          required
        />
      </label>
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ margin: 0, fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>Library</p>
        <h1 style={{ margin: "4px 0 0", fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#111" }}>
          Add New Book
        </h1>
      </div>

      {/* Form card */}
      <div
        style={{
          maxWidth: 520,
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #F0E6C8",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {/* Card header */}
        <div style={{ background: "#111", padding: "18px 24px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "linear-gradient(135deg, #FFCA28, #FFB300)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FiBookOpen size={14} color="#111" />
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>
            Book Details
          </span>
        </div>

        {/* Form body */}
        <form onSubmit={handleAddBook} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Title */}
          <div>
            {fieldLabel(<FiBookOpen />, "Book Title")}
            <input
              placeholder="e.g. The Great Gatsby"
              style={inputStyle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Author */}
          <div>
            {fieldLabel(<FiFileText />, "Author")}
            <input
              placeholder="e.g. F. Scott Fitzgerald"
              style={inputStyle}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          {/* PDF Upload */}
          <FileInput
            accept="application/pdf"
            file={pdfFile}
            onChange={setPdfFile}
            icon={<FiFileText />}
            label="PDF File"
          />

          {/* Cover Upload */}
          <FileInput
            accept="image/*"
            file={coverFile}
            onChange={setCoverFile}
            icon={<FiImage />}
            label="Cover Image"
          />

          {/* Divider */}
          <div style={{ borderTop: "1px solid #F0E6C8", margin: "4px 0" }} />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setHoveredSubmit(true)}
            onMouseLeave={() => setHoveredSubmit(false)}
            style={{
              width: "100%",
              padding: "11px 0",
              borderRadius: 8,
              border: "none",
              background: loading ? "#ccc" : hoveredSubmit ? "#FFB300" : "linear-gradient(135deg, #FFCA28, #FFB300)",
              color: "#111",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.18s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <FiUpload size={15} />
            {loading ? "Uploading..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
}