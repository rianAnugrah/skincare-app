"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logger } from "@/lib/logger";

const AUTH_BASE = "https://api.pixinia.web.id/api/auth/v1";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  logger.info("auth_login_attempt", { email });

  let res: Response;
  try {
    res = await fetch(`${AUTH_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    logger.error("auth_network_error", {
      error: err instanceof Error ? err.message : String(err),
    });
    return { error: "Cannot reach server. Try again later." };
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    logger.warn("auth_login_failed", { email, status: res.status, body: body.slice(0, 200) });
    return { error: "Invalid email or password." };
  }

  const data = await res.json();
  const authToken: string = data.auth_token;

  logger.info("auth_login_success", { email });

  const cookieStore = await cookies();
  cookieStore.set("auth_token", authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour, matches Trailbase JWT exp
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/login");
}
