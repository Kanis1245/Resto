import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "resto-secret-key-change-in-production"
);

const ROUTES_PROTEGEES_CLIENT = ["/panier", "/commandes", "/profil"];
const ROUTES_PROTEGEES_RESTAURANT = ["/dashboard"];
const ROUTES_AUTH = ["/connexion", "/inscription"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("session")?.value;
  let session = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      session = (payload as { user: { role: string } }).user;
    } catch {
      /* token invalide */
    }
  }

  if (ROUTES_AUTH.some((r) => pathname.startsWith(r))) {
    if (session) {
      return NextResponse.redirect(new URL("/restaurants", request.url));
    }
    return NextResponse.next();
  }

  if (ROUTES_PROTEGEES_CLIENT.some((r) => pathname.startsWith(r))) {
    if (!session) {
      return NextResponse.redirect(
        new URL(`/connexion?redirect=${pathname}`, request.url)
      );
    }
    return NextResponse.next();
  }

  if (ROUTES_PROTEGEES_RESTAURANT.some((r) => pathname.startsWith(r))) {
    if (!session) {
      return NextResponse.redirect(
        new URL(`/connexion?redirect=${pathname}`, request.url)
      );
    }
    if (session.role !== "RESTAURATEUR" && session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/restaurants", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/panier/:path*",
    "/commandes/:path*",
    "/profil/:path*",
    "/dashboard/:path*",
    "/connexion",
    "/inscription",
  ],
};
