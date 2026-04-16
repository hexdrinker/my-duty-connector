import { NextRequest, NextResponse } from "next/server";
import { validateMyDutyUrl } from "@/lib/validators";
import { fetchSharePage } from "@/lib/myduty/fetcher";
import {
  fetchSchedules,
  joinSchedulesWithUnits,
} from "@/lib/myduty/scheduler";
import { ERROR_MESSAGES } from "@/lib/constants";
import type { ParseResult, ApiError } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, year, month } = body;

    // URL 검증
    const validation = validateMyDutyUrl(url);
    if (!validation.valid || !validation.shareId) {
      return NextResponse.json<ApiError>(
        { error: ERROR_MESSAGES.INVALID_URL, code: "INVALID_URL" },
        { status: 400 },
      );
    }

    // 날짜 결정 (미지정 시 현재 월)
    const now = new Date();
    const targetYear = year ?? now.getFullYear();
    const targetMonth = month ?? now.getMonth() + 1;

    // Step 1: 공유 페이지에서 userId + dutyUnits 추출
    let shareData;
    try {
      shareData = await fetchSharePage(validation.shareId);
    } catch {
      return NextResponse.json<ApiError>(
        { error: ERROR_MESSAGES.FETCH_FAILED, code: "FETCH_FAILED" },
        { status: 502 },
      );
    }

    // Step 2: 스케줄 API 호출
    let schedules;
    try {
      schedules = await fetchSchedules(
        shareData.userId,
        targetYear,
        targetMonth,
      );
    } catch {
      return NextResponse.json<ApiError>(
        { error: ERROR_MESSAGES.API_FAILED, code: "API_FAILED" },
        { status: 502 },
      );
    }

    // Step 3: 조인
    const entries = joinSchedulesWithUnits(schedules, shareData.dutyUnits);

    const result: ParseResult = {
      userName: shareData.userName,
      year: targetYear,
      month: targetMonth,
      dutyUnits: shareData.dutyUnits,
      entries,
    };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json<ApiError>(
      { error: "서버 내부 오류가 발생했습니다", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
