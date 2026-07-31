"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://fix-it-now-prisma-backend.vercel.app/api";

async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export async function createReviewAction(bookingId: string, rating: number, comment: string) {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/reviews`, {
      method: "POST",
      headers,
      body: JSON.stringify({ bookingId, rating: Number(rating), comment }),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to submit review" };
    }

    revalidatePath("/dashboard/bookings");
    return { success: true, message: result.message || "Review submitted successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function updateReviewAction(reviewId: string, rating: number, comment: string) {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ rating: Number(rating), comment }),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to update review" };
    }

    revalidatePath("/dashboard/bookings");
    return { success: true, message: result.message || "Review updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function deleteReviewAction(reviewId: string) {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      headers,
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to delete review" };
    }

    revalidatePath("/dashboard/bookings");
    return { success: true, message: result.message || "Review deleted successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function getServiceReviewsAction(serviceId: string) {
  try {
    const res = await fetch(`${BASE_URL}/reviews/service/${serviceId}`, {
      method: "GET",
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to fetch service reviews", data: [] };
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong", data: [] };
  }
}

export async function getMyWorkReviewsAction() {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/reviews/my-work-reviews`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to fetch work reviews", data: [] };
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong", data: [] };
  }
}
