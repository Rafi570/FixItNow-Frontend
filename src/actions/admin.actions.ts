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

// 1. Create Category Action (POST /api/categories)
export async function createCategoryAction(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) {
    return { success: false, message: "Category name is required" };
  }

  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/admin/categories`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name, description }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to create category",
      };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/"); // Update home page categories as well
    return { success: true, message: result.message || "Category created successfully!" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong creating category.",
    };
  }
}

// 2. Update User Status Action (PATCH /api/users/:id)
export async function updateUserStatusAction(userId: string, status: "ACTIVE" | "BLOCKED" | "SUSPENDED") {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/admin/users/${userId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to update user status",
      };
    }

    revalidatePath("/admin/users");
    return { success: true, message: result.message || "User status updated!" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update status",
    };
  }
}