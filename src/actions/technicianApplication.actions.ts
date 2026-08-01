"use server";

import { cookies } from "next/headers";
import { revalidatePath, updateTag } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export async function applyTechnicianAction(payload: {
  bio?: string;
  experience?: number;
  skills?: string[];
  hourlyRate?: number;
  location?: string;
}) {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/technician-applications/apply`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to submit technician application",
      };
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    updateTag("my-application");
    return { success: true, message: result.message || "Application submitted successfully!", data: result.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong submitting application.",
    };
  }
}

export async function getMyTechnicianApplicationAction() {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/technician-applications/me`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to fetch application", data: null };
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Something went wrong", data: null };
  }
}

export async function getTechnicianApplicationsAction() {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/technician-applications/admin`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message || "Failed to fetch technician applications", data: [] };
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Something went wrong", data: [] };
  }
}

export async function updateApplicationStatusAction(id: string, status: "ACCEPTED" | "REJECTED") {
  try {
    const headers = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/technician-applications/admin/${id}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to update application status",
      };
    }

    revalidatePath("/dashboard/applications");
    revalidatePath("/dashboard/users");
    revalidatePath("/dashboard");
    revalidatePath("/");
    updateTag("technicians");
    return { success: true, message: result.message || `Application ${status.toLowerCase()} successfully!` };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong updating application status.",
    };
  }
}
