import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabase } from "@/app/lib/supabase";

 
export const { auth, handlers, signIn, signOut } = NextAuth({
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
        credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 1️⃣ Fetch the user by email
        const { data: user, error: userError } = await supabase
          .from("users")
          .select("id, email, password, role_id")
          .eq("email", credentials.email)
          .single();

        if (userError || !user) return null;

        // 2️⃣ Verify password
         const isValid = await bcrypt.compare(
         credentials.password as string,
        user.password as string
         );
        if (!isValid) return null;

        // 3️⃣ Fetch the role by role_id
        const { data: roleData, error: roleError } = await supabase
          .from("roles")
          .select("role_name")
          .eq("id", user.role_id)
          .single();

        if (roleError || !roleData) return null;

        // 4️⃣ Return user object to NextAuth
        return {
          id: user.id,
          email: user.email,
          role: roleData.role_name,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      
      return session;
    },
  },
});
  


