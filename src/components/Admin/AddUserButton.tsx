"use client";

import { useState, useEffect } from "react";
import { FiUserPlus, FiChevronUp, FiChevronDown } from "react-icons/fi";

type Role = { id: number; role_name: string };

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

  useEffect(() => {
    fetch("/api/roles").then((r) => r.json()).then(setRoles).catch(console.error);
  }, []);

  const handleAddUser = async () => {
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/add_users", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role_id: roleId }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchUsers();
        setShowForm(false);
        setName(""); setEmail(""); setPassword(""); setConfirmPassword(""); setRoleId("");
      } else { setError(data.error || "Failed to add user"); }
    } catch { setError("Something went wrong"); }
    setLoading(false);
  };

  const formInputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", border: "1px solid #FFECB3", borderRadius: 8,
    fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#111",
    background: "#FFFDF5", outline: "none", boxSizing: "border-box",
  };

  const fieldLabel = (text: string) => (
    <label style={{ fontSize: 11, fontWeight: 600, color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "0.07em", display: "block", marginBottom: 4 }}>
      {text}
    </label>
  );

  return (
    <>
      {/* Toggle row */}
      <tr
        style={{ borderTop: "2px solid #FFECB3", background: "#FFFDF5", cursor: "pointer" }}
        onClick={() => setShowForm(!showForm)}
      >
        <td colSpan={5} style={{ padding: "13px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg, #FFCA28, #FFB300)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FiUserPlus size={13} color="#111" />
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#7a5c00" }}>
              Add New User
            </span>
            <span style={{ marginLeft: "auto", color: "#FFCA28" }}>
              {showForm ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
            </span>
          </div>
        </td>
      </tr>

      {/* Expandable form row */}
      {showForm && (
        <tr style={{ background: "#FFFBF0" }}>
          <td colSpan={5} style={{ padding: "20px 24px", borderTop: "1px solid #FFECB3" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 640 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                {fieldLabel("Full Name")}
                <input type="text" placeholder="e.g. Jane Smith" style={formInputStyle} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                {fieldLabel("Email")}
                <input type="email" placeholder="e.g. jane@example.com" style={formInputStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                {fieldLabel("Password")}
                <input type="password" placeholder="••••••••" style={formInputStyle} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div>
                {fieldLabel("Confirm Password")}
                <input type="password" placeholder="••••••••" style={formInputStyle} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <div>
                {fieldLabel("Role")}
                <select style={{ ...formInputStyle, cursor: "pointer" }} value={roleId} onChange={(e) => setRoleId(Number(e.target.value))} required>
                  <option value="">Select a role</option>
                  {roles.map((role) => <option key={role.id} value={role.id}>{role.role_name}</option>)}
                </select>
              </div>
              {error && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#c62828", fontWeight: 500 }}>⚠ {error}</p>
                </div>
              )}
              <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10, marginTop: 4 }}>
                <button
                  onClick={handleAddUser}
                  disabled={loading}
                  style={{ padding: "9px 24px", borderRadius: 8, border: "none", background: loading ? "#ccc" : "linear-gradient(135deg, #FFCA28, #FFB300)", color: "#111", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? "Adding..." : "Add User"}
                </button>
                <button
                  onClick={() => { setShowForm(false); setError(""); }}
                  style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid #e0e0e0", background: "#f5f5f5", color: "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default AddUserButton;