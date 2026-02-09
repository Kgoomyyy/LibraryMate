"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Sign in using credentials
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else if (res?.ok) {
      // Fetch the session to get the user role
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();

      const role = sessionData?.user?.role;

      // Redirect based on role
      switch (role) {
        case "employee":
          router.push("/dashboard/employee");
          break;
        case "reader":
          router.push("dashboard/reader");
          break;
        case "admin":
          router.push("/dashboard/admin");
          break;
        default:
          router.push("/"); // fallback
          break;
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#FFECB3]">
      <h1 className="text-4xl font-bold mb-8">Login</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm bg-white p-8 rounded shadow"
      >
        <input
          type="email"
          placeholder="Email"
          className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-zinc-800 transition"
        >
          Login
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>

      <p className="mt-4 text-sm text-zinc-900">
        Don’t have an account yet?{" "}
        <Link href="/register" className="font-medium underline hover:text-black">
          Register
        </Link>
      </p>
    </main>
  );
}
