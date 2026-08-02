"use server";

import { cookies } from "next/headers";
import { revalidatePath, updateTag } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://fix-it-now-prisma-backend.vercel.app/api";

async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export async function getServicesAction() {
  try {
    const res = await fetch(`${BASE_URL}/services`, {
      method: "GET",
      next: { tags: ["services"] },
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to fetch services", data: [] };
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong", data: [] };
  }
}

export async function getServiceByIdAction(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
      method: "GET",
      next: { tags: ["services", `service-${id}`] },
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to fetch service details", data: null };
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong", data: null };
  }
}

export async function getOwnServicesAction() {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/technician/services`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to fetch your services", data: [] };
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong", data: [] };
  }
}

export async function createTechnicianServiceAction(payload: {
  title: string;
  description?: string;
  price: number;
  durationMins?: number;
  categoryId: string;
}) {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/technician/services`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to create service" };
    }

    revalidatePath("/dashboard/my-services");
    revalidatePath("/dashboard/services");
    revalidatePath("/services");
    revalidatePath("/");
    updateTag("services");
    return { success: true, message: result.message || "Service created successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function updateTechnicianServiceAction(id: string, payload: {
  title?: string;
  description?: string;
  price?: number;
  durationMins?: number;
  categoryId?: string;
}) {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/technician/services/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to update service" };
    }

    revalidatePath("/dashboard/my-services");
    revalidatePath("/dashboard/services");
    revalidatePath("/services");
    updateTag("services");
    updateTag(`service-${id}`);
    return { success: true, message: result.message || "Service updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function deleteTechnicianServiceAction(id: string) {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/technician/services/${id}`, {
      method: "DELETE",
      headers,
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to delete service" };
    }

    revalidatePath("/dashboard/my-services");
    revalidatePath("/dashboard/services");
    revalidatePath("/services");
    updateTag("services");
    updateTag(`service-${id}`);
    return { success: true, message: result.message || "Service deleted successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}
