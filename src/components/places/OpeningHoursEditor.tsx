"use client";

import {
  WEEKDAYS,
  WEEKDAY_SHORT,
  createEmptyWeeklyHours,
  isAlwaysOpen,
  parseOpeningHours,
  type DaySchedule,
  type OpeningHours,
  type Weekday,
  type WeeklyOpeningHours,
} from "@/lib/opening-hours";
import { cn } from "@/lib/cn";

interface OpeningHoursEditorProps {
  value: OpeningHours;
  onChange: (value: OpeningHours) => void;
}

export function OpeningHoursEditor({ value, onChange }: OpeningHoursEditorProps) {
  const alwaysOpen = isAlwaysOpen(value);
  const weekly = alwaysOpen
    ? createEmptyWeeklyHours()
    : (value as WeeklyOpeningHours);

  function setAlwaysOpen(next: boolean) {
    if (next) {
      onChange({ alwaysOpen: true });
      return;
    }
    onChange(createEmptyWeeklyHours());
  }

  function updateDay(day: Weekday, patch: Partial<DaySchedule>) {
    const next = { ...weekly, [day]: { ...weekly[day], ...patch } };
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-accent-dark">
          Horário de funcionamento
        </span>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
          <input
            type="checkbox"
            checked={alwaysOpen}
            onChange={(e) => setAlwaysOpen(e.target.checked)}
            className="rounded-[4px]"
          />
          Aberto 24 horas
        </label>
      </div>

      {!alwaysOpen && (
        <div className="overflow-hidden rounded-2xl border border-border">
          {WEEKDAYS.map((day, index) => {
            const schedule = weekly[day] ?? {
              open: "09:00",
              close: "18:00",
              closed: false,
            };
            const closed = schedule.closed ?? false;

            return (
              <div
                key={day}
                className={cn(
                  "grid grid-cols-[2.5rem_1fr] items-center gap-2 px-3 py-2.5 sm:grid-cols-[2.5rem_1fr_auto_auto]",
                  index < WEEKDAYS.length - 1 && "border-b border-border",
                )}
              >
                <span className="text-xs font-semibold text-muted">
                  {WEEKDAY_SHORT[day]}
                </span>

                <label className="flex items-center gap-2 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={closed}
                    onChange={(e) => updateDay(day, { closed: e.target.checked })}
                    className="rounded-[4px]"
                  />
                  Fechado
                </label>

                <input
                  type="time"
                  disabled={closed}
                  value={schedule.open ?? "09:00"}
                  onChange={(e) => updateDay(day, { open: e.target.value })}
                  className="h-9 rounded-[6px] border border-border bg-surface px-2 text-xs text-accent-dark disabled:opacity-40"
                />
                <input
                  type="time"
                  disabled={closed}
                  value={schedule.close ?? "18:00"}
                  onChange={(e) => updateDay(day, { close: e.target.value })}
                  className="h-9 rounded-[6px] border border-border bg-surface px-2 text-xs text-accent-dark disabled:opacity-40"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function openingHoursFromUnknown(value: unknown): OpeningHours {
  const parsed = parseOpeningHours(value);
  if (!parsed || (!isAlwaysOpen(parsed) && !WEEKDAYS.some((d) => (parsed as WeeklyOpeningHours)[d]))) {
    return createEmptyWeeklyHours();
  }
  return parsed;
}
