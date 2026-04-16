import { NextRequest, NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/auth/google";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const callbackUrl = `${baseUrl}/api/auth/google/callback`;
  const mode = request.nextUrl.searchParams.get("mode") || "popup";
  const authUrl = getGoogleAuthUrl(callbackUrl, mode);

  return NextResponse.redirect(authUrl);
}
