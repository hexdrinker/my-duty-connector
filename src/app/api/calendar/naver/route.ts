import { NextRequest, NextResponse } from "next/server";
import { insertNaverCalendarEvents } from "@/lib/auth/naver";
import type { CalendarEvent } from "@/lib/types";

interface InsertRequest {
  accessToken: string;
  events: CalendarEvent[];
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken, events }: InsertRequest = await request.json();

    if (!accessToken || !events?.length) {
      return NextResponse.json(
        { error: "토큰 또는 이벤트 데이터가 없습니다" },
        { status: 400 },
      );
    }

    const naverEvents = events.map((event) => ({
      uid: event.uid,
      title: event.title,
      startDate: event.start,
      endDate: event.end,
      allDay: event.allDay,
    }));

    const result = await insertNaverCalendarEvents(accessToken, naverEvents);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Naver Calendar 등록에 실패했습니다" },
      { status: 500 },
    );
  }
}
