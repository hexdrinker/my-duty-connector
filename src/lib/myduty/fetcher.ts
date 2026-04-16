import * as cheerio from "cheerio";
import type { FetcherResult, MyDutyUnit } from "../types";
import { MYDUTY_BASE_URL } from "../constants";

const USER_ID_PATTERN = /var\s+userId\s*=\s*"(\d+)"/;

export async function fetchSharePage(shareId: string): Promise<FetcherResult> {
  const url = `${MYDUTY_BASE_URL}/s/${shareId}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; MyDutyBridge/1.0)",
    },
  });

  if (!response.ok) {
    throw new Error(`공유 페이지 요청 실패: HTTP ${response.status}`);
  }

  const html = await response.text();

  const userId = extractUserId(html);
  const dutyUnits = extractDutyUnits(html);
  const userName = extractUserName(html);

  return { userId, userName, dutyUnits };
}

function extractUserId(html: string): string {
  const match = html.match(USER_ID_PATTERN);
  if (!match) {
    throw new Error("userId를 추출할 수 없습니다");
  }
  return match[1];
}

function extractDutyUnits(html: string): MyDutyUnit[] {
  const $ = cheerio.load(html);
  const jsonText = $("#json_dutyUnits").text().trim();

  if (!jsonText) {
    throw new Error("듀티 타입 정보를 찾을 수 없습니다");
  }

  const units: MyDutyUnit[] = JSON.parse(jsonText);
  return units;
}

function extractUserName(html: string): string {
  const $ = cheerio.load(html);
  const name = $(".task-thumb-details h1").text().trim();
  return name || "Unknown";
}
