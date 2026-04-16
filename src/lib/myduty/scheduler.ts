import type {
  DutyEntry,
  MyDutyApiResponse,
  MyDutySchedule,
  MyDutyUnit,
} from "../types";
import { MYDUTY_SCHEDULE_API } from "../constants";

export async function fetchSchedules(
  userId: string,
  year: number,
  month: number,
): Promise<MyDutySchedule[]> {
  const mm = String(month).padStart(2, "0");

  const response = await fetch(MYDUTY_SCHEDULE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Referer: "https://myduty.io/",
      Origin: "https://myduty.io",
    },
    body: new URLSearchParams({
      userId,
      yyyy: String(year),
      mm,
      mode: "production",
    }),
  });

  if (!response.ok) {
    throw new Error(`스케줄 API 요청 실패: HTTP ${response.status}`);
  }

  const data: MyDutyApiResponse = await response.json();

  if (data.header.status !== "success") {
    throw new Error(`스케줄 API 오류: ${data.header.message}`);
  }

  return data.body.schedules.duty;
}

export function joinSchedulesWithUnits(
  schedules: MyDutySchedule[],
  dutyUnits: MyDutyUnit[],
): DutyEntry[] {
  const unitMap = new Map(dutyUnits.map((u) => [u.dutyUnitId, u]));

  return schedules
    .map((schedule) => {
      const unit = unitMap.get(schedule.dutyUnitId);
      if (!unit) return null;

      const mm = schedule.month.padStart(2, "0");
      const dd = schedule.day.padStart(2, "0");

      return {
        date: `${schedule.year}-${mm}-${dd}`,
        dutyCode: unit.title,
        color: unit.color,
        startTime: formatTime(unit.startTime),
        endTime: formatTime(unit.endTime),
        isOffDay: unit.isOffDay,
        isWholeDay: unit.isWholeDay,
        isVacation: unit.isVacation,
      };
    })
    .filter((entry): entry is DutyEntry => entry !== null)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function formatTime(time: string): string {
  if (!time || time.length < 4) return "";
  return `${time.slice(0, 2)}:${time.slice(2, 4)}`;
}
