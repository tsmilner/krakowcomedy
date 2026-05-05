/**
 * Pulls upcoming events from Facebook **Page** endpoints via the official Meta Graph API.
 * This is not HTML scraping (which violates Facebook ToS and breaks constantly).
 *
 * Setup:
 * 1. Meta Developer app + Page access token with permission to read the Page's events
 *    (typically `pages_read_engagement` / `pages_show_list` depending on your app review).
 * 2. Copy `facebook-pages.sync.example.json` → `facebook-pages.sync.json` (gitignored).
 *    Map each Facebook Page id (numeric or username) to an organiser `slug` from your DB.
 * 3. Set env: FACEBOOK_GRAPH_ACCESS_TOKEN (Page or System User token that can read those pages)
 * 4. Run: npm run sync:facebook
 *
 * Docs: https://developers.facebook.com/docs/graph-api/reference/page/events/
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { PrismaClient, EventLanguage, EventType } from "@prisma/client";
import { slugify } from "../lib/utils";

const prisma = new PrismaClient();
const GRAPH = "https://graph.facebook.com/v21.0";

type PageRow = { facebookPageId: string; organiserSlug: string };
type SyncFile = { pages: PageRow[] };

type FbPlace = {
  name?: string;
  location?: {
    street?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
};

type FbEvent = {
  id: string;
  name: string;
  description?: string;
  start_time: string;
  end_time?: string;
  place?: FbPlace;
  ticket_uri?: string;
};

function loadConfig(): SyncFile {
  const file = path.join(process.cwd(), "facebook-pages.sync.json");
  if (!existsSync(file)) {
    console.error(
      "Missing facebook-pages.sync.json — copy facebook-pages.sync.example.json, fill Page ids + organiser slugs.",
    );
    process.exit(1);
  }
  return JSON.parse(readFileSync(file, "utf8")) as SyncFile;
}

function inferEventType(name: string, description: string): EventType {
  const t = `${name} ${description ?? ""}`.toLowerCase();
  // Open mic first: titles often say "standup" and "open mic" — that must stay OPEN_MIC, not STAND_UP.
  if (t.includes("open mic") || t.includes("open-mic") || t.includes("openmic")) return EventType.OPEN_MIC;
  if (t.includes("story slam") || t.includes("storyslam")) return EventType.STORY_SLAM;
  if (t.includes("stand-up") || t.includes("standup") || t.includes("stand up")) return EventType.STAND_UP;
  return EventType.OPEN_MIC;
}

async function findOrCreateVenue(place: FbPlace | undefined) {
  const name = place?.name?.trim() || "Venue TBA";
  const loc = place?.location;
  const lat = typeof loc?.latitude === "number" ? loc.latitude : 50.0614;
  const lng = typeof loc?.longitude === "number" ? loc.longitude : 19.9366;
  const street = loc?.street?.trim();
  const city = loc?.city?.trim() || "Kraków";
  const address = street ? `${street}, ${city}` : `${name}, ${city}`;

  let base = slugify(name);
  if (!base) base = "venue";
  const existing = await prisma.venue.findUnique({ where: { slug: base } });
  if (existing) return existing;

  let slug = base;
  let n = 1;
  while (await prisma.venue.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }

  return prisma.venue.create({
    data: {
      name,
      slug,
      address,
      latitude: lat,
      longitude: lng,
      area: null,
      description: "Imported from Facebook event place.",
    },
  });
}

async function fetchPageEvents(pageId: string, token: string): Promise<FbEvent[]> {
  const fields =
    "id,name,description,start_time,end_time,place{name,location{street,city,latitude,longitude}},ticket_uri";
  const collected: FbEvent[] = [];
  let url: string | null =
    `${GRAPH}/${encodeURIComponent(pageId)}/events?` +
    new URLSearchParams({
      access_token: token,
      fields,
      time_filter: "upcoming",
      limit: "50",
    }).toString();

  while (url) {
    const res = await fetch(url);
    const json: { data?: FbEvent[]; paging?: { next?: string }; error?: unknown } = await res.json();
    if (!res.ok || json.error) {
      console.error("Graph API error:", json);
      process.exit(1);
    }
    collected.push(...(json.data ?? []));
    url = json.paging?.next ?? null;
  }
  return collected;
}

async function main() {
  const token = process.env.FACEBOOK_GRAPH_ACCESS_TOKEN;
  if (!token?.trim()) {
    console.error("Set FACEBOOK_GRAPH_ACCESS_TOKEN (Page token that can read /{page-id}/events).");
    process.exit(1);
  }

  const { pages } = loadConfig();
  if (!pages?.length) {
    console.error('facebook-pages.sync.json must include a non-empty "pages" array.');
    process.exit(1);
  }

  const organisers = await prisma.organiser.findMany();
  const bySlug = new Map(organisers.map((o) => [o.slug, o]));

  let imported = 0;
  for (const row of pages) {
    const organiser = bySlug.get(row.organiserSlug);
    if (!organiser) {
      console.warn(`Skipping page ${row.facebookPageId}: no organiser with slug "${row.organiserSlug}".`);
      continue;
    }

    const events = await fetchPageEvents(row.facebookPageId, token);
    console.log(`Page ${row.facebookPageId} → ${events.length} upcoming event(s) for ${organiser.name}`);

    for (const ev of events) {
      const slug = `fb-${ev.id}`;
      const start = new Date(ev.start_time);
      const end = ev.end_time ? new Date(ev.end_time) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
      const venue = await findOrCreateVenue(ev.place);
      const fbUrl = `https://www.facebook.com/events/${ev.id}/`;
      const description = (ev.description ?? "").trim() || "Imported from Facebook.";
      const eventType = inferEventType(ev.name, description);

      await prisma.event.upsert({
        where: { slug },
        create: {
          slug,
          title: ev.name,
          description,
          startDateTime: start,
          endDateTime: end,
          eventType,
          language: EventLanguage.ENGLISH,
          organiserId: organiser.id,
          venueId: venue.id,
          facebookEventUrl: fbUrl,
          ticketUrl: ev.ticket_uri ?? null,
          websiteUrl: fbUrl,
          externalSourceName: "Facebook Graph",
          sourceNotes: `facebookEventId:${ev.id}`,
        },
        update: {
          title: ev.name,
          description,
          startDateTime: start,
          endDateTime: end,
          eventType,
          venueId: venue.id,
          facebookEventUrl: fbUrl,
          ticketUrl: ev.ticket_uri ?? null,
          websiteUrl: fbUrl,
          externalSourceName: "Facebook Graph",
          sourceNotes: `facebookEventId:${ev.id}`,
        },
      });
      imported++;
    }
  }

  console.log(`Done. Upserted ${imported} event(s).`);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
