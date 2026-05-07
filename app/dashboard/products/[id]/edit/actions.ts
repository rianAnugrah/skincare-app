"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { patchAPI, postAPI } from "@/lib/api";
import { logger } from "@/lib/logger";

export async function updateProductAction(
  id: number,
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/login");

  const payload: Record<string, unknown> = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    ingredients: formData.get("ingredients"),
    image_url: formData.get("image_url"),
  };

  logger.info("product_update_attempt", { id, fields: Object.keys(payload) });

  try {
    await patchAPI(`/products/${id}`, payload, token);
  } catch (err) {
    logger.error("product_update_failed", { id, error: err instanceof Error ? err.message : String(err) });
    return { error: "Failed to update product. Please try again." };
  }

  logger.info("product_update_success", { id });
  redirect("/dashboard");
}

export async function addBarcodeAction(
  productId: number,
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/login");

  const code = (formData.get("code") as string)?.trim();
  if (!code) return { error: "Barcode value is required." };

  const payload: Record<string, unknown> = {
    code,
    product_id: productId,
    status: "valid",
  };
  const batchCode = (formData.get("batch_code") as string)?.trim();
  if (batchCode) payload.batch_code = batchCode;

  logger.info("barcode_create_attempt", { productId, code });

  try {
    await postAPI("/barcodes", payload, token);
  } catch (err) {
    logger.error("barcode_create_failed", { productId, error: err instanceof Error ? err.message : String(err) });
    return { error: "Failed to generate QR code. Please try again." };
  }

  logger.info("barcode_create_success", { productId, code });
  redirect(`/dashboard/products/${productId}/edit`);
}
