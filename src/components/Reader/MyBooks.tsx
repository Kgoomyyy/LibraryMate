"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {auth} from "@/auth";
import BookReader from "@/components/Reader/BookReader";

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

export default MyBooks;
