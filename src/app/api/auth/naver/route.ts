import { NextResponse } from "next/server";
import { getNaverAuthUrl } from "@/lib/auth/naver";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const callbackUrl = `${baseUrl}/api/auth/naver/callback`;
  const state = crypto.randomUUID();
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
