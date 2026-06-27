export const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
};

export const WEEKDAY_SHORT: Record<Weekday, string> = {
  monday: "Seg",
  tuesday: "Ter",
  wednesday: "Qua",
  thursday: "Qui",
  friday: "Sex",
  saturday: "Sáb",
  sunday: "Dom",
};

export interface DaySchedule {
  closed?: boolean;
  open?: string;
  close?: string;
}

export type WeeklyOpeningHours = Partial<Record<Weekday, DaySchedule>>;

export type OpeningHours =
  | { alwaysOpen: true }
  | WeeklyOpeningHours;

export function isWeeklyHours(
  hours: OpeningHours,
): hours is WeeklyOpeningHours {
  return !isAlwaysOpen(hours);
}

export function parseOpeningHours(value: unknown): OpeningHours | null {
  if (!value || typeof value !== "object") return null;
  if ("alwaysOpen" in value && (value as { alwaysOpen?: boolean }).alwaysOpen) {
    return { alwaysOpen: true };
  }
  return value as WeeklyOpeningHours;
}

export function isAlwaysOpen(hours: OpeningHours | null | undefined): boolean {
  return Boolean(hours && "alwaysOpen" in hours && hours.alwaysOpen);
}

export function hasWeeklyHours(hours: OpeningHours | null | undefined): boolean {
  if (!hours || isAlwaysOpen(hours)) return false;
  return WEEKDAYS.some((day) => {
    const dayHours = (hours as WeeklyOpeningHours)[day];
    return Boolean(dayHours && !dayHours.closed && dayHours.open && dayHours.close);
  });
}

export function hasOpeningHours(hours: OpeningHours | null | undefined): boolean {
  return isAlwaysOpen(hours) || hasWeeklyHours(hours);
}

function jsDayToWeekday(day: number): Weekday {
  return WEEKDAYS[day === 0 ? 6 : day - 1];
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(time: string): string {
  return time.slice(0, 5);
}

function getDaySchedule(
  hours: WeeklyOpeningHours,
  weekday: Weekday,
): DaySchedule | undefined {
  return hours[weekday];
}

export interface OpenStatus {
  isOpen: boolean;
  label: string;
  detail?: string;
}

export function getOpenStatus(
  hours: OpeningHours | null | undefined,
  now = new Date(),
): OpenStatus | null {
  if (!hours) return null;

  if (isAlwaysOpen(hours)) {
    return { isOpen: true, label: "Aberto 24 horas" };
  }

  if (!hasWeeklyHours(hours) || !isWeeklyHours(hours)) return null;

  const weekday = jsDayToWeekday(now.getDay());
  const today = getDaySchedule(hours, weekday);
  const minutes = now.getHours() * 60 + now.getMinutes();

  if (!today || today.closed || !today.open || !today.close) {
    const next = findNextOpen(hours, weekday);
    return {
      isOpen: false,
      label: "Fechado",
      detail: next ? `Abre ${next.label} às ${formatTime(next.open)}` : undefined,
    };
  }

  const openMin = toMinutes(today.open);
  const closeMin = toMinutes(today.close);

  if (minutes >= openMin && minutes < closeMin) {
    return {
      isOpen: true,
      label: "Aberto",
      detail: `Fecha às ${formatTime(today.close)}`,
    };
  }

  if (minutes < openMin) {
    return {
      isOpen: false,
      label: "Fechado",
      detail: `Abre hoje às ${formatTime(today.open)}`,
    };
  }

  const next = findNextOpen(hours, weekday, true);
  return {
    isOpen: false,
    label: "Fechado",
    detail: next ? `Abre ${next.label} às ${formatTime(next.open)}` : undefined,
  };
}

function findNextOpen(
  hours: WeeklyOpeningHours,
  fromWeekday: Weekday,
  skipToday = false,
) {
  const start = WEEKDAYS.indexOf(fromWeekday);
  for (let offset = skipToday ? 1 : 0; offset < 7; offset += 1) {
    const day = WEEKDAYS[(start + offset) % 7];
    const schedule = getDaySchedule(hours, day);
    if (schedule && !schedule.closed && schedule.open) {
      const label =
        offset === 0 ? "hoje" : offset === 1 ? "amanhã" : WEEKDAY_SHORT[day].toLowerCase();
      return { label, open: schedule.open };
    }
  }
  return null;
}

export function formatDaySchedule(day?: DaySchedule): string {
  if (!day || day.closed) return "Fechado";
  if (day.open && day.close) {
    return `${formatTime(day.open)} – ${formatTime(day.close)}`;
  }
  return "—";
}

export function createEmptyWeeklyHours(): WeeklyOpeningHours {
  return Object.fromEntries(
    WEEKDAYS.map((day) => [day, { open: "09:00", close: "18:00", closed: false }]),
  ) as WeeklyOpeningHours;
}

export function createAlwaysOpenHours(): OpeningHours {
  return { alwaysOpen: true };
}
