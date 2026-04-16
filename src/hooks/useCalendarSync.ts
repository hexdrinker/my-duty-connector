"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { CalendarEvent } from "@/lib/types";

type Provider = "google" | "naver";
type SyncStatus = "idle" | "authenticating" | "syncing" | "success" | "error";

interface SyncResult {
  success: number;
  failed: number;
}

interface UseCalendarSync {
  status: SyncStatus;
  result: SyncResult | null;
  error: string | null;
  sync: (provider: Provider, events: CalendarEvent[]) => void;
  reset: () => void;
}

export function useCalendarSync(): UseCalendarSync {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pendingEventsRef = useRef<CalendarEvent[] | null>(null);
  const pendingProviderRef = useRef<Provider | null>(null);

  const insertEvents = useCallback(
    async (provider: Provider, accessToken: string, events: CalendarEvent[]) => {
      setStatus("syncing");

      const response = await fetch(`/api/calendar/${provider}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, events }),
      });

      if (!response.ok) {
        throw new Error("캘린더 등록에 실패했습니다");
      }

      const data: SyncResult = await response.json();
      setResult(data);
      setStatus("success");
    },
    [],
  );

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "oauth_callback") return;

      const { provider, status: authStatus, data } = event.data;

      if (authStatus === "error") {
        setError(data);
        setStatus("error");
        return;
      }

      if (
        authStatus === "success" &&
        pendingEventsRef.current &&
        pendingProviderRef.current === provider
      ) {
        insertEvents(provider, data, pendingEventsRef.current).catch(
          (err: Error) => {
            setError(err.message);
            setStatus("error");
          },
        );
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [insertEvents]);

  const sync = useCallback((provider: Provider, events: CalendarEvent[]) => {
    setStatus("authenticating");
    setError(null);
    setResult(null);
    pendingEventsRef.current = events;
    pendingProviderRef.current = provider;

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `/api/auth/${provider}`,
      `${provider}-oauth`,
      `width=${width},height=${height},left=${left},top=${top}`,
    );

    if (!popup) {
      setError("팝업이 차단되었습니다. 팝업 차단을 해제해주세요.");
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
    pendingEventsRef.current = null;
    pendingProviderRef.current = null;
  }, []);

  return { status, result, error, sync, reset };
}
