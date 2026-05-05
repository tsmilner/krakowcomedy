import { EventLanguage, EventType, Prisma } from "@prisma/client";
import { addDays, endOfDay, startOfDay } from "date-fns";
import { prisma } from "./prisma";

/** Matches default home/calendar listings (see buildEventWhere). */
export const UPCOMING_LISTING_DAYS = 120;

export function defaultUpcomingStartEnd() {
  const now = new Date();
  return {
    start: startOfDay(now),
    end: endOfDay(addDays(now, UPCOMING_LISTING_DAYS)),
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
      gte: filters.from ? startOfDay(new Date(filters.from)) : defaultRange.start,
      lte: filters.to ? endOfDay(new Date(filters.to)) : defaultRange.end,
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
  return prisma.venue.findMany({
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
}

/** Venues that have at least one event in the default listings window (e.g. calendar filter). */
export async function getVenuesWithUpcomingListings() {
  const { start, end } = defaultUpcomingStartEnd();
  const listingWindow = { gte: start, lte: end };
  return prisma.venue.findMany({
    where: {
      events: {
        some: { startDateTime: listingWindow },
      },
    },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}
