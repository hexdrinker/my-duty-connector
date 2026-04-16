import { NextRequest, NextResponse } from "next/server";
import { exchangeGoogleCode } from "@/lib/auth/google";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const mode = request.nextUrl.searchParams.get("state") || "popup";

  if (!code) {
    if (mode === "redirect") {
      return redirectWithError("인증 코드를 받지 못했습니다");
    }
    return popupResponse("error", "인증 코드를 받지 못했습니다");
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callbackUrl = `${baseUrl}/api/auth/google/callback`;
    const accessToken = await exchangeGoogleCode(code, callbackUrl);

    if (mode === "redirect") {
      const redirectUrl = new URL(baseUrl);
      redirectUrl.searchParams.set("oauth_provider", "google");
      redirectUrl.searchParams.set("oauth_status", "success");
      redirectUrl.searchParams.set("oauth_token", accessToken);
      return NextResponse.redirect(redirectUrl.toString());
    }

    return popupResponse("success", accessToken);
  } catch {
    if (mode === "redirect") {
      return redirectWithError("Google 인증에 실패했습니다");
    }
    return popupResponse("error", "Google 인증에 실패했습니다");
  }
}

function redirectWithError(message: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUrl = new URL(baseUrl);
  redirectUrl.searchParams.set("oauth_provider", "google");
  redirectUrl.searchParams.set("oauth_status", "error");
  return NextResponse.redirect(redirectUrl.toString());
}

function popupResponse(status: string, data: string) {
  return new Response(
    `<!DOCTYPE html>
<html><head><title>MyDuty Connector</title></head>
<body><p>처리 중...</p>
<script>
  window.opener.postMessage(
    { type: "oauth_callback", provider: "google", status: "${status}", data: "${data}" },
    window.location.origin
  );
  window.close();
</script>
</body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
