import { NextRequest, NextResponse } from "next/server";
import { exchangeNaverCode } from "@/lib/auth/naver";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get("naver_oauth_state")?.value;

  // state format: "{mode}:{uuid}"
  const mode = state?.split(":")[0] || "popup";

  if (!code || !state) {
    if (mode === "redirect") {
      return redirectWithError();
    }
    return popupResponse("error", "인증 코드를 받지 못했습니다");
  }

  if (state !== savedState) {
    if (mode === "redirect") {
      return redirectWithError();
    }
    return popupResponse("error", "인증 상태가 일치하지 않습니다");
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callbackUrl = `${baseUrl}/api/auth/naver/callback`;
    const accessToken = await exchangeNaverCode(code, callbackUrl, state);

    if (mode === "redirect") {
      const redirectUrl = new URL(baseUrl);
      redirectUrl.searchParams.set("oauth_provider", "naver");
      redirectUrl.searchParams.set("oauth_status", "success");
      redirectUrl.searchParams.set("oauth_token", accessToken);
      return NextResponse.redirect(redirectUrl.toString());
    }

    return popupResponse("success", accessToken);
  } catch {
    if (mode === "redirect") {
      return redirectWithError();
    }
    return popupResponse("error", "Naver 인증에 실패했습니다");
  }
}

function redirectWithError() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUrl = new URL(baseUrl);
  redirectUrl.searchParams.set("oauth_provider", "naver");
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
    { type: "oauth_callback", provider: "naver", status: "${status}", data: "${data}" },
    window.location.origin
  );
  window.close();
</script>
</body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
