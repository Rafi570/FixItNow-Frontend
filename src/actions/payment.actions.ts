"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://fix-it-now-prisma-backend.vercel.app/api";

async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export async function createPaymentAction(bookingId: string) {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/payments/create`, {
      method: "POST",
      headers,
      body: JSON.stringify({ bookingId }),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to initiate payment" };
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}
