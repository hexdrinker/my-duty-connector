import { NextRequest, NextResponse } from "next/server";
import { getNaverAuthUrl } from "@/lib/auth/naver";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const callbackUrl = `${baseUrl}/api/auth/naver/callback`;
  const mode = request.nextUrl.searchParams.get("mode") || "popup";
  const state = `${mode}:${crypto.randomUUID()}`;
  const authUrl = getNaverAuthUrl(callbackUrl, state);

  const response = NextResponse.redirect(authUrl);
  response.cookies.set("naver_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 300,
  });

  return response;
}
