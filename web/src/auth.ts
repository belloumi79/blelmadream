import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { db } from "@/db"
import { users, accounts, sessions, verificationTokens } from "@/db/schema"
import { DrizzleAdapter } from "@auth/drizzle-adapter"

// Cast as any to work around the @auth/core dual-package version mismatch
// between @auth/drizzle-adapter and next-auth's bundled @auth/core.
const adapter = DrizzleAdapter(db, {
  usersTable: users as any,
  accountsTable: accounts as any,
  sessionsTable: sessions as any,
  verificationTokensTable: verificationTokens as any,
}) as any;

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // Owner email is always admin
        if (session.user.email === 'belloumi.karim.professional@gmail.com') {
          session.user.role = 'admin';
        } else {
          session.user.role = (user as any).role || 'user';
        }
        session.user.id = user.id;
      }
      return session;
    }
  }
})
