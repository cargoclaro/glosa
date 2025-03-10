"use server";

import { cookies } from "next/headers";
import { AuthRequiredError } from "@/app/shared/exceptions";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

const SESSION_SECRET = process.env["SESSION_SECRET"];
if (!SESSION_SECRET) throw new Error("SESSION_SECRET is not set");
const SESSION_SECRET_ENCODED = new TextEncoder().encode(SESSION_SECRET);

async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("http://localhost:3000")
    .setAudience("http://localhost:3000")
    .setExpirationTime("7d")
    .setJti(crypto.randomUUID())
    .sign(SESSION_SECRET_ENCODED);
}

async function decrypt(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, SESSION_SECRET_ENCODED, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function createUserSession(userId: string) {
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  const session = await encrypt({ userId, expires });
  cookies().set("glosa-session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export async function getSession() {
  const session = cookies().get("glosa-session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function isAuthenticated() {
  const session = await getSession();
  if (!session || !session["userId"]) {
    throw new AuthRequiredError();
  }
  return session;
}
