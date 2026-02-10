"use client";

import { useState, useEffect } from "react";
import SignOutButton from "./Logout";

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

/* ---------- Sections ---------- */

function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/get-users");
    const data = await res.json();
    if (res.ok) setUsers(data.users);
    else console.error(data.error);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <AddUserButton fetchUsers={fetchUsers} />
      </div>

      <div className="bg-white rounded shadow p-6">
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                
                
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="p-2">{user.id}</td>
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role_id}</td>
                
                  
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function AddUserButton({ fetchUsers }: { fetchUsers: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [loading, setLoading] = useState(false);

  const handleAddUser = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/add-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role,password }),
    });
    const data = await res.json();
    if (res.ok) {
      fetchUsers();
      setShowForm(false);
      setPassword("");
      setEmail("");
      setRole("user");
    } else {
      console.error(data.error);
    }
    setLoading(false);
  };

  return (
    <>
      <button
        className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700"
        onClick={() => setShowForm(!showForm)}
      >
        Add New User
      </button>

      {showForm && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded w-full mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded w-full mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select
            className="border p-2 rounded w-full mb-2"
            value={role}
            onChange={(e) => setRole(e.target.value as "user" | "admin")}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleAddUser}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add User"}
          </button>
        </div>
      )}
    </>
  );
}

function ViewReports() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">View Reports</h1>
      <div className="bg-white rounded shadow p-6">
        <p>Reports and analytics will appear here.</p>
      </div>
    </>
  );
}


