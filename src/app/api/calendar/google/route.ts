import { NextRequest, NextResponse } from "next/server";

// Google Calendar predefined colors (colorId → hex)
const GOOGLE_COLORS: Record<string, string> = {
  "1": "#7986CB", // Lavender
  "2": "#33B679", // Sage
  "3": "#8E24AA", // Grape
  "4": "#E67C73", // Flamingo
  "5": "#F6BF26", // Banana
  "6": "#F4511E", // Tangerine
  "7": "#039BE5", // Peacock
  "8": "#616161", // Graphite
  "9": "#3F51B5", // Blueberry
  "10": "#0B8043", // Basil
  "11": "#D50000", // Tomato
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function colorDistance(a: [number, number, number], b: [number, number, number]): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

/** ISO string (UTC) → KST 날짜 문자열 (YYYY-MM-DD) */
function isoToKstDate(isoString: string): string {
  const d = new Date(isoString);
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const day = String(kst.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function hexToGoogleColorId(hex: string): string {
  const target = hexToRgb(hex);
  let closest = "1";
  let minDist = Infinity;

  for (const [id, gHex] of Object.entries(GOOGLE_COLORS)) {
    const dist = colorDistance(target, hexToRgb(gHex));
    if (dist < minDist) {
      minDist = dist;
      closest = id;
    }
  }

  return closest;
}
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
      const colorId = event.color ? hexToGoogleColorId(event.color) : undefined;
      if (event.allDay) {
        return {
          summary: event.title,
          start: { date: isoToKstDate(event.start) },
          end: { date: isoToKstDate(event.end) },
          ...(colorId && { colorId }),
        };
      }
      return {
        summary: event.title,
        start: { dateTime: event.start, timeZone: "Asia/Seoul" },
        end: { dateTime: event.end, timeZone: "Asia/Seoul" },
        ...(colorId && { colorId }),
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
