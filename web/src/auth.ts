import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/db"
import { users, accounts, sessions, verificationTokens } from "@/db/schema"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

const adapter = DrizzleAdapter(db, {
  usersTable: users as any,
  accountsTable: accounts as any,
  sessionsTable: sessions as any,
  verificationTokensTable: verificationTokens as any,
}) as any;

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;
        if (!email || !password) return null;

        const [user] = await db.select().from(users).where(eq(users.email, email as string));
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password as string, user.password);
        return isValid ? user : null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role || 'user';
        token.id = user.id;
      }
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        
        // Hardcoded admin
        if (session.user.email === 'belloumi.karim.professional@gmail.com') {
          session.user.role = 'admin';
        }
      }
      return session;
    }
  }
})
