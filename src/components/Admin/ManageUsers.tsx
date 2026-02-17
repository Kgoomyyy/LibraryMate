"use client";

import { useState, useEffect } from "react";
import AddUserButton from "./AddUserButton";


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

export default ManageUsers;
