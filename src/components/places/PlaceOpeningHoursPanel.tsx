"use client";

import {
  WEEKDAYS,
  WEEKDAY_LABELS,
  formatDaySchedule,
  isAlwaysOpen,
  parseOpeningHours,
  type DaySchedule,
  type OpeningHours,
  type Weekday,
  type WeeklyOpeningHours,
  isWeeklyHours,
} from "@/lib/opening-hours";
import { cn } from "@/lib/cn";

interface PlaceOpeningHoursPanelProps {
  openingHours?: OpeningHours | null;
  className?: string;
}

export function PlaceOpeningHoursPanel({
  openingHours,
  className,
}: PlaceOpeningHoursPanelProps) {
  const hours = parseOpeningHours(openingHours);
  if (!hours) return null;

  if (isAlwaysOpen(hours)) {
    return (
      <section className={cn("rounded-2xl border border-border bg-surface p-4", className)}>
        <h3 className="mb-2 text-sm font-semibold text-accent-dark">
          Horário de funcionamento
        </h3>
        <p className="text-sm font-medium text-emerald-600">Aberto 24 horas</p>
      </section>
    );
  }

  if (!hours || !isWeeklyHours(hours)) return null;

  const hasAny = WEEKDAYS.some((day) => hours[day]);
  if (!hasAny) return null;

  const now = new Date();
  const todayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const todayKey = WEEKDAYS[todayIndex];

  return (
    <section className={cn("rounded-2xl border border-border bg-surface p-4", className)}>
      <h3 className="mb-3 text-sm font-semibold text-accent-dark">
        Horário de funcionamento
      </h3>
      <ul className="flex flex-col gap-2">
        {WEEKDAYS.map((day) => {
          const schedule = hours[day] as DaySchedule | undefined;
          const isToday = day === todayKey;

          return (
            <li
              key={day}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-sm",
                isToday && "bg-accent/5 font-medium",
              )}
            >
              <span className={cn(isToday ? "text-accent-dark" : "text-muted")}>
                {WEEKDAY_LABELS[day]}
              </span>
              <span className={cn(isToday ? "text-accent-dark" : "text-muted")}>
                {formatDaySchedule(schedule)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
