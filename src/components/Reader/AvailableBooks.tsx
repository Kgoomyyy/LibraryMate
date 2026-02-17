"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

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

export default AvailableBooks;