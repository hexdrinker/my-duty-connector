"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { DutyEntry, DutyRule } from "@/lib/types";
import { entriesToIcs } from "@/lib/ics/generator";
import { useI18n } from "@/lib/i18n/context";

interface DownloadButtonProps {
  entries: DutyEntry[];
  rules: DutyRule[];
  year: number;
  month: number;
}

export function DownloadButton({
  entries,
  rules,
  year,
  month,
}: DownloadButtonProps) {
  const { t } = useI18n();

  const handleDownload = useCallback(() => {
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
  }, [entries, rules, year, month]);

  const activeEntries = entries.filter((e) => {
    const rule = rules.find((r) => r.code === e.dutyCode);
    return rule && !rule.skip;
  });

  const buttonText = t.download.button.replace(
    "{count}",
    String(activeEntries.length),
  );

  return (
    <Button
      onClick={handleDownload}
      size="lg"
      className="h-14 w-full text-base font-semibold shadow-md transition-all hover:shadow-lg"
      disabled={activeEntries.length === 0}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-2"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
      {buttonText}
    </Button>
  );
}
