"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://fix-it-now-prisma-backend.vercel.app/api";

// Helper to get Authorization Header from Cookie
async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export async function getBookingsAction() {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to fetch bookings", data: [] };
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong", data: [] };
  }
}

export async function updateAdminBookingStatusAction(id: string, status: string) {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/admin/bookings/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to update booking status" };
    }

    revalidatePath("/dashboard/bookings");
    return { success: true, message: result.message || "Booking status updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function deleteAdminBookingAction(id: string) {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/admin/bookings/${id}`, {
      method: "DELETE",
      headers,
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to delete booking" };
    }

    revalidatePath("/dashboard/bookings");
    return { success: true, message: result.message || "Booking deleted successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function createBookingAction(payload: {
  serviceId: string;
  scheduledAt: string;
  address: string;
  note?: string;
}) {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to create booking" };
    }

    revalidatePath("/dashboard/bookings");
    return { success: true, message: result.message || "Booking created successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}
