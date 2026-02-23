"use client";

import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import AddUserButton from "./AddUserButton";

function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/get-users");
    const data = await res.json();
    if (res.ok) setUsers(data.users);
    else console.error(data.error);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleEdit = (user: any) => { setEditingId(user.id); setEditData(user); };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch("/api/admin/delete-user", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchUsers();
    } catch (err) { console.error("DELETE FAILED:", err); }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/admin/update-user", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editData) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEditingId(null);
      fetchUsers();
    } catch (err) { console.error("UPDATE FAILED:", err); }
  };

  const inputStyle: React.CSSProperties = {
    border: "1px solid #FFECB3", borderRadius: 6, padding: "5px 8px", width: "100%",
    fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#111", background: "#FFFDF5", outline: "none",
  };

  const btnStyle = (color: string, hoverColor: string, key: string, textColor = "#fff"): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 6, border: "none",
    background: hoveredBtn === key ? hoverColor : color, color: textColor,
    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "background 0.15s",
  });

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0E6C8", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#aaa", fontSize: 14 }}>Loading users...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#111", color: "rgba(255,255,255,0.6)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {["ID", "Name", "Email", "Role", "Actions"].map((h, i) => (
                  <th key={h} style={{ padding: "13px 16px", textAlign: i === 4 ? "center" : "left", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} style={{ background: idx % 2 === 0 ? "#fff" : "#FFFDF5", borderTop: "1px solid #F5EDD8" }}>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#aaa", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {editingId === user.id ? <input value={editData.id} disabled style={{ ...inputStyle, background: "#f5f5f5", color: "#aaa" }} /> : <span title={user.id}>{user.id?.slice(0, 8)}...</span>}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 14, color: "#111", fontWeight: 500 }}>
                    {editingId === user.id ? <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} style={inputStyle} /> : user.name}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#666" }}>
                    {editingId === user.id ? <input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} style={inputStyle} /> : user.email}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {editingId === user.id ? (
                      <input value={editData.role_id} onChange={(e) => setEditData({ ...editData, role_id: e.target.value })} style={inputStyle} />
                    ) : (
                      <span style={{ background: "#FFECB3", border: "1px solid #FFCA28", color: "#7a5c00", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.04em" }}>
                        {user.role_id}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                      {editingId === user.id ? (
                        <>
                          <button onClick={handleSave} onMouseEnter={() => setHoveredBtn(`save-${user.id}`)} onMouseLeave={() => setHoveredBtn(null)} style={btnStyle("#2e7d32", "#1b5e20", `save-${user.id}`)}>
                            <FiCheck size={12} /> Save
                          </button>
                          <button onClick={() => setEditingId(null)} onMouseEnter={() => setHoveredBtn(`cancel-${user.id}`)} onMouseLeave={() => setHoveredBtn(null)} style={btnStyle("#888", "#555", `cancel-${user.id}`)}>
                            <FiX size={12} /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(user)} onMouseEnter={() => setHoveredBtn(`edit-${user.id}`)} onMouseLeave={() => setHoveredBtn(null)} style={btnStyle("#FFCA28", "#FFB300", `edit-${user.id}`, "#111")}>
                            <FiEdit2 size={12} /> Update
                          </button>
                          <button onClick={() => handleDelete(user.id)} onMouseEnter={() => setHoveredBtn(`del-${user.id}`)} onMouseLeave={() => setHoveredBtn(null)} style={btnStyle("#c62828", "#b71c1c", `del-${user.id}`)}>
                            <FiTrash2 size={12} /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {/* Add User row — rendered as table rows from separate component */}
              <AddUserButton fetchUsers={fetchUsers} />
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;