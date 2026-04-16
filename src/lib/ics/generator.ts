import type { CalendarEvent, DutyEntry, DutyRule } from "../types";
import { ICS_PRODUCT_ID } from "../constants";
import {
  escapeIcsText,
  foldLine,
  formatDateOnly,
  formatDateTimeLocal,
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
          start,
          end,
          allDay: true,
        };
      }

      const [startH, startM] = rule.startTime.split(":").map(Number);
      const [endH, endM] = rule.endTime.split(":").map(Number);

      const start = new Date(year, month - 1, day, startH, startM);
      const end = new Date(year, month - 1, day, endH, endM);

      // 야간근무: 종료시간이 시작시간보다 이르면 다음 날
      if (endH < startH || (endH === startH && endM < startM)) {
        end.setDate(end.getDate() + 1);
      }

      return {
        uid: generateUid(entry.date, entry.dutyCode),
        title: rule.displayName,
        start,
        end,
        allDay: false,
      };
    })
    .filter((event): event is CalendarEvent => event !== null);
}

export function generateIcsString(events: CalendarEvent[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${ICS_PRODUCT_ID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:MyDuty Schedule",
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
