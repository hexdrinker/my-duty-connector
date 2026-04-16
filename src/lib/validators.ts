import { MYDUTY_SHARE_URL_PATTERN } from "./constants";

export function validateMyDutyUrl(url: string): {
  valid: boolean;
  shareId?: string;
  error?: string;
} {
  const trimmed = url.trim();

  if (!trimmed) {
    return { valid: false, error: "링크를 입력해주세요" };
  }

  const match = trimmed.match(MYDUTY_SHARE_URL_PATTERN);

  if (!match) {
    return {
      valid: false,
      error: "올바른 마이듀티 공유 링크를 입력해주세요 (예: https://myduty.io/s/1234567890)",
    };
  }

  return { valid: true, shareId: match[1] };
}
