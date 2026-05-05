import { EventLanguage, EventType } from "@prisma/client";
import { format } from "date-fns";

export function formatEventDate(date: Date) {
  return format(date, "EEE, d MMM yyyy");
}

export function formatEventTime(date: Date) {
  return format(date, "HH:mm");
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

