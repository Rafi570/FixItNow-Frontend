// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server"; // 👈 'next/request' এর বদলে 'next/server' হবে

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value;
//   const { pathname } = request.nextUrl;

//   // ইউজার অলরেডি লগইন অবস্থায় থাকলে তাকে /login বা /register এ ঢুকতে দিবে না
//   if (token && (pathname === "/login" || pathname === "/register")) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   // ইউজার লগইন না থাকলে প্রটেক্টেড রাউটগুলোতে ঢুকতে দিবে না
//   if (!token && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/login", "/register", "/dashboard/:path*", "/admin/:path*"],
// };



import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple helper to decode JWT payload without external library
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const user = token ? parseJwt(token) : null;
  const userRole = user?.role; // আপনার JWT-তে Role এর নাম role না হলে (যেমন: userRole) সেটি দিন

  // ১. ইউজার অলরেডি লগইন থাকলে /login বা /register এ ঢুকতে দিবে না
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ২. ইউজার লগইন না থাকলে প্রটেক্টেড রাউটে ঢুকতে দিবে না
  if (!token && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔒 3. Admin Route Protection (ক্যাটাগরি বা অ্যাডমিন প্যানেলে কেবল ADMIN ঢুকতে পারবে)
  if (pathname.startsWith("/dashboard/categories") || pathname.startsWith("/admin")) {
    if (userRole !== "ADMIN") {
      // Admin না হলে সাধারণ ড্যাশবোর্ড বা হোম পেজে রিডাইরেক্ট করবে
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login", 
    "/register", 
    "/dashboard/:path*", 
    "/admin/:path*"
  ],
};