// 마이듀티 API 원본 타입

export interface MyDutyUnit {
  dutyUnitId: number;
  title: string;
  color: string;
  isWholeDay: boolean;
  isOffDay: boolean;
  isVacation: boolean;
  customTag: string;
  startTime: string; // "0700" (HHmm)
  endTime: string; // "1500"
  workingTime: number | null;
  visible: boolean;
  registTime: number;
  registTimeOfKorea: string;
  lastUpdateTime: number;
  lastUpdateTimeOfKorea: string;
}

export interface MyDutySchedule {
  scheduleId: number;
  dutyUnitId: number;
  year: string;
  month: string;
  day: string;
  order: number;
}

export interface MyDutyApiResponse {
  header: {
    name: string;
    version: string;
    status: string;
    message: string;
  };
  body: {
    userId: number;
    schedules: {
      calendar: unknown[];
      duty: MyDutySchedule[];
    };
  };
}

// 정규화된 서비스 타입

export interface DutyEntry {
  date: string; // "2026-04-01"
  dutyCode: string; // "D"
  color: string; // "#889CDB"
  startTime: string; // "07:00"
  endTime: string; // "15:00"
  isOffDay: boolean;
  isWholeDay: boolean;
  isVacation: boolean;
}

export interface ParseResult {
  userName: string;
  year: number;
  month: number;
  dutyUnits: MyDutyUnit[];
  entries: DutyEntry[];
}

export interface DutyRule {
  code: string;
  displayName: string;
  startTime: string; // "07:00"
  endTime: string; // "15:00"
  isAllDay: boolean;
  skip: boolean;
  color: string;
}

export interface CalendarEvent {
  uid: string;
  title: string;
  start: string; // ISO string for serialization
  end: string;
  allDay: boolean;
  description?: string;
  color?: string; // hex color from duty unit
}

export interface FetcherResult {
  userId: string;
  userName: string;
  dutyUnits: MyDutyUnit[];
}

export interface ParseRequest {
  url: string;
  year?: number;
  month?: number;
}

export interface ApiError {
  error: string;
  code: string;
}
