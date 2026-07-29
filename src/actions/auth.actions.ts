"use server";

import { cookies } from "next/headers";
import { ActionResponse, LoginResponse, RegisterResponse } from "../types/auth";

// ১. গ্লোবালি Base URL ডিক্লেয়ার করুন dynamic env থেকে
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export async function registerAction(formData: FormData): Promise<ActionResponse> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { success: false, message: "Name, email, and password are required" };
  }

  try {
    const res = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
      cache: "no-store",
    });

    const result: RegisterResponse = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Registration failed. Please try again.",
      };
    }

    return { success: true, message: result.message };
  } catch (error: unknown) {
    console.error("REGISTER_ACTION_ERROR:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  // 'token' নামের কুকিটি ব্রাউজার এবং সার্ভার উভয় জায়গা থেকে ডিলেট করে দিবে
  cookieStore.delete("token");
  return { success: true };
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Email and password are required" };
  }

  try {
    // 👈 এখন env ফাইল থেকে Dynamic Base URL যাবে
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const result = await res.json();

    // ব্যাকএন্ড থেকে আসা আসল এরর মেসেজ রিটার্ন করা
    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Invalid credentials. Please try again.",
      };
    }

    // Set JWT token into HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set("token", result.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return { success: true, message: result.message };
  } catch (error: any) {
    // 👈 টার্মিনালে আসল এরর প্রিন্ট হবে
    console.error("LOGIN_ACTION_ERROR:", error);

    return {
      success: false,
      message: error?.message || "Failed to connect to the server. Check backend running status.",
    };
  }
}