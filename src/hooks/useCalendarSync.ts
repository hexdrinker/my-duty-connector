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

const SESSION_KEY = "myduty-connector-oauth-pending";

function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || "ontouchstart" in window;
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

  // Handle popup callback (PC)
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

  // Handle redirect callback (mobile)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get("oauth_provider") as Provider | null;
    const oauthStatus = params.get("oauth_status");
    const token = params.get("oauth_token");

    if (!provider || !oauthStatus) return;

    // Clean up URL
    const url = new URL(window.location.href);
    url.searchParams.delete("oauth_provider");
    url.searchParams.delete("oauth_status");
    url.searchParams.delete("oauth_token");
    window.history.replaceState({}, "", url.pathname);

    if (oauthStatus === "error") {
      setError("인증에 실패했습니다");
      setStatus("error");
      return;
    }

    if (oauthStatus === "success" && token) {
      // Read saved events from sessionStorage
      try {
        const saved = sessionStorage.getItem(SESSION_KEY);
        if (saved) {
          const { events } = JSON.parse(saved) as {
            events: CalendarEvent[];
          };
          sessionStorage.removeItem(SESSION_KEY);
          setStatus("syncing");
          insertEvents(provider, token, events).catch((err: Error) => {
            setError(err.message);
            setStatus("error");
          });
        }
      } catch {
        setError("저장된 일정 데이터를 찾을 수 없습니다");
        setStatus("error");
      }
    }
  }, [insertEvents]);

  const sync = useCallback((provider: Provider, events: CalendarEvent[]) => {
    setStatus("authenticating");
    setError(null);
    setResult(null);
    pendingEventsRef.current = events;
    pendingProviderRef.current = provider;

    if (isMobile()) {
      // Mobile: save events to sessionStorage, redirect
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ provider, events }),
      );
      window.location.href = `/api/auth/${provider}?mode=redirect`;
    } else {
      // PC: popup
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
