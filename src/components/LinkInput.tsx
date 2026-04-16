"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";

interface LinkInputProps {
  onSubmit: (url: string, year?: number, month?: number) => void;
  loading: boolean;
}

export function LinkInput({ onSubmit, loading }: LinkInputProps) {
  const { t } = useI18n();
  const [url, setUrl] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [year, month] = selectedMonth.split("-").map(Number);
    onSubmit(url.trim(), year, month);
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="link" className="text-sm font-medium">
              {t.linkInput.label}
            </label>
            <Input
              id="link"
              type="url"
              placeholder={t.linkInput.placeholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className="h-11 text-base"
            />
            <p className="text-xs text-muted-foreground">{t.linkInput.hint}</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="month" className="text-sm font-medium">
              {t.linkInput.monthLabel}
            </label>
            <Input
              id="month"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              disabled={loading}
              className="h-11"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full text-base font-semibold transition-all"
            disabled={!url.trim() || loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t.linkInput.loading}
              </span>
            ) : (
              t.linkInput.submit
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
