import { track } from "@vercel/analytics";

export function trackLinkSubmitted(url: string) {
  track("link_submitted", {
    domain: extractDomain(url),
  });
}

export function trackParseSuccess(userName: string, entryCount: number, year: number, month: number) {
  track("parse_success", {
    userName,
    entryCount,
    period: `${year}-${String(month).padStart(2, "0")}`,
  });
}

export function trackParseFailed(errorCode: string) {
  track("parse_failed", {
    errorCode,
  });
}

export function trackIcsDownloaded(eventCount: number, year: number, month: number) {
  track("ics_downloaded", {
    eventCount,
    period: `${year}-${String(month).padStart(2, "0")}`,
  });
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "invalid";
  }
}
