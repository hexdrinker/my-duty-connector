import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | MyDuty Connector",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-8 text-2xl font-bold">개인정보처리방침</h1>
      <p className="mb-2 text-sm text-muted-foreground">
        최종 수정일: 2026년 4월 16일
      </p>

      <div className="space-y-8 text-sm leading-relaxed text-foreground/80">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            1. 서비스 개요
          </h2>
          <p>
            MyDuty Connector(이하 &quot;서비스&quot;)는 마이듀티 공유 링크를 캘린더
            파일(.ics)로 변환하거나, Google Calendar 및 Naver Calendar에 직접
            등록할 수 있도록 돕는 웹 서비스입니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            2. 수집하는 개인정보
          </h2>
          <p>
            본 서비스는 <strong>개인정보를 수집하거나 저장하지 않습니다.</strong>
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>회원가입 및 로그인 기능이 없습니다.</li>
            <li>
              마이듀티 공유 링크는 일정 변환을 위해 일시적으로 처리되며, 서버에
              저장되지 않습니다.
            </li>
            <li>
              근무표 데이터는 변환 완료 후 즉시 폐기되며, 어떠한 데이터베이스에도
              기록되지 않습니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            3. OAuth 인증 및 캘린더 접근
          </h2>
          <p>
            Google Calendar 또는 Naver Calendar에 일정을 직접 등록하기 위해 OAuth
            인증을 사용합니다.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Google Calendar:</strong> 사용자의 캘린더에 일정을 추가하기
              위해 <code>calendar.events</code> 권한을 요청합니다.
            </li>
            <li>
              <strong>Naver Calendar:</strong> 사용자의 캘린더에 일정을 추가하기
              위해 캘린더 API 접근 권한을 요청합니다.
            </li>
            <li>
              발급받은 액세스 토큰은 일정 등록에만 사용되며,{" "}
              <strong>서버에 저장하지 않고 즉시 폐기</strong>됩니다.
            </li>
            <li>
              사용자의 기존 캘린더 일정을 읽거나 수정하거나 삭제하지 않습니다.
            </li>
            <li>
              이메일, 프로필, 연락처 등 개인정보에 접근하지 않습니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            4. 쿠키 및 로컬 저장소
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              사용자가 설정한 근무 규칙(시간, 표시 이름 등)은 브라우저의
              localStorage에 저장되며, 서버로 전송되지 않습니다.
            </li>
            <li>
              OAuth 인증 과정에서 CSRF 방지를 위한 일시적 쿠키가 사용되며, 인증
              완료 후 자동 삭제됩니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            5. 분석 도구
          </h2>
          <p>
            서비스 개선을 위해 Vercel Analytics를 사용하여 페이지 조회수, 방문자
            수 등 익명화된 사용 통계를 수집합니다. 이 데이터는 개인을 식별할 수
            없습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            6. 제3자 제공
          </h2>
          <p>
            본 서비스는 사용자의 데이터를 제3자에게 판매, 공유 또는 제공하지
            않습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            7. 문의
          </h2>
          <p>
            개인정보처리방침에 관한 문의는 아래 GitHub를 통해 연락해 주세요.
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
