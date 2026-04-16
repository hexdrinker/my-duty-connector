import { NextRequest } from "next/server";
import { exchangeNaverCode } from "@/lib/auth/naver";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get("naver_oauth_state")?.value;

  if (!code || !state) {
    return new Response(callbackHtml("error", "인증 코드를 받지 못했습니다"), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  if (state !== savedState) {
    return new Response(callbackHtml("error", "인증 상태가 일치하지 않습니다"), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callbackUrl = `${baseUrl}/api/auth/naver/callback`;
    const accessToken = await exchangeNaverCode(code, callbackUrl, state);

    const response = new Response(callbackHtml("success", accessToken), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });

    return response;
  } catch {
    return new Response(callbackHtml("error", "Naver 인증에 실패했습니다"), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}

function callbackHtml(status: string, data: string): string {
  return `<!DOCTYPE html>
<html><head><title>MyDuty Connector</title></head>
<body><p>처리 중...</p>
<script>
  window.opener.postMessage(
    { type: "oauth_callback", provider: "naver", status: "${status}", data: "${data}" },
    window.location.origin
  );
  window.close();
</script>
</body></html>`;
}
