import { describe, it, expect } from "vitest";
import { joinSchedulesWithUnits } from "@/lib/myduty/scheduler";
import type { MyDutySchedule, MyDutyUnit } from "@/lib/types";

const mockUnits: MyDutyUnit[] = [
  {
    dutyUnitId: 100,
    title: "D",
    color: "#889CDB",
    isWholeDay: false,
    isOffDay: false,
    isVacation: false,
    customTag: "1",
    startTime: "0700",
    endTime: "1500",
    workingTime: null,
    visible: true,
    registTime: 0,
    registTimeOfKorea: "",
    lastUpdateTime: 0,
    lastUpdateTimeOfKorea: "",
  },
  {
    dutyUnitId: 200,
    title: "N",
    color: "#FFE69B",
    isWholeDay: false,
    isOffDay: false,
    isVacation: false,
    customTag: "3",
    startTime: "2300",
    endTime: "0700",
    workingTime: null,
    visible: true,
    registTime: 0,
    registTimeOfKorea: "",
    lastUpdateTime: 0,
    lastUpdateTimeOfKorea: "",
  },
  {
    dutyUnitId: 300,
    title: "off",
    color: "#B0F5FF",
    isWholeDay: true,
    isOffDay: true,
    isVacation: false,
    customTag: "5",
    startTime: "",
    endTime: "",
    workingTime: null,
    visible: true,
    registTime: 0,
    registTimeOfKorea: "",
    lastUpdateTime: 0,
    lastUpdateTimeOfKorea: "",
  },
];

describe("joinSchedulesWithUnits", () => {
  it("joins schedules with duty units", () => {
    const schedules: MyDutySchedule[] = [
      {
        scheduleId: 0,
        dutyUnitId: 100,
        year: "2026",
        month: "04",
        day: "01",
        order: 0,
      },
      {
        scheduleId: 0,
        dutyUnitId: 200,
        year: "2026",
        month: "04",
        day: "02",
        order: 0,
      },
    ];

    const entries = joinSchedulesWithUnits(schedules, mockUnits);

    expect(entries).toHaveLength(2);
    expect(entries[0].dutyCode).toBe("D");
    expect(entries[0].date).toBe("2026-04-01");
    expect(entries[0].startTime).toBe("07:00");
    expect(entries[0].endTime).toBe("15:00");
    expect(entries[1].dutyCode).toBe("N");
    expect(entries[1].startTime).toBe("23:00");
    expect(entries[1].endTime).toBe("07:00");
  });

  it("sorts entries by date", () => {
    const schedules: MyDutySchedule[] = [
      {
        scheduleId: 0,
        dutyUnitId: 200,
        year: "2026",
        month: "04",
        day: "15",
        order: 0,
      },
      {
        scheduleId: 0,
        dutyUnitId: 100,
        year: "2026",
        month: "04",
        day: "03",
        order: 0,
      },
    ];

    const entries = joinSchedulesWithUnits(schedules, mockUnits);
    expect(entries[0].date).toBe("2026-04-03");
    expect(entries[1].date).toBe("2026-04-15");
  });

  it("skips schedules with unknown dutyUnitId", () => {
    const schedules: MyDutySchedule[] = [
      {
        scheduleId: 0,
        dutyUnitId: 999,
        year: "2026",
        month: "04",
        day: "01",
        order: 0,
      },
    ];

    const entries = joinSchedulesWithUnits(schedules, mockUnits);
    expect(entries).toHaveLength(0);
  });

  it("correctly marks off days", () => {
    const schedules: MyDutySchedule[] = [
      {
        scheduleId: 0,
        dutyUnitId: 300,
        year: "2026",
        month: "04",
        day: "04",
        order: 0,
      },
    ];

    const entries = joinSchedulesWithUnits(schedules, mockUnits);
    expect(entries[0].isOffDay).toBe(true);
    expect(entries[0].isWholeDay).toBe(true);
  });

  it("handles single-digit day/month with padding", () => {
    const schedules: MyDutySchedule[] = [
      {
        scheduleId: 0,
        dutyUnitId: 100,
        year: "2026",
        month: "1",
        day: "5",
        order: 0,
      },
    ];

    const entries = joinSchedulesWithUnits(schedules, mockUnits);
    expect(entries[0].date).toBe("2026-01-05");
  });
});
