import { NextRequest } from "next/server";
import { exchangeGoogleCode } from "@/lib/auth/google";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return new Response(callbackHtml("error", "인증 코드를 받지 못했습니다"), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callbackUrl = `${baseUrl}/api/auth/google/callback`;
    const accessToken = await exchangeGoogleCode(code, callbackUrl);

    return new Response(callbackHtml("success", accessToken), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return new Response(callbackHtml("error", "Google 인증에 실패했습니다"), {
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
    { type: "oauth_callback", provider: "google", status: "${status}", data: "${data}" },
    window.location.origin
  );
  window.close();
</script>
</body></html>`;
}
