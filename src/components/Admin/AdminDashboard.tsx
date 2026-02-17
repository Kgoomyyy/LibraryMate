"use client";

import { useState, useEffect } from "react";
import SignOutButton from "../Logout";
import ManageUsers from "./ManageUsers";
import ViewReports from "./ViewReports";

export default function AdminDashboard() {
  const [active, setActive] = useState<"users" | "reports">("users");

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

        <SignOutButton />
      </aside>

      {/* Content Area */}
      <section className="flex-1 p-8">
        {active === "users" && <ManageUsers />}
        {active === "reports" && <ViewReports />}
      </section>
    </main>
  );
}

