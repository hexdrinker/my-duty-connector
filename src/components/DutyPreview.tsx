"use client";

import type { DutyEntry, DutyRule } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";

interface DutyPreviewProps {
  entries: DutyEntry[];
  rules: DutyRule[];
  userName: string;
  year: number;
  month: number;
}

interface CalendarCell {
  day: number | null;
  entry: DutyEntry | null;
}

function buildCalendarGrid(
  year: number,
  month: number,
  entries: DutyEntry[],
): CalendarCell[][] {
  const entryMap = new Map(entries.map((e) => [e.date, e]));
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: CalendarCell[] = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: null, entry: null });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, entry: entryMap.get(dateStr) ?? null });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ day: null, entry: null });
  }

  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return weeks;
}

function getDisplayTime(entry: DutyEntry, rules: DutyRule[], t: { allDay: string; excluded: string }): string {
  const rule = rules.find((r) => r.code === entry.dutyCode);
  if (!rule || rule.skip) return "";
  if (rule.isAllDay) return t.allDay;
  return `${rule.startTime}~${rule.endTime}`;
}

export function DutyPreview({
  entries,
  rules,
  userName,
  year,
  month,
}: DutyPreviewProps) {
  const { t, locale } = useI18n();
  const weeks = buildCalendarGrid(year, month, entries);
  const workingDays = entries.filter(
    (e) => !e.isOffDay && !e.isVacation,
  ).length;
  const offDays = entries.filter((e) => e.isOffDay).length;
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;
  const todayDate = today.getDate();

  const titleText = t.preview.title.replace("{name}", userName);
  const dateText =
    locale === "ko"
      ? t.preview.yearMonth
          .replace("{year}", String(year))
          .replace("{month}", String(month))
      : t.preview.yearMonth
          .replace("{year}", String(year))
          .replace("{month}", String(month));

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{titleText}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{dateText}</p>
          </div>
          <div className="flex gap-3 text-right">
            <div>
              <p className="text-2xl font-bold text-primary">{workingDays}</p>
              <p className="text-xs text-muted-foreground">
                {t.preview.workingDays}
              </p>
            </div>
            <div className="border-l pl-3">
              <p className="text-2xl font-bold text-muted-foreground">
                {offDays}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.preview.offDays}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-4 sm:px-6">
        {/* 요일 헤더 */}
        <div className="mb-1 grid grid-cols-7 text-center">
          {t.days.map((day, i) => (
            <div
              key={day}
              className={`py-1.5 text-xs font-semibold ${
                i === 0
                  ? "text-red-400"
                  : i === 6
                    ? "text-blue-400"
                    : "text-muted-foreground"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 캘린더 그리드 */}
        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border bg-border">
          {weeks.flat().map((cell, idx) => {
            const colIdx = idx % 7;
            const isSunday = colIdx === 0;
            const isSaturday = colIdx === 6;
            const isToday = isCurrentMonth && cell.day === todayDate;
            const rule = cell.entry
              ? rules.find((r) => r.code === cell.entry!.dutyCode)
              : null;
            const isSkipped = rule?.skip ?? false;

            return (
              <div
                key={idx}
                className={`relative flex min-h-[72px] flex-col bg-card p-1.5 transition-colors sm:min-h-[80px] sm:p-2 ${
                  !cell.day ? "bg-muted/30" : ""
                } ${isToday ? "ring-2 ring-inset ring-primary/40" : ""}`}
              >
                {cell.day && (
                  <>
                    <span
                      className={`text-xs font-medium tabular-nums ${
                        isToday
                          ? "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                          : isSunday
                            ? "text-red-500"
                            : isSaturday
                              ? "text-blue-500"
                              : "text-foreground/70"
                      }`}
                    >
                      {cell.day}
                    </span>

                    {cell.entry && rule && (
                      <div
                        className={`mt-1 rounded-md px-1 py-0.5 text-center transition-opacity ${isSkipped ? "opacity-25" : ""}`}
                        style={{
                          backgroundColor: cell.entry.color + "20",
                        }}
                      >
                        <span
                          className="block text-[11px] font-bold leading-tight sm:text-xs"
                          style={{ color: cell.entry.color }}
                        >
                          {rule.displayName}
                        </span>
                        <span className="hidden text-[9px] leading-tight text-muted-foreground sm:block">
                          {getDisplayTime(cell.entry, rules, t.preview)}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
