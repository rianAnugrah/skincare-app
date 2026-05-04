import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim();
  const target = code ? `/verify/${encodeURIComponent(code)}` : "/";

  // Use a relative Location header so the browser preserves the current origin
  // (works on localhost, ngrok, custom domains, etc. — no host/proto guessing needed).
  return new NextResponse(null, {
    status: 303,
    headers: { Location: target },
  });
}
