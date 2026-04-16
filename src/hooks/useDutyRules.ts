"use client";

import { useState, useCallback, useEffect } from "react";
import type { DutyRule, MyDutyUnit } from "@/lib/types";

const STORAGE_KEY = "myduty-bridge-rules";

function unitToRule(unit: MyDutyUnit): DutyRule {
  const startTime = unit.startTime
    ? `${unit.startTime.slice(0, 2)}:${unit.startTime.slice(2, 4)}`
    : "";
  const endTime = unit.endTime
    ? `${unit.endTime.slice(0, 2)}:${unit.endTime.slice(2, 4)}`
    : "";

  return {
    code: unit.title,
    displayName: unit.title,
    startTime,
    endTime,
    isAllDay: unit.isWholeDay,
    skip: false,
    color: unit.color,
  };
}

export function useDutyRules() {
  const [rules, setRules] = useState<DutyRule[]>([]);

  // localStorage에서 저장된 규칙 로드
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setRules(JSON.parse(saved));
      }
    } catch {
      // localStorage 접근 실패 시 무시
    }
  }, []);

  // 규칙 변경 시 localStorage에 저장
  useEffect(() => {
    if (rules.length === 0) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
    } catch {
      // 저장 실패 시 무시
    }
  }, [rules]);

  const initFromUnits = useCallback(
    (units: MyDutyUnit[]) => {
      // 저장된 규칙이 있으면 병합, 없으면 API 데이터로 초기화
      let savedRules: DutyRule[] = [];
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) savedRules = JSON.parse(saved);
      } catch {
        // ignore
      }

      const savedMap = new Map(savedRules.map((r) => [r.code, r]));
      const newRules = units.map((unit) => {
        const saved = savedMap.get(unit.title);
        if (saved) {
          // 색상은 API에서 최신으로 갱신
          return { ...saved, color: unit.color };
        }
        return unitToRule(unit);
      });

      setRules(newRules);
    },
    [],
  );

  const updateRule = useCallback(
    (code: string, updates: Partial<DutyRule>) => {
      setRules((prev) =>
        prev.map((r) => (r.code === code ? { ...r, ...updates } : r)),
      );
    },
    [],
  );

  return { rules, initFromUnits, updateRule };
}
