"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { postAPI } from "@/lib/api";
import { logger } from "@/lib/logger";

export async function createProductAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/login");

  const payload: Record<string, unknown> = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    ingredients: formData.get("ingredients") || undefined,
    image_url: formData.get("image_url") || undefined,
  };

  logger.info("product_create_attempt", { fields: Object.keys(payload) });

  let result: { id?: number } | null = null;
  try {
    result = await postAPI("/products", payload, token);
  } catch (err) {
    logger.error("product_create_failed", { error: err instanceof Error ? err.message : String(err) });
    return { error: "Failed to create product. Please try again." };
  }

  logger.info("product_create_success", { id: result?.id });
  redirect(result?.id ? `/dashboard/products/${result.id}/edit` : "/dashboard");
}
