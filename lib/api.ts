import { logger } from "./logger";

const BASE_URL = "https://api.pixinia.web.id/api/records/v1";

function getAuthHeader(token?: string): HeadersInit {
  const t = token ?? process.env.TRAILBASE_TOKEN;
  if (!t) {
    logger.warn("api_missing_token", { hint: "Set TRAILBASE_TOKEN in .env.local or pass token" });
    return {};
  }
  return { Authorization: `Bearer ${t}` };
}

export async function fetchAPI(path: string, token?: string) {
  const url = `${BASE_URL}${path}`;
  const start = Date.now();

  logger.info("api_request", { url, path, auth: token ? "user" : "env" });

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(token),
      },
    });
  } catch (err) {
    const durationMs = Date.now() - start;
    logger.error("api_network_error", {
      url,
      durationMs,
      error: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }

  const durationMs = Date.now() - start;

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    logger.error("api_response_error", {
      url,
      status: res.status,
      statusText: res.statusText,
      durationMs,
      body: body.slice(0, 500),
    });
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const records = data?.records ?? data;
  const resultCount = Array.isArray(records) ? records.length : 1;

  logger.info("api_response_ok", {
    url,
    status: res.status,
    durationMs,
    resultCount,
  });

  return records;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  ingredients?: string;
  image_url?: string;
  status?: "valid" | "invalid";
  created_at?: string;
}

export interface Barcode {
  id: string;
  code: string;
  product_id: string;
  status?: "valid" | "invalid";
}
