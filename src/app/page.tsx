"use client";

import { useEffect, useRef } from "react";
import { LinkInput } from "@/components/LinkInput";
import { DutyPreview } from "@/components/DutyPreview";
import { DutyRuleSettings } from "@/components/DutyRuleSettings";
import { DownloadButton } from "@/components/DownloadButton";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleToggle } from "@/components/LocaleToggle";
import { useParseLink } from "@/hooks/useParseLink";
import { useDutyRules } from "@/hooks/useDutyRules";
import { useI18n } from "@/lib/i18n/context";

export default function Home() {
  const { result, loading, error, parse } = useParseLink();
  const { rules, initFromUnits, updateRule } = useDutyRules();
  const { t } = useI18n();
  const toolRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) {
      initFromUnits(result.dutyUnits);
    }
  }, [result, initFromUnits]);

  const scrollToTool = () => {
    toolRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Nav bar */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-2">
          <span className="text-sm font-bold tracking-tight">
            MyDuty{" "}
            <span className="text-primary">Connector</span>
          </span>
          <div className="flex items-center gap-1">
            <LocaleToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-2xl px-4 pb-16 pt-20 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {t.hero.badge}
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t.hero.title}{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t.hero.titleAccent}
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t.hero.subtitle}
          </p>
        </div>
      </header>

      {/* Pain points */}
      <section className="border-b bg-muted/30 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-2 text-center text-xl font-bold">
            {t.landing.painTitle}
          </h2>
          <p className="mb-10 text-center text-sm text-muted-foreground">
            {t.landing.painDesc}
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                ),
                title: t.landing.pain1Title,
                desc: t.landing.pain1Desc,
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                ),
                title: t.landing.pain2Title,
                desc: t.landing.pain2Desc,
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h5"/><path d="M17.5 17.5 16 16.3V14"/><circle cx="16" cy="16" r="6"/></svg>
                ),
                title: t.landing.pain3Title,
                desc: t.landing.pain3Desc,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border bg-card p-5"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  {item.icon}
                </div>
                <h3 className="mb-1 text-sm font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-10 text-center text-xl font-bold">
            {t.landing.howItWorksTitle}
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                ),
                title: t.landing.step1Title,
                desc: t.landing.step1Desc,
              },
              {
                step: "2",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                ),
                title: t.landing.step2Title,
                desc: t.landing.step2Desc,
              },
              {
                step: "3",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                ),
                title: t.landing.step3Title,
                desc: t.landing.step3Desc,
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {item.icon}
                </div>
                <h3 className="mb-1 font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <button
              onClick={scrollToTool}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110 active:translate-y-px"
            >
              {t.landing.ctaButton}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Tool area */}
      <section ref={toolRef} className="py-12">
        <div className="mx-auto max-w-2xl px-4">
          <div className="space-y-6">
            <div className="animate-fade-in-up">
              <LinkInput onSubmit={parse} loading={loading} />
            </div>

            {error && (
              <div className="animate-fade-in-up">
                <ErrorDisplay message={error} />
              </div>
            )}

            {result && rules.length > 0 && (
              <>
                <div className="animate-fade-in-up">
                  <DutyPreview
                    entries={result.entries}
                    rules={rules}
                    userName={result.userName}
                    year={result.year}
                    month={result.month}
                  />
                </div>

                <div className="animate-fade-in-up-delay-1">
                  <DutyRuleSettings rules={rules} onUpdateRule={updateRule} />
                </div>

                <div className="animate-fade-in-up-delay-2">
                  <DownloadButton
                    entries={result.entries}
                    rules={rules}
                    year={result.year}
                    month={result.month}
                  />
                </div>

                <div className="animate-fade-in-up-delay-3 rounded-xl border bg-muted/30 p-5">
                  <h3 className="mb-3 text-sm font-semibold">
                    {t.guide.title}
                  </h3>
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                        G
                      </span>
                      <span>
                        <strong className="text-foreground">Google Calendar</strong>{" "}
                        &mdash; {t.guide.google}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                        A
                      </span>
                      <span>
                        <strong className="text-foreground">Apple Calendar</strong>{" "}
                        &mdash; {t.guide.apple}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                        N
                      </span>
                      <span>
                        <strong className="text-foreground">Naver Calendar</strong>{" "}
                        &mdash; {t.guide.naver}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        <p>{t.footer.description}</p>
        <p className="mt-2">
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://github.com/hexdrinker"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            hexdrinker
          </a>
          . All rights reserved.
        </p>
      </footer>
    </div>
  );
}
