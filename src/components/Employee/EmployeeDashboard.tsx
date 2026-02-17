"use client";

import { useState, useEffect } from "react";
import SignOutButton from "../Logout";
import ManageBooks from "./ManageBooks";
import ViewBooks from "./ViewBooks";


export default function EmployeeDashboard() {
  const [active, setActive] = useState<"manage" | "view">("manage");

  return (
    <main className="min-h-screen flex bg-[#FFECB3] text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Employee Dashboard</h2>

        <button
          onClick={() => setActive("manage")}
          className={`text-left px-4 py-2 rounded mb-2 transition ${
            active === "manage" ? "bg-zinc-800" : "hover:bg-zinc-800"
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

      {/* Content */}
      <section className="flex-1 p-8">
        {active === "manage" && <ManageBooks />}
        {active === "view" && <ViewBooks />}
      </section>
    </main>
  );
}

