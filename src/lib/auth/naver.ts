const NAVER_AUTH_URL = "https://nid.naver.com/oauth2.0/authorize";
const NAVER_TOKEN_URL = "https://nid.naver.com/oauth2.0/token";
const NAVER_CALENDAR_API = "https://openapi.naver.com/calendar/createSchedule.json";

export function getNaverAuthUrl(callbackUrl: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.NAVER_CLIENT_ID!,
    redirect_uri: callbackUrl,
    response_type: "code",
    state,
  });

  return `${NAVER_AUTH_URL}?${params.toString()}`;
}

export async function exchangeNaverCode(
  code: string,
  callbackUrl: string,
  state: string,
): Promise<string> {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.NAVER_CLIENT_ID!,
    client_secret: process.env.NAVER_CLIENT_SECRET!,
    redirect_uri: callbackUrl,
    code,
    state,
  });

  const response = await fetch(`${NAVER_TOKEN_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Naver token exchange failed");
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(`Naver OAuth error: ${data.error_description}`);
  }

  return data.access_token;
}

interface NaverCalendarEvent {
  uid: string;
  title: string;
  startDate: string; // "yyyy-MM-dd'T'HH:mm:ss"
  endDate: string;
  allDay: boolean;
}

export async function insertNaverCalendarEvents(
  accessToken: string,
  events: NaverCalendarEvent[],
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const event of events) {
    const response = await fetch(NAVER_CALENDAR_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        calendarId: "defaultCalendarId",
        scheduleIcalString: buildNaverIcalString(event),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.result === "success" || data.returnValue) {
        success++;
      } else {
        failed++;
      }
    } else {
      failed++;
    }
  }

  return { success, failed };
}

function buildNaverIcalString(event: NaverCalendarEvent): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:MyDuty Connector",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `SUMMARY:${event.title}`,
  ];

  if (event.allDay) {
    lines.push(`DTSTART;VALUE=DATE:${toIcalDate(event.startDate)}`);
    lines.push(`DTEND;VALUE=DATE:${toIcalDate(event.endDate)}`);
  } else {
    lines.push(`DTSTART:${toIcalDateTime(event.startDate)}`);
    lines.push(`DTEND:${toIcalDateTime(event.endDate)}`);
  }

  lines.push("END:VEVENT");
  lines.push("END:VCALENDAR");

  return lines.join("\r\n");
}

/** ISO string (UTC) → iCal date (KST, UTC+9) */
function toIcalDate(isoString: string): string {
  const d = new Date(isoString);
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const day = String(kst.getUTCDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

/** ISO string (UTC) → iCal datetime (KST, UTC+9) */
function toIcalDateTime(isoString: string): string {
  const d = new Date(isoString);
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const day = String(kst.getUTCDate()).padStart(2, "0");
  const h = String(kst.getUTCHours()).padStart(2, "0");
  const min = String(kst.getUTCMinutes()).padStart(2, "0");
  const s = String(kst.getUTCSeconds()).padStart(2, "0");
  return `${y}${m}${day}T${h}${min}${s}`;
}
