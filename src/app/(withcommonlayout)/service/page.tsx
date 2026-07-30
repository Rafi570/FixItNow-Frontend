import { redirect } from "next/navigation";

export default async function ServicePageRedirect({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const queryString = Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(String(val))}`)
    .join("&");

  redirect(`/services${queryString ? `?${queryString}` : ""}`);
}
