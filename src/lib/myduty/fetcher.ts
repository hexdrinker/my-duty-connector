import * as cheerio from "cheerio";
import type { FetcherResult, MyDutyUnit } from "../types";
import { MYDUTY_BASE_URL } from "../constants";

interface BootstrapPayload {
  userId: string;
  userName: string;
  dutyUnits: MyDutyUnit[];
}

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
  const boot = extractBootstrap(html);

  return {
    userId: boot.userId,
    userName: boot.userName || "Unknown",
    dutyUnits: boot.dutyUnits,
  };
}

function extractBootstrap(html: string): BootstrapPayload {
  const $ = cheerio.load(html);
  const jsonText = $("#__myduty_bootstrap__").text().trim();

  if (!jsonText) {
    throw new Error("마이듀티 부트스트랩 데이터를 찾을 수 없습니다");
  }

  const data = JSON.parse(jsonText) as Partial<BootstrapPayload>;

  if (!data.userId || !Array.isArray(data.dutyUnits)) {
    throw new Error("부트스트랩 데이터 형식이 예상과 다릅니다");
  }

  return {
    userId: String(data.userId),
    userName: data.userName ?? "",
    dutyUnits: data.dutyUnits,
  };
}
