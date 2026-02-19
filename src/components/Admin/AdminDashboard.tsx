"use client";

import { useState, useEffect } from "react";
import SignOutButton from "../Logout";
import ManageUsers from "./ManageUsers";
import ViewReports from "./ViewReports";
import ManageBooks from "../Employee/ManageBooks";
import ViewBooks from "../Employee/ViewBooks";


export default function AdminDashboard() {
  const [active, setActive] = useState<"users" | "books" | "view" | "reports">("users");

  return (
    <main className="min-h-screen flex bg-[#FFECB3] text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>

        <button
          onClick={() => setActive("users")}
          className={`text-left px-4 py-2 rounded mb-2 transition ${
            active === "users" ? "bg-zinc-800" : "hover:bg-zinc-800"
          }`}
        >
          Manage Users
        </button>

        <button
          onClick={() => setActive("reports")}
          className={`text-left px-4 py-2 rounded transition ${
            active === "reports" ? "bg-zinc-800" : "hover:bg-zinc-800"
          }`}
        >
          View Reports
        </button>

        <button
          onClick={() => setActive("books")}
          className={`text-left px-4 py-2 rounded mb-2 transition ${
            active === "books" ? "bg-zinc-800" : "hover:bg-zinc-800"
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

      {/* Content Area */}
      <section className="flex-1 p-8">
        {active === "users" && <ManageUsers />}
        {active === "books" && <ManageBooks/>}
        {active === "reports" && <ViewReports />}
        {active === "view" && <ViewBooks />}
      </section>
    </main>
  );
}

