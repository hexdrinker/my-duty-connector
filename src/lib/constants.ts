export const MYDUTY_SHARE_URL_PATTERN =
  /^https?:\/\/myduty\.io\/s\/(\d+)\/?$/;

export const MYDUTY_BASE_URL = "https://myduty.io";

export const MYDUTY_SCHEDULE_API = `${MYDUTY_BASE_URL}/proxy/getUserDutySchedules`;

export const ICS_PRODUCT_ID = "-//MyDuty Connector//myduty-connector//KO";

export const ICS_UID_DOMAIN = "myduty-connector";

export const ERROR_MESSAGES = {
  INVALID_URL: "올바른 마이듀티 공유 링크를 입력해주세요",
  FETCH_FAILED:
    "링크에 접근할 수 없습니다. 링크가 만료되었거나 네트워크 문제일 수 있습니다",
  PARSE_FAILED: "마이듀티 페이지 구조가 변경되었을 수 있습니다",
  API_FAILED: "일정 데이터를 불러오지 못했습니다",
  NO_SCHEDULES: "이 달에는 등록된 근무일정이 없습니다",
} as const;
