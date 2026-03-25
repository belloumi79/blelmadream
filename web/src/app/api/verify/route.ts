import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return redirect("/?error=missing_token");

  const [existingToken] = await db.select().from(verificationTokens).where(eq(verificationTokens.token, token));

  if (!existingToken || existingToken.expires < new Date()) {
    return redirect("/?error=invalid_token");
  }

  const [user] = await db.select().from(users).where(eq(users.email, existingToken.identifier));

  if (!user) return redirect("/?error=user_not_found");

  await db.update(users).set({ emailVerified: new Date() }).where(eq(users.id, user.id));
  await db.delete(verificationTokens).where(eq(verificationTokens.token, token));

  return redirect("/?success=email_verified");
}
