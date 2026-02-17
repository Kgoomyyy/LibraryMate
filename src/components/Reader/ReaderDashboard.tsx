"use client";

import { useState, useEffect } from "react";
import SignOutButton from "../Logout";
import AvailableBooks from "@/components/Reader/AvailableBooks";
import MyBooks from "../Reader/MyBooks";


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




/* ---------- MyBooks Section ---------- */
