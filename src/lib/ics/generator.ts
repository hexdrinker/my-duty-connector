import type { CalendarEvent, DutyEntry, DutyRule } from "../types";
import { ICS_PRODUCT_ID } from "../constants";
import {
  escapeIcsText,
  foldLine,
  generateUid,
} from "./utils";

export function buildCalendarEvents(
  entries: DutyEntry[],
  rules: DutyRule[],
): CalendarEvent[] {
  const ruleMap = new Map(rules.map((r) => [r.code, r]));

  return entries
    .map((entry) => {
      const rule = ruleMap.get(entry.dutyCode);
      if (!rule || rule.skip) return null;

      const [year, month, day] = entry.date.split("-").map(Number);

      if (rule.isAllDay) {
        const start = new Date(year, month - 1, day);
        const end = new Date(year, month - 1, day + 1);
        return {
          uid: generateUid(entry.date, entry.dutyCode),
          title: rule.displayName,
          start: start.toISOString(),
          end: end.toISOString(),
          allDay: true,
          color: entry.color,
        };
      }

      const [startH, startM] = rule.startTime.split(":").map(Number);
      const [endH, endM] = rule.endTime.split(":").map(Number);

      // 야간근무(자정 넘김): 종일 일정으로 변환, 제목에 시간 포함
      const crossesMidnight =
        endH < startH || (endH === startH && endM < startM);

      if (crossesMidnight) {
        const start = new Date(year, month - 1, day);
        const end = new Date(year, month - 1, day + 1);
        return {
          uid: generateUid(entry.date, entry.dutyCode),
          title: `${rule.displayName} ${rule.startTime}~${rule.endTime}`,
          start: start.toISOString(),
          end: end.toISOString(),
          allDay: true,
          color: entry.color,
        };
      }

      const start = new Date(year, month - 1, day, startH, startM);
      const end = new Date(year, month - 1, day, endH, endM);

      return {
        uid: generateUid(entry.date, entry.dutyCode),
        title: rule.displayName,
        start: start.toISOString(),
        end: end.toISOString(),
        allDay: false,
        color: entry.color,
      };
    })
    .filter((event) => event !== null) as CalendarEvent[];
}

function formatDateTimeLocal(isoString: string): string {
  const d = new Date(isoString);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${y}${m}${day}T${h}${min}${s}`;
}

function formatDateOnly(isoString: string): string {
  const d = new Date(isoString);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

export function generateIcsString(events: CalendarEvent[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${ICS_PRODUCT_ID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:MyDuty Connector",
  ];

  for (const event of events) {
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${event.uid}`);
    lines.push(`SUMMARY:${escapeIcsText(event.title)}`);

    if (event.allDay) {
      lines.push(`DTSTART;VALUE=DATE:${formatDateOnly(event.start)}`);
      lines.push(`DTEND;VALUE=DATE:${formatDateOnly(event.end)}`);
    } else {
      lines.push(`DTSTART:${formatDateTimeLocal(event.start)}`);
      lines.push(`DTEND:${formatDateTimeLocal(event.end)}`);
    }

    if (event.description) {
      lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
    }

    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  return lines.map((line) => foldLine(line)).join("\r\n") + "\r\n";
}

export function entriesToIcs(entries: DutyEntry[], rules: DutyRule[]): string {
  const events = buildCalendarEvents(entries, rules);
  return generateIcsString(events);
}
