"use client";

import { useState } from "react";
import type { DutyRule } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/context";

interface DutyRuleSettingsProps {
  rules: DutyRule[];
  onUpdateRule: (code: string, updates: Partial<DutyRule>) => void;
}

export function DutyRuleSettings({
  rules,
  onUpdateRule,
}: DutyRuleSettingsProps) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{t.ruleSettings.title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.ruleSettings.description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="text-muted-foreground"
          >
            {isOpen ? t.ruleSettings.collapse : t.ruleSettings.expand}
          </Button>
        </div>

        {!isOpen && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {rules.map((rule) => (
              <Badge
                key={rule.code}
                variant="secondary"
                className={`text-xs font-medium shadow-sm ${rule.skip ? "opacity-30 line-through" : ""}`}
                style={{
                  backgroundColor: rule.color + "20",
                  color: rule.color,
                  borderColor: rule.color + "30",
                }}
              >
                {rule.displayName}
                {!rule.skip && !rule.isAllDay && (
                  <span className="ml-1 opacity-70">
                    {rule.startTime}~{rule.endTime}
                  </span>
                )}
                {rule.isAllDay && (
                  <span className="ml-1 opacity-70">
                    {t.ruleSettings.allDay}
                  </span>
                )}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      {isOpen && (
        <CardContent className="space-y-4 pt-0">
          {rules.map((rule) => (
            <div
              key={rule.code}
              className={`rounded-xl border p-4 transition-all ${
                rule.skip
                  ? "border-dashed bg-muted/20 opacity-50"
                  : "bg-card"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: rule.color }}
                  >
                    {rule.code.charAt(0)}
                  </span>
                  <span className="font-medium">{rule.code}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={`skip-${rule.code}`}
                    className="text-xs text-muted-foreground"
                  >
                    {t.ruleSettings.exclude}
                  </Label>
                  <Switch
                    id={`skip-${rule.code}`}
                    checked={rule.skip}
                    onCheckedChange={(checked) =>
                      onUpdateRule(rule.code, { skip: checked })
                    }
                  />
                </div>
              </div>

              {!rule.skip && (
                <div className="mt-4 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor={`name-${rule.code}`}
                        className="text-xs text-muted-foreground"
                      >
                        {t.ruleSettings.displayName}
                      </Label>
                      <Input
                        id={`name-${rule.code}`}
                        value={rule.displayName}
                        onChange={(e) =>
                          onUpdateRule(rule.code, {
                            displayName: e.target.value,
                          })
                        }
                        className="h-9"
                      />
                    </div>

                    <div className="flex items-end gap-3">
                      <div className="flex items-center gap-2 pb-1.5">
                        <Switch
                          id={`allday-${rule.code}`}
                          checked={rule.isAllDay}
                          onCheckedChange={(checked) =>
                            onUpdateRule(rule.code, { isAllDay: checked })
                          }
                        />
                        <Label
                          htmlFor={`allday-${rule.code}`}
                          className="text-xs text-muted-foreground"
                        >
                          {t.ruleSettings.allDay}
                        </Label>
                      </div>
                    </div>
                  </div>

                  {!rule.isAllDay && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor={`start-${rule.code}`}
                          className="text-xs text-muted-foreground"
                        >
                          {t.ruleSettings.startTime}
                        </Label>
                        <Input
                          id={`start-${rule.code}`}
                          type="time"
                          value={rule.startTime}
                          onChange={(e) =>
                            onUpdateRule(rule.code, {
                              startTime: e.target.value,
                            })
                          }
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor={`end-${rule.code}`}
                          className="text-xs text-muted-foreground"
                        >
                          {t.ruleSettings.endTime}
                        </Label>
                        <Input
                          id={`end-${rule.code}`}
                          type="time"
                          value={rule.endTime}
                          onChange={(e) =>
                            onUpdateRule(rule.code, {
                              endTime: e.target.value,
                            })
                          }
                          className="h-9"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
