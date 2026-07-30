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

    revalidatePath("/dashboard/categories");
    revalidatePath("/"); // Update home page categories as well
    return { success: true, message: result.message || "Category created successfully!" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong creating category.",
    };
  }
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) {
    return { success: false, message: "Category name is required" };
  }

  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/admin/categories/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ name, description }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to update category",
      };
    }

    revalidatePath("/dashboard/categories");
    revalidatePath("/");
    return { success: true, message: result.message || "Category updated successfully!" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong updating category.",
    };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/admin/categories/${id}`, {
      method: "DELETE",
      headers,
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to delete category",
      };
    }

    revalidatePath("/dashboard/categories");
    revalidatePath("/");
    return { success: true, message: result.message || "Category deleted successfully!" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong deleting category.",
    };
  }
}

// 2. Update User Status Action (PATCH /api/users/:id)
export async function updateUserStatusAction(userId: string, status: "ACTIVE" | "BLOCKED" | "SUSPENDED" | "BANNED") {
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

    revalidatePath("/dashboard/users");
    return { success: true, message: result.message || "User status updated!" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update status",
    };
  }
}

export async function getUsersAction() {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/admin/users`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to fetch users", data: [] };
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong", data: [] };
  }
}

export async function getTechniciansAction() {
  try {
    const res = await fetch(`${BASE_URL}/technicians`, {
      method: "GET",
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to fetch technicians" };
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function createServiceAction(payload: {
  title: string;
  description?: string;
  price: number;
  durationMins?: number;
  categoryId: string;
  technicianId: string;
}) {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/admin/services`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to create service" };
    }

    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/services");
    return { success: true, message: result.message || "Service created successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function updateServiceAction(id: string, payload: {
  title?: string;
  description?: string;
  price?: number;
  durationMins?: number;
  categoryId?: string;
  technicianId?: string;
}) {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/admin/services/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to update service" };
    }

    revalidatePath("/dashboard/services");
    revalidatePath("/dashboard/categories");
    return { success: true, message: result.message || "Service updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function deleteServiceAction(id: string) {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/admin/services/${id}`, {
      method: "DELETE",
      headers,
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to delete service" };
    }

    revalidatePath("/dashboard/services");
    revalidatePath("/dashboard/categories");
    return { success: true, message: result.message || "Service deleted successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}