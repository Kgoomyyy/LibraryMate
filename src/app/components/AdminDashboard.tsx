"use client";

import { useState } from "react";
import  SignOutButton from "./Logout"


export default function AdminDashboard() {
  const [active, setActive] = useState<"users" | "reports">("users");

  return (
    <main className="min-h-screen flex bg-[#FFECB3] text-black">

      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">
          Admin Dashboard
        </h2>

        <button
          onClick={() => setActive("users")}
          className={`text-left px-4 py-2 rounded mb-2 transition ${
            active === "users"
              ? "bg-zinc-800"
              : "hover:bg-zinc-800"
          }`}
        >
          Manage Users
        </button>

        <button
          onClick={() => setActive("reports")}
          className={`text-left px-4 py-2 rounded transition ${
            active === "reports"
              ? "bg-zinc-800"
              : "hover:bg-zinc-800"
          }`}
        >
          View Reports
        </button>

        <SignOutButton/>

      </aside>

      {/* Content Area */}
      <section className="flex-1 p-8">
        {active === "users" && <ManageUsers />}
        {active === "reports" && <ViewReports />}
      </section>

    </main>
  );
}

/* ---------- Sections ---------- */

function ManageUsers() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">
        Manage Users
      </h1>

      <div className="bg-white rounded shadow p-6">
        <p className="mb-4">
          This is where the admin will manage users.
        </p>

        <ul className="list-disc ml-6">
          <li>View all users</li>
          <li>Change user roles</li>
          <li>Deactivate accounts</li>
        </ul>
      </div>
    </>
  );
}

function ViewReports() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">
        View Reports
      </h1>

      <div className="bg-white rounded shadow p-6">
        <p>
          Reports and analytics will appear here.
        </p>
      </div>
    </>
  );
}
