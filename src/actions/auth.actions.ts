"use server";

import { cookies } from "next/headers";
import { LoginResponse } from "../types/auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Email and password are required" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

  try {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // 👈 কুকি বা সেশন আদান-প্রদানের জন্য এটি অত্যন্ত জরুরি!
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Invalid credentials. Please try again.",
      };
    }

    const data = result as LoginResponse;

    // Next.js-এর নিজের HttpOnly Cookie-তে AccessToken সেভ করে রাখুন
    const cookieStore = await cookies();
    cookieStore.set("token", data.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return { success: true, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}