import { NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/auth/google";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const callbackUrl = `${baseUrl}/api/auth/google/callback`;
  const authUrl = getGoogleAuthUrl(callbackUrl);

  return NextResponse.redirect(authUrl);
}
