"use client";

import { useState, useCallback } from "react";
import type { ParseResult } from "@/lib/types";
import { trackLinkSubmitted, trackParseSuccess, trackParseFailed } from "@/lib/analytics";

interface UseParseLink {
  result: ParseResult | null;
  loading: boolean;
  error: string | null;
  parse: (url: string, year?: number, month?: number) => Promise<void>;
  reset: () => void;
}

export function useParseLink(): UseParseLink {
  const [result, setResult] = useState<ParseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parse = useCallback(
    async (url: string, year?: number, month?: number) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        trackLinkSubmitted(url);

        const response = await fetch("/api/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, year, month }),
        });

        const data = await response.json();

        if (!response.ok) {
          trackParseFailed(data.code || "UNKNOWN");
          setError(data.error || "알 수 없는 오류가 발생했습니다");
          return;
        }

        const parsed = data as ParseResult;
        trackParseSuccess(parsed.userName, parsed.entries.length, parsed.year, parsed.month);
        setResult(parsed);
      } catch {
        setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { result, loading, error, parse, reset };
}
