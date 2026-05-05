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
