"use server";

import { ICategoryResponse } from "../types/category";


export async function getCategories(): Promise<ICategoryResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://fix-it-now-prisma-backend.vercel.app/api";

  try {
    const res = await fetch(`${baseUrl}/categories`, {
      method: "GET",
      cache: "no-store", // সবসময় ফ্রেশ ডেটা আনবে
    });

    if (!res.ok) {
      return { success: false, statusCode: res.status, message: "Failed to fetch categories", data: [] };
    }

    const data: ICategoryResponse = await res.json();
    return data;
  } catch (error: unknown) {
    return { success: false, statusCode: 500, message: "Something went wrong", data: [] };
  }
}