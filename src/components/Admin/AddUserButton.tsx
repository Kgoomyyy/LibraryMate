"use client";

import { useState, useEffect } from "react";

type Role = {
  id: number;
  role_name: string;
};

function AddUserButton({ fetchUsers }: { fetchUsers: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleId, setRoleId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch roles at the top level, not inside handleAddUser
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("/api/roles");
        const data = await res.json();
        setRoles(data);
      } catch (err) {
        console.error("Failed to fetch roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const handleAddUser = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/add_users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role_id: roleId,
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
        setRoleId("");
      } else {
        setError(data.error || "Failed to add user");
      }
    } catch (err) {
      setError("Something went wrong");
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
            className="border px-4 py-2 rounded"
            value={roleId}
            onChange={(e) => setRoleId(Number(e.target.value))}
            required
          >
            <option value="">Select role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role_name}
              </option>
            ))}
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
