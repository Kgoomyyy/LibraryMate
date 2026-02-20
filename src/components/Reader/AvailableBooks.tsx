"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

function AvailableBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([]);
  const { data: session } = useSession();
  const user_id = session?.user?.id;

    const getCover = (path: string) =>
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/IMAGES/${path}`;

  useEffect(() => {
    if (user_id) {
      fetchBooks();
      fetchUserBorrowedBooks();
    }
  }, [user_id]);

  /* ---------------- FETCHING ---------------- */

const fetchBooks = async () => {
  const res = await fetch("/api/books");
  const data = await res.json();
  setBooks(data.books || []);
};

  const fetchUserBorrowedBooks = async () => {
    try {
      const res = await fetch("/api/borrowed");
      const data = await res.json();
      setBorrowedBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch borrowed books", err);
    }
  };

  /* ---------------- HELPERS ---------------- */

  const getBorrowedBook = (bookId: string) => {
    return borrowedBooks.find((b: any) => b.book_id === bookId);
  };

  const isExpired = (dueDate: string) => {
    return new Date() > new Date(dueDate);
  };

  /* ---------------- ACTIONS ---------------- */

  const handleBorrow = async (bookId: string) => {
    if (!user_id) return alert("Please log in first");

    const res = await fetch("/api/borrowed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, book_id: bookId }),
    });

    const data = await res.json();
    if (data.error) return alert(data.error);

    alert("Book rented successfully!");
    fetchUserBorrowedBooks();
  };

const handleExtend = async (bookId: string) => {
  const borrowed = getBorrowedBook(bookId);
  if (!borrowed) return;

  const confirmed = confirm("Pay R20 to extend reading access for 2 more weeks?");
  if (!confirmed) return;

  try {
    const res = await fetch("/api/extend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ borrowed_id: borrowed.id }),
    });

    const data = await res.json();
    if (data.error) return alert(data.error);

    alert("Payment successful. Access extended!");

    // Update local state so UI refreshes
    setBorrowedBooks(prev =>
      prev.map(b =>
        b.id === borrowed.id
          ? { 
              ...b, 
              extended: true, 
              date_extended: data.date_extended // <-- use API returned value
            }
          : b
      )
    );
  } catch (err) {
    console.error("Extend error:", err);
    alert("Something went wrong while extending the book.");
  }
};


  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Available Books</h2>

      <div className="grid grid-cols-4 gap-6">
        {books.length === 0 && (
          <p className="text-gray-600 col-span-4">No books available.</p>
        )}

        {books.map((book: any) => {
          const borrowed = getBorrowedBook(book.id);
          const expired = borrowed ? isExpired(borrowed.due_date) : false;

          return (
            <div key={book.id} className="bg-white p-4 rounded shadow">
              {/* Book Preview */}
          <img
              src={getCover(book.cover_url)}
              className="w-full h-52 object-cover rounded mb-3"
              alt={book.title}
            />

              {/* Book Info */}
              <h3 className="font-bold mt-2">{book.title}</h3>
              <p>{book.author}</p>

              {/* ------------------ EXTENSION DATE ------------------ */}
                {borrowed?.extended && borrowed?.date_extended && (
                  <p className="text-sm text-green-700 mt-1">
                    Extension date: {new Date(borrowed.date_extended).toLocaleDateString()}
                  </p>
                )}


              {/* Action Button */}
              <div className="mt-3">
                {borrowed ? (
                  expired ? (
                    <button
                      onClick={() => handleExtend(book.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Extend (+R20)
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-400 text-white px-3 py-1 rounded cursor-not-allowed"
                    >
                      Already Borrowed
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => handleBorrow(book.id)}
                    
                    className="bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-400"
                  >
                    Rent Book
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AvailableBooks;
