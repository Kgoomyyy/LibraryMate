"use client";

import { useState, useEffect } from "react";

function AddUserButton({ fetchUsers }: { fetchUsers: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddUser = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const role_id = role === "admin" ? 3 : 1; 

    const res = await fetch("/api/admin/add_users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        role_id,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      fetchUsers();
      setShowForm(false);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("user");
    } else {
      setError(data.error || "Failed to add user");
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
        <div className="mt-4 p-6 border rounded bg-gray-50 space-y-3 max-w-md">
          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="password"
              placeholder="Password"
              className="border p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="border p-2 rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <select
            className="border p-2 rounded w-full"
            value={role}
            onChange={(e) => setRole(e.target.value as "user" | "admin")}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleAddUser}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add User"}
          </button>
        </div>
      )}
    </>
  );
}

export default AddUserButton;