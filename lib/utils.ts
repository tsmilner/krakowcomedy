import { EventLanguage, EventType } from "@prisma/client";

/** All comedy events are in Kraków — always display/store wall times in this zone. */
export const EVENT_TIMEZONE = "Europe/Warsaw";

export function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: EVENT_TIMEZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatEventTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: EVENT_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(date);
}

/** `datetime-local` value (YYYY-MM-DDTHH:mm) interpreted as Kraków wall time. */
export function parseKrakowDatetimeLocal(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) return new Date(value.trim());

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);

  const asUtc = Date.UTC(year, month - 1, day, hour, minute);
  const pretended = new Date(asUtc);
  const inTz = new Intl.DateTimeFormat("en-US", {
    timeZone: EVENT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(pretended);

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(inTz.find((p) => p.type === type)?.value);

  const displayed = Date.UTC(
    part("year"),
    part("month") - 1,
    part("day"),
    part("hour"),
    part("minute"),
    part("second"),
  );

  return new Date(asUtc - (displayed - asUtc));
}

/** Format a stored instant for HTML `datetime-local` inputs (Kraków wall time). */
export function toKrakowDatetimeLocalValue(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: EVENT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export function eventTypeLabel(eventType: EventType) {
  return eventType.replace("_", " ").toLowerCase();
}

export function languageLabel(language: EventLanguage) {
  if (language === "ENGLISH") return "English";
  if (language === "POLISH") return "Polish";
  return "Bilingual";
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toGoogleDateTime(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function buildGoogleCalendarUrl(input: {
  title: string;
  startDateTime: Date;
  endDateTime?: Date | null;
  description?: string | null;
  location?: string | null;
}) {
  const start = input.startDateTime;
  const end = input.endDateTime ?? new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    dates: `${toGoogleDateTime(start)}/${toGoogleDateTime(end)}`,
  });

  if (input.description) params.set("details", input.description);
  if (input.location) params.set("location", input.location);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

