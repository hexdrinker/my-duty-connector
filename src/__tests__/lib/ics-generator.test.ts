import { describe, it, expect } from "vitest";
import {
  buildCalendarEvents,
  generateIcsString,
  entriesToIcs,
} from "@/lib/ics/generator";
import { foldLine, generateUid, escapeIcsText } from "@/lib/ics/utils";
import type { DutyEntry, DutyRule } from "@/lib/types";

const makeEntry = (
  date: string,
  code: string,
  overrides?: Partial<DutyEntry>,
): DutyEntry => ({
  date,
  dutyCode: code,
  color: "#889CDB",
  startTime: "07:00",
  endTime: "15:00",
  isOffDay: false,
  isWholeDay: false,
  isVacation: false,
  ...overrides,
});

const makeRule = (
  code: string,
  overrides?: Partial<DutyRule>,
): DutyRule => ({
  code,
  displayName: code,
  startTime: "07:00",
  endTime: "15:00",
  isAllDay: false,
  skip: false,
  color: "#889CDB",
  ...overrides,
});

describe("buildCalendarEvents", () => {
  it("creates events from entries and rules", () => {
    const entries = [makeEntry("2026-04-01", "D")];
    const rules = [makeRule("D")];
    const events = buildCalendarEvents(entries, rules);

    expect(events).toHaveLength(1);
    expect(events[0].title).toBe("D");
    expect(new Date(events[0].start).getHours()).toBe(7);
    expect(new Date(events[0].end).getHours()).toBe(15);
    expect(events[0].allDay).toBe(false);
  });

  it("handles night shift crossing midnight as all-day event", () => {
    const entries = [
      makeEntry("2026-04-01", "N", { startTime: "23:00", endTime: "07:00" }),
    ];
    const rules = [makeRule("N", { startTime: "23:00", endTime: "07:00" })];
    const events = buildCalendarEvents(entries, rules);

    expect(events).toHaveLength(1);
    expect(events[0].allDay).toBe(true);
    expect(events[0].title).toBe("N 23:00~07:00");
    expect(new Date(events[0].start).getDate()).toBe(1);
  });

  it("creates all-day events", () => {
    const entries = [
      makeEntry("2026-04-04", "off", { isOffDay: true, isWholeDay: true }),
    ];
    const rules = [makeRule("off", { isAllDay: true })];
    const events = buildCalendarEvents(entries, rules);

    expect(events).toHaveLength(1);
    expect(events[0].allDay).toBe(true);
  });

  it("skips entries with skip rule", () => {
    const entries = [makeEntry("2026-04-04", "off")];
    const rules = [makeRule("off", { skip: true })];
    const events = buildCalendarEvents(entries, rules);

    expect(events).toHaveLength(0);
  });

  it("skips entries with no matching rule", () => {
    const entries = [makeEntry("2026-04-01", "UNKNOWN")];
    const rules = [makeRule("D")];
    const events = buildCalendarEvents(entries, rules);

    expect(events).toHaveLength(0);
  });
});

describe("generateIcsString", () => {
  it("produces valid VCALENDAR structure", () => {
    const entries = [makeEntry("2026-04-01", "D")];
    const rules = [makeRule("D")];
    const ics = entriesToIcs(entries, rules);

    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("SUMMARY:D");
  });

  it("uses CRLF line endings", () => {
    const entries = [makeEntry("2026-04-01", "D")];
    const rules = [makeRule("D")];
    const ics = entriesToIcs(entries, rules);

    expect(ics).toContain("\r\n");
    // Should not have bare LF
    const withoutCRLF = ics.replace(/\r\n/g, "");
    expect(withoutCRLF).not.toContain("\n");
  });

  it("handles Korean text in summary", () => {
    const entries = [makeEntry("2026-04-01", "휴가")];
    const rules = [makeRule("휴가", { displayName: "휴가", isAllDay: true })];
    const ics = entriesToIcs(entries, rules);

    expect(ics).toContain("SUMMARY:휴가");
  });
});

describe("foldLine", () => {
  it("does not fold short lines", () => {
    const line = "SUMMARY:D";
    expect(foldLine(line)).toBe(line);
  });

  it("folds long lines at 75 octets", () => {
    const line = "SUMMARY:" + "A".repeat(100);
    const folded = foldLine(line);
    const parts = folded.split("\r\n");

    expect(parts.length).toBeGreaterThan(1);
    // continuation lines start with space
    for (let i = 1; i < parts.length; i++) {
      expect(parts[i][0]).toBe(" ");
    }
  });

  it("handles Korean characters without breaking multi-byte", () => {
    const line = "SUMMARY:" + "가".repeat(30); // 30 * 3 = 90 bytes + 8 = 98 bytes
    const folded = foldLine(line);

    // Verify it can be decoded back
    const unfolded = folded.replace(/\r\n /g, "");
    expect(unfolded).toBe(line);
  });
});

describe("generateUid", () => {
  it("produces deterministic UIDs", () => {
    const uid1 = generateUid("2026-04-01", "D");
    const uid2 = generateUid("2026-04-01", "D");
    expect(uid1).toBe(uid2);
    expect(uid1).toBe("2026-04-01-D@myduty-connector");
  });
});

describe("escapeIcsText", () => {
  it("escapes special characters", () => {
    expect(escapeIcsText("a;b,c\\d\ne")).toBe("a\\;b\\,c\\\\d\\ne");
  });
});
