"use client"; // Make sure this runs on the client

import { signOut } from "next-auth/react";

interface SignOutButtonProps {
  redirectUrl?: string; // Optional prop to redirect after logout
  className?: string;   // Optional styling
}

export default function SignOutButton({
  redirectUrl = "/", 
  className = "mt-auto bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
}: SignOutButtonProps) {

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: redirectUrl });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button onClick={handleSignOut} className={className}>
      Sign Out
    </button>
    
  );
}


