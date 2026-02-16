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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});


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

      const handleEdit = (user: any) => {
      setEditingId(user.id);
      setEditData(user);
      };


     const handleDelete = async (id: string) => {
          const confirmDelete = confirm("Are you sure you want to delete this user?");
      if (!confirmDelete) return;

      try {
        const res = await fetch("/api/admin/delete-user", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }

        fetchUsers();
      } catch (err) {
        console.error("DELETE FAILED:", err);
      }
    };

    const handleSave = async () => {
  try {
    const res = await fetch("/api/admin/update-user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error);
    }

    setEditingId(null);
    fetchUsers();
  } catch (err) {
    console.error("UPDATE FAILED:", err);
  }
};


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
                <th className="p-2 text-start">ID</th>
                <th className="p-2 text-start">Name</th>
                <th className="p-2 text-start">Email</th>
                <th className="p-2 text-start">Role</th>
                 <th className="p-2 text-center">Actions</th>
                
                
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  
                  {/* ID */}
                  <td className="p-2">
                    {editingId === user.id ? (
                      <input
                        value={editData.id}
                        disabled
                        className="border p-1 rounded w-full bg-gray-100"
                      />
                    ) : (
                      user.id
                    )}
                  </td>

                  {/* NAME */}
                  <td className="p-2">
                    {editingId === user.id ? (
                      <input
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      user.name
                    )}
                  </td>

                  {/* EMAIL */}
                  <td className="p-2">
                    {editingId === user.id ? (
                      <input
                        value={editData.email}
                        onChange={(e) =>
                          setEditData({ ...editData, email: e.target.value })
                        }
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      user.email
                    )}
                  </td>

                  {/* ROLE */}
                  <td className="p-2">
                    {editingId === user.id ? (
                      <input
                        value={editData.role_id}
                        onChange={(e) =>
                          setEditData({ ...editData, role_id: e.target.value })
                        }
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      user.role_id
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-2">
                    <div className="flex gap-2 justify-center">
                      {editingId === user.id ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Save
                          </button>

                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            onClick={() => handleEdit(user)}
                          >
                            Update
                          </button>

                          <button
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
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


