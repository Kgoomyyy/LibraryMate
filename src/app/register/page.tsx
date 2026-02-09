"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Role = {
  id: number;
  role_name: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleId, setRoleId] = useState<number | "">("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState("");

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      const res = await fetch("/api/roles");
      const data = await res.json();
      setRoles(data);
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        role_id: roleId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Registration failed");
    } else {
      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded shadow flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold text-center">Register</h1>

        <input
          type="email"
          placeholder="Email"
          className="border px-4 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border px-4 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="border px-4 py-2 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

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

        <button
          type="submit"
          className="bg-black text-white py-2 rounded hover:bg-zinc-800 transition"
        >
          Register
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <p className="text-sm text-center">
          Already registered?{" "}
          <Link href="/login" className="underline font-medium">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
