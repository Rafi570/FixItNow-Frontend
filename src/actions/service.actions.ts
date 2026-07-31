"use server";

export async function getServicesAction() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://fix-it-now-prisma-backend.vercel.app/api";

  try {
    const res = await fetch(`${baseUrl}/services`, {
      method: "GET",
      cache: "no-store",
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
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://fix-it-now-prisma-backend.vercel.app/api";

  try {
    const res = await fetch(`${baseUrl}/services/${id}`, {
      method: "GET",
      cache: "no-store",
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
