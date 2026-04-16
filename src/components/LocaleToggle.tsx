"use client";

import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";

export function LocaleToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2 text-xs font-medium"
      onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
    >
      {locale === "ko" ? "EN" : "KO"}
    </Button>
  );
}
