import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "resto-secret-key-change-in-production"
);

export type SessionUser = {
  id: string;
  nom: string;
  email?: string | null;
  telephone?: string | null;
  role: "CLIENT" | "RESTAURATEUR" | "ADMIN";
};

export async function creerSession(user: SessionUser) {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return (payload as { user: SessionUser }).user;
  } catch {
    return null;
  }
}

export async function supprimerSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getSessionOuErreur(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) throw new Error("Non authentifié");
  return session;
}

export async function verifierRole(
  roles: SessionUser["role"][]
): Promise<SessionUser> {
  const session = await getSessionOuErreur();
  if (!roles.includes(session.role)) {
    throw new Error("Accès refusé");
  }
  return session;
}

export async function getRestaurantDuProprietaire(userId: string) {
  return prisma.restaurant.findUnique({
    where: { proprietaireId: userId },
  });
}
