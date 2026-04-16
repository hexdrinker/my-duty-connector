export const translations = {
  ko: {
    // Hero
    hero: {
      badge: "마이듀티 비사용자를 위한 캘린더 변환 도구",
      title: "MyDuty",
      titleAccent: "Connector",
      subtitle: "공유 링크를 붙여넣으면, 근무표가 내 캘린더 일정이 됩니다",
    },

    // Landing sections
    landing: {
      howItWorksTitle: "이렇게 사용해요",
      step1Title: "링크 붙여넣기",
      step1Desc: "마이듀티 앱에서 공유받은 링크를 입력하세요",
      step2Title: "근무표 확인",
      step2Desc: "캘린더 형태로 한눈에 근무 일정을 확인하세요",
      step3Title: "캘린더에 등록",
      step3Desc: ".ics 파일을 다운로드해서 내 캘린더에 바로 등록하세요",
      ctaButton: "지금 시작하기",
      painTitle: "이런 불편함, 겪어보셨나요?",
      painDesc:
        "마이듀티는 간호사 본인을 위한 앱이지만, 일정을 함께 맞춰야 하는 사람은 간호사만이 아닙니다.",
      pain1Title: "연인/가족/친구",
      pain1Desc:
        "상대방의 근무표를 알고 싶은데, 마이듀티 앱을 설치할 이유가 없어요",
      pain2Title: "공유 링크의 한계",
      pain2Desc:
        "공유 링크를 받아도 웹에서 보기만 가능하고, 내 캘린더에 옮기려면 직접 하나하나 입력해야 해요",
      pain3Title: "매달 반복되는 수작업",
      pain3Desc:
        "듀티는 보통 월말에 확정되니까, 매달 똑같은 수작업을 반복하게 됩니다",
    },

    // Link input
    linkInput: {
      label: "마이듀티 공유 링크",
      placeholder: "https://myduty.io/s/1234567890",
      hint: "마이듀티 앱에서 공유한 링크를 붙여넣으세요",
      monthLabel: "조회할 월",
      submit: "근무표 가져오기",
      loading: "근무표를 가져오는 중...",
    },

    // Preview
    preview: {
      title: "{name}님의 근무표",
      yearMonth: "{year}년 {month}월",
      workingDays: "근무일",
      offDays: "휴무일",
      allDay: "종일",
      excluded: "제외됨",
    },

    // Day headers
    days: ["일", "월", "화", "수", "목", "금", "토"],

    // Rule settings
    ruleSettings: {
      title: "근무 규칙 설정",
      description: "각 근무 유형의 시간과 이름을 조정할 수 있습니다",
      collapse: "접기",
      expand: "펼치기",
      exclude: "제외",
      displayName: "캘린더 표시 이름",
      allDay: "종일 일정",
      startTime: "시작 시간",
      endTime: "종료 시간",
    },

    // Download
    download: {
      button: ".ics 파일 다운로드 ({count}개 일정)",
    },

    // Error
    error: {
      network: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
    },

    // Calendar guide
    guide: {
      title: "캘린더에 등록하는 방법",
      google: "설정 > 가져오기 및 내보내기 > 가져오기",
      apple: ".ics 파일을 더블클릭하거나 파일 > 가져오기",
      naver: "설정 > 캘린더 가져오기",
    },

    // Footer
    footer: {
      description:
        "MyDuty Connector — 마이듀티 공유 링크를 캘린더 파일로 변환합니다",
    },

    // Theme
    theme: {
      light: "라이트",
      dark: "다크",
      system: "시스템",
    },
  },

  en: {
    hero: {
      badge: "Calendar converter for non-MyDuty users",
      title: "MyDuty",
      titleAccent: "Connector",
      subtitle:
        "Paste a shared link, and the duty roster becomes your calendar",
    },

    landing: {
      howItWorksTitle: "How it works",
      step1Title: "Paste the link",
      step1Desc: "Enter the shared link from the MyDuty app",
      step2Title: "Review the schedule",
      step2Desc: "See the duty roster at a glance in calendar view",
      step3Title: "Add to calendar",
      step3Desc:
        "Download the .ics file and import it into your calendar",
      ctaButton: "Get started",
      painTitle: "Sound familiar?",
      painDesc:
        "MyDuty is built for nurses, but the people who need to know their schedule aren't just the nurses themselves.",
      pain1Title: "Partners/Family/Friends",
      pain1Desc:
        "You want to know their work schedule, but there's no reason for you to install a nurse duty app",
      pain2Title: "Share link limitations",
      pain2Desc:
        "Even with a shared link, you can only view it on the web — adding it to your own calendar means manual entry",
      pain3Title: "Monthly busywork",
      pain3Desc:
        "Duty rosters are typically finalized at the end of each month, so you repeat the same manual work every time",
    },

    linkInput: {
      label: "MyDuty share link",
      placeholder: "https://myduty.io/s/1234567890",
      hint: "Paste the shared link from the MyDuty app",
      monthLabel: "Month to view",
      submit: "Fetch schedule",
      loading: "Fetching schedule...",
    },

    preview: {
      title: "{name}'s schedule",
      yearMonth: "{month}/{year}",
      workingDays: "Working",
      offDays: "Off",
      allDay: "All day",
      excluded: "Excluded",
    },

    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

    ruleSettings: {
      title: "Duty rule settings",
      description: "Customize time and display name for each duty type",
      collapse: "Collapse",
      expand: "Expand",
      exclude: "Skip",
      displayName: "Display name",
      allDay: "All-day event",
      startTime: "Start time",
      endTime: "End time",
    },

    download: {
      button: "Download .ics file ({count} events)",
    },

    error: {
      network: "A network error occurred. Please try again.",
    },

    guide: {
      title: "How to import into your calendar",
      google: "Settings > Import & Export > Import",
      apple: 'Double-click the .ics file or File > Import',
      naver: "Settings > Import calendar",
    },

    footer: {
      description:
        "MyDuty Connector — Convert MyDuty share links into calendar files",
    },

    theme: {
      light: "Light",
      dark: "Dark",
      system: "System",
    },
  },
} as const;

export type Locale = keyof typeof translations;
export type Translations = (typeof translations)[Locale];
