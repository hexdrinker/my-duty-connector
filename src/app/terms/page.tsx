import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | MyDuty Connector",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-8 text-2xl font-bold">이용약관</h1>
      <p className="mb-2 text-sm text-muted-foreground">
        최종 수정일: 2026년 4월 16일
      </p>

      <div className="space-y-8 text-sm leading-relaxed text-foreground/80">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            1. 서비스 소개
          </h2>
          <p>
            MyDuty Connector(이하 &quot;서비스&quot;)는 마이듀티 앱의 공유
            링크를 캘린더 파일(.ics)로 변환하거나, Google Calendar 및 Naver
            Calendar에 직접 등록할 수 있도록 돕는 무료 웹 서비스입니다.
          </p>
          <p className="mt-2">
            본 서비스는 마이듀티(MYDUTY by 4wheels)와 제휴하거나 공식적으로
            연관되지 않은 독립적인 서비스입니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            2. 이용 조건
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>본 서비스는 회원가입 없이 누구나 무료로 이용할 수 있습니다.</li>
            <li>
              서비스 이용을 위해 유효한 마이듀티 공유 링크가 필요합니다.
            </li>
            <li>
              Google Calendar 또는 Naver Calendar 연동을 위해서는 해당 서비스의
              계정 인증이 필요합니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            3. 서비스 제공 범위
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>마이듀티 공유 링크에서 근무표 데이터를 추출합니다.</li>
            <li>추출된 근무표를 캘린더 형태로 미리보기를 제공합니다.</li>
            <li>
              근무 유형별 시간, 표시 이름 등의 규칙을 사용자가 직접 설정할 수
              있습니다.
            </li>
            <li>
              .ics 파일 다운로드 또는 캘린더 서비스에 직접 등록 기능을
              제공합니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            4. 면책 조항
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              본 서비스는 마이듀티 공유 링크의 데이터를 기반으로 동작하며,
              마이듀티 서비스의 구조 변경 시 정상 동작하지 않을 수 있습니다.
            </li>
            <li>
              변환된 일정의 정확성을 보장하지 않으며, 사용자가 미리보기에서
              내용을 확인한 후 등록할 책임이 있습니다.
            </li>
            <li>
              서비스 이용으로 인해 발생하는 일정 오류, 데이터 손실 등에 대해
              책임지지 않습니다.
            </li>
            <li>
              본 서비스는 별도의 사전 고지 없이 변경, 중단될 수 있습니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            5. 지적 재산권
          </h2>
          <p>
            본 서비스의 소스 코드, 디자인, 로고 등 모든 콘텐츠에 대한 권리는
            서비스 운영자에게 있습니다. &quot;마이듀티&quot; 및
            &quot;MYDUTY&quot;는 4wheels의 상표입니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            6. 금지 행위
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>서비스를 악용하여 마이듀티 서버에 과도한 부하를 주는 행위</li>
            <li>자동화된 도구를 이용한 대량의 반복 요청</li>
            <li>서비스의 보안을 위협하거나 취약점을 악용하는 행위</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            7. 약관 변경
          </h2>
          <p>
            본 약관은 서비스 운영 상황에 따라 변경될 수 있으며, 변경 시 본
            페이지를 통해 공지합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            8. 문의
          </h2>
          <p>
            이용약관에 관한 문의는 아래 GitHub를 통해 연락해 주세요.
          </p>
          <p className="mt-1">
            <a
              href="https://github.com/hexdrinker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              github.com/hexdrinker
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
