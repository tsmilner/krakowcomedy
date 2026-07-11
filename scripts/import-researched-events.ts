/**
 * Upserts events ONLY when a direct Facebook event URL is provided.
 * Run: npx tsx scripts/import-researched-events.ts
 *
 * RULES — do not violate:
 * - facebookEventUrl is REQUIRED and must be https://www.facebook.com/events/{id}/
 * - Never infer dates, venues, or titles.
 * - Never use aggregator sites (HappeningNext, AllEvents, etc.) as the sole source.
 * - User-supplied Facebook event links or npm run sync:facebook only.
 */

import { EventLanguage, EventType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FB_EVENT = /^https:\/\/(www\.)?facebook\.com\/events\/\d+/;

type ImportEvent = {
  slug: string;
  title: string;
  description: string;
  start: string;
  end?: string;
  eventType: EventType;
  organiserSlug: string;
  venueSlug: string;
  facebookEventUrl: string;
  ticketUrl?: string;
  websiteUrl?: string;
  externalSourceName?: string;
  sourceNotes?: string;
};

function assertFacebookEventUrl(event: ImportEvent) {
  if (!FB_EVENT.test(event.facebookEventUrl.trim())) {
    throw new Error(
      `Refusing to import "${event.slug}": facebookEventUrl must be a direct Facebook event link.`,
    );
  }
}

type ImportVenue = {
  slug: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  area: string;
  description: string;
};

/** Add rows here only with a confirmed facebook.com/events/… URL. */
const venues: ImportVenue[] = [];

const events: ImportEvent[] = [
  {
    slug: "krakow-story-slam-the-most-out-of-place-i-felt-2026-07-24",
    title: 'Krakow Story Slam: "The Most Out of Place I Felt."',
    description:
      "English-language true-story open mic with the theme The Most Out of Place I Felt. Stories are 5–7 minutes; audience judges score each tale.",
    start: "2026-07-24T19:00:00+02:00",
    end: "2026-07-24T21:30:00+02:00",
    eventType: EventType.STORY_SLAM,
    organiserSlug: "cozy-events",
    venueSlug: "the-atrium-hotel",
    facebookEventUrl: "https://www.facebook.com/events/1998006590835841/",
    websiteUrl: "https://www.facebook.com/events/1998006590835841/",
    externalSourceName: "Facebook",
    sourceNotes: "facebookEventId:1998006590835841; user-supplied link.",
  },
];

/** Events added without a direct Facebook event URL — removed from calendar. */
const removeSlugs = [
  "english-stand-up-open-mic-krak-me-up-2026-08-20",
  "the-hot-chocolate-comedy-show-2026-07-18",
  "the-hot-chocolate-comedy-show-2026-08-18",
  "omnibus-course-graduation-show-2026-07-09",
  "omnibus-medieval-tale-ivy-bar-2026-07-15",
  "discount-comedy-open-mic-2026-07-11",
  "unknown-comedy-show-2026-08-20",
  "mystery-comedy-show-open-mic-2026-09-17",
  "english-stand-up-comedy-open-mic-krakow-2026-09-04",
];

async function main() {
  for (const venue of venues) {
    await prisma.venue.upsert({
      where: { slug: venue.slug },
      create: venue,
      update: {
        name: venue.name,
        address: venue.address,
        latitude: venue.latitude,
        longitude: venue.longitude,
        area: venue.area,
        description: venue.description,
      },
    });
  }

  const removed = await prisma.event.deleteMany({ where: { slug: { in: removeSlugs } } });
  if (removed.count) console.log(`Removed ${removed.count} unverified event(s).`);

  let created = 0;
  let updated = 0;

  for (const event of events) {
    assertFacebookEventUrl(event);
    const organiser = await prisma.organiser.findUnique({ where: { slug: event.organiserSlug } });
    const venue = await prisma.venue.findUnique({ where: { slug: event.venueSlug } });
    if (!organiser) {
      console.warn(`Skip ${event.slug}: missing organiser ${event.organiserSlug}`);
      continue;
    }
    if (!venue) {
      console.warn(`Skip ${event.slug}: missing venue ${event.venueSlug}`);
      continue;
    }

    const data = {
      title: event.title,
      description: event.description,
      startDateTime: new Date(event.start),
      endDateTime: event.end ? new Date(event.end) : null,
      eventType: event.eventType,
      language: EventLanguage.ENGLISH,
      organiserId: organiser.id,
      venueId: venue.id,
      facebookEventUrl: event.facebookEventUrl,
      ticketUrl: event.ticketUrl ?? null,
      websiteUrl: event.websiteUrl ?? event.facebookEventUrl,
      externalSourceName: event.externalSourceName ?? "Facebook",
      sourceNotes: event.sourceNotes ?? null,
      isRecurring: false,
    };

    const existing = await prisma.event.findUnique({ where: { slug: event.slug } });
    await prisma.event.upsert({
      where: { slug: event.slug },
      create: { slug: event.slug, ...data },
      update: data,
    });
    if (existing) updated++;
    else created++;
    console.log(`${existing ? "Updated" : "Added"}: ${event.title}`);
  }

  console.log(`Done. ${created} added, ${updated} updated.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
