import { EventLanguage, EventType, Prisma } from "@prisma/client";
import { addDays } from "date-fns";
import { prisma } from "./prisma";
import { EVENT_TIMEZONE, parseKrakowDatetimeLocal } from "./utils";

/** Matches default home/calendar listings (see buildEventWhere). */
export const UPCOMING_LISTING_DAYS = 120;

function dateInputValueInKrakow(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: EVENT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function defaultUpcomingStartEnd() {
  const now = new Date();
  const startDate = dateInputValueInKrakow(now);
  const endDate = dateInputValueInKrakow(addDays(now, UPCOMING_LISTING_DAYS));

  return {
    start: parseKrakowDatetimeLocal(`${startDate}T00:00`),
    end: parseKrakowDatetimeLocal(`${endDate}T23:59`),
  };
}

export type EventFilters = {
  language?: EventLanguage | "";
  eventType?: EventType | "";
  venueId?: string;
  organiserId?: string;
  from?: string;
  to?: string;
};

export function buildEventWhere(filters: EventFilters): Prisma.EventWhereInput {
  const defaultRange = defaultUpcomingStartEnd();
  const where: Prisma.EventWhereInput = {
    startDateTime: {
      gte: filters.from
        ? parseKrakowDatetimeLocal(`${filters.from}T00:00`)
        : defaultRange.start,
      lte: filters.to
        ? parseKrakowDatetimeLocal(`${filters.to}T23:59`)
        : defaultRange.end,
    },
  };

  if (filters.language) where.language = filters.language;
  if (filters.eventType) where.eventType = filters.eventType;
  if (filters.venueId) where.venueId = Number(filters.venueId);
  if (filters.organiserId) where.organiserId = Number(filters.organiserId);

  return where;
}

export async function getEvents(filters: EventFilters = {}) {
  return prisma.event.findMany({
    where: buildEventWhere(filters),
    include: {
      venue: true,
      organiser: true,
      tags: { include: { tag: true } },
    },
    orderBy: { startDateTime: "asc" },
  });
}

export async function getFeaturedEvents() {
  return prisma.event.findMany({
    where: {
      isFeatured: true,
      startDateTime: { gte: new Date() },
    },
    include: {
      venue: true,
      organiser: true,
    },
    orderBy: { startDateTime: "asc" },
    take: 4,
  });
}

export async function getVenueWithEvents() {
  const { start, end } = defaultUpcomingStartEnd();
  const listingWindow = { gte: start, lte: end };
  const venues = await prisma.venue.findMany({
    where: {
      events: {
        some: { startDateTime: listingWindow },
      },
    },
    include: {
      events: {
        where: { startDateTime: listingWindow },
        include: { organiser: true },
        orderBy: { startDateTime: "asc" },
        take: 5,
      },
    },
    orderBy: { name: "asc" },
  });

  return venues.sort((a, b) => {
    const aNext = a.events[0]?.startDateTime?.getTime() ?? Number.POSITIVE_INFINITY;
    const bNext = b.events[0]?.startDateTime?.getTime() ?? Number.POSITIVE_INFINITY;
    if (aNext !== bNext) return aNext - bNext;
    return a.name.localeCompare(b.name);
  });
}

/** Venues that have at least one event in the default listings window (e.g. calendar filter). */
export async function getVenuesWithUpcomingListings() {
  const { start, end } = defaultUpcomingStartEnd();
  const listingWindow = { gte: start, lte: end };
  const venues = await prisma.venue.findMany({
    where: {
      events: {
        some: { startDateTime: listingWindow },
      },
    },
    include: {
      events: {
        where: { startDateTime: listingWindow },
        select: { startDateTime: true },
        orderBy: { startDateTime: "asc" },
        take: 1,
      },
    },
  });

  return venues
    .sort((a, b) => {
      const aNext = a.events[0]?.startDateTime?.getTime() ?? Number.POSITIVE_INFINITY;
      const bNext = b.events[0]?.startDateTime?.getTime() ?? Number.POSITIVE_INFINITY;
      if (aNext !== bNext) return aNext - bNext;
      return a.name.localeCompare(b.name);
    })
    .map((venue) => ({ id: venue.id, name: venue.name }));
}
