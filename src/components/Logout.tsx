"use client";

import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";

interface SignOutButtonProps {
  redirectUrl?: string;
}

export default function SignOutButton({ redirectUrl = "/" }: SignOutButtonProps) {
  const [hovered, setHovered] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: redirectUrl });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.08)",
        background: hovered ? "rgba(255,255,255,0.06)" : "transparent",
        color: hovered ? "#fff" : "rgba(255,255,255,0.45)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
        transition: "background 0.18s, color 0.18s",
        textAlign: "left",
      }}
    >
      <FiLogOut style={{ fontSize: 15 }} />
      Sign Out
    </button>
  );
}