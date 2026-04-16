import { NextRequest, NextResponse } from "next/server";
import { insertGoogleCalendarEvents } from "@/lib/auth/google";
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

    const googleEvents = events.map((event) => {
      if (event.allDay) {
        return {
          summary: event.title,
          start: { date: event.start.split("T")[0] },
          end: { date: event.end.split("T")[0] },
        };
      }
      return {
        summary: event.title,
        start: { dateTime: event.start, timeZone: "Asia/Seoul" },
        end: { dateTime: event.end, timeZone: "Asia/Seoul" },
      };
    });

    const result = await insertGoogleCalendarEvents(accessToken, googleEvents);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Google Calendar 등록에 실패했습니다" },
      { status: 500 },
    );
  }
}
