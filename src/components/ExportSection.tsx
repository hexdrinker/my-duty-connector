"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DutyEntry, DutyRule } from "@/lib/types";
import { buildCalendarEvents, entriesToIcs } from "@/lib/ics/generator";
import { trackIcsDownloaded } from "@/lib/analytics";
import { useCalendarSync } from "@/hooks/useCalendarSync";
import { useI18n } from "@/lib/i18n/context";

interface ExportSectionProps {
  entries: DutyEntry[];
  rules: DutyRule[];
  year: number;
  month: number;
}

export function ExportSection({
  entries,
  rules,
  year,
  month,
}: ExportSectionProps) {
  const { t } = useI18n();
  const { status, result, error, sync, reset } = useCalendarSync();

  const activeEntries = entries.filter((e) => {
    const rule = rules.find((r) => r.code === e.dutyCode);
    return rule && !rule.skip;
  });

  const events = buildCalendarEvents(entries, rules);

  const handleDownload = useCallback(() => {
    trackIcsDownloaded(activeEntries.length, year, month);
    const icsContent = entriesToIcs(entries, rules);
    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `myduty-${year}-${String(month).padStart(2, "0")}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [entries, rules, year, month, activeEntries.length]);

  const handleGoogleSync = () => sync("google", events);
  const handleNaverSync = () => sync("naver", events);

  const isBusy = status === "authenticating" || status === "syncing";

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{t.export.title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t.export.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* ICS Download */}
        <Button
          onClick={handleDownload}
          variant="outline"
          size="lg"
          className="h-12 w-full justify-start gap-3 text-sm font-medium"
          disabled={activeEntries.length === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          {t.export.icsDownload}
        </Button>

        {/* Google Calendar */}
        <Button
          onClick={handleGoogleSync}
          variant="outline"
          size="lg"
          className="h-12 w-full justify-start gap-3 text-sm font-medium"
          disabled={activeEntries.length === 0 || isBusy}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {isBusy && pendingIsGoogle(status) ? t.export.syncing : t.export.googleCalendar}
        </Button>

        {/* Naver Calendar */}
        <Button
          onClick={handleNaverSync}
          variant="outline"
          size="lg"
          className="h-12 w-full justify-start gap-3 text-sm font-medium"
          disabled={activeEntries.length === 0 || isBusy}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <rect width="24" height="24" rx="4" fill="#03C75A"/>
            <path d="M13.4 12.5L10.3 7.5H7.5V16.5H10.6V11.5L13.7 16.5H16.5V7.5H13.4V12.5Z" fill="white"/>
          </svg>
          {isBusy && !pendingIsGoogle(status) ? t.export.syncing : t.export.naverCalendar}
        </Button>

        {/* Status messages */}
        {status === "authenticating" && (
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {t.export.authenticating}
          </div>
        )}

        {status === "syncing" && (
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {t.export.syncing}
          </div>
        )}

        {status === "success" && result && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
            {t.export.successMessage
              .replace("{success}", String(result.success))
              .replace("{failed}", String(result.failed))}
            <button
              onClick={reset}
              className="ml-2 underline underline-offset-2"
            >
              {t.export.dismiss}
            </button>
          </div>
        )}

        {status === "error" && error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
            <button
              onClick={reset}
              className="ml-2 underline underline-offset-2"
            >
              {t.export.dismiss}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function pendingIsGoogle(_status: string): boolean {
  // This is a simplified check; in practice the provider is tracked in the hook
  return true;
}
