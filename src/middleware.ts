import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; // 👈 'next/request' এর বদলে 'next/server' হবে

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // ইউজার অলরেডি লগইন অবস্থায় থাকলে তাকে /login বা /register এ ঢুকতে দিবে না
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ইউজার লগইন না থাকলে প্রটেক্টেড রাউটগুলোতে ঢুকতে দিবে না
  if (!token && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*", "/admin/:path*"],
};