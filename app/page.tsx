import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClient } from "@/components/calendar-client";
import { EventCard } from "@/components/event-card";
import { ExternalLinks } from "@/components/external-links";
import { MapClient } from "@/components/map-client";
import { getEvents, getVenueWithEvents } from "@/lib/data";
import { editorialNote, getOrganiserDescription, getVenueDescription } from "@/lib/editorial";
import { prisma } from "@/lib/prisma";
import { formatEventDate, toKrakowDatetimeLocalValue } from "@/lib/utils";

const NON_LOCAL_ORGANISER_SLUGS = ["love-lub-comedy", "miguel-aliaga", "victor-patrascan"];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description:
    "Kraków has a growing English-language comedy scene: weekly stand-up nights, open mics for trying material, improv jams, and story-driven formats like slam storytelling. Krakow Comedy Calendar pulls listings together so you can see what is on, where it is on the map, and who runs each night, then links straight through to organisers' official event posts for full details and signup threads.",
  openGraph: {
    title: "English comedy nights in Kraków — curated calendar",
    description:
      "Stand-up, open mics, improv & stories across Kraków — dates, venues, organisers and links to official event pages.",
    url: "/",
  },
};

export default async function Home() {
  const [upcoming, venues, organisersRaw] = await Promise.all([
    getEvents({
      language: "",
      eventType: "",
    }),
    getVenueWithEvents(),
    prisma.organiser.findMany({
      where: { slug: { notIn: NON_LOCAL_ORGANISER_SLUGS } },
      include: {
        events: {
          where: {
            startDateTime: { gte: new Date() },
            language: "ENGLISH",
          },
          orderBy: { startDateTime: "asc" },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const calendarEvents = upcoming.map((event) => ({
    id: String(event.id),
    title: event.title,
    start: toKrakowDatetimeLocalValue(event.startDateTime),
    end: event.endDateTime ? toKrakowDatetimeLocalValue(event.endDateTime) : undefined,
    url: `/events/${event.slug}`,
  }));
  const organisers = [...organisersRaw].sort((a, b) => {
    const isBottom = (slug: string) => slug === "cozy-events" || slug === "improv-comedy-in-cracow";
    const aBottom = isBottom(a.slug);
    const bBottom = isBottom(b.slug);
    if (aBottom !== bBottom) return aBottom ? 1 : -1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div id="top" className="space-y-8 sm:space-y-12">
      <h1 className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-center text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
        English-language comedy nights in Kraków
      </h1>
      <section className="space-y-4 rounded-2xl border-2 border-cyan-500/35 bg-zinc-900/60 p-4 text-base leading-relaxed text-zinc-100 ring-1 ring-cyan-500/10 sm:p-6">
        <p>
          Krakow Comedy is a manually curated guide to English-language comedy in Krakow. The site exists
          because the local scene is active but scattered: one night may be announced on Facebook, another
          through an Instagram post, a Meetup group, a ticketing page, or a venue calendar. Instead of making
          people search through several feeds, this guide brings the most useful public details into one
          practical place: what is happening, when it starts, where it is, who runs it, and where to check the
          official source.
        </p>
        <p>
          The calendar covers stand-up shows, open mics, improv nights, story slams, and occasional touring
          English-language performances. Some listings are polished ticketed shows; others are small rooms
          where local performers try new material. That mix matters. Locals can see what is worth going to
          this week, expats can find rooms where English is the working language, tourists can plan an evening
          that is not only another pub crawl, and performers can spot organisers who may be accepting signup
          requests.
        </p>
        <p>
          This is not an automatic scrape of every event with the word comedy in it. Listings are chosen and
          checked by hand for relevance to the English-speaking comedy scene in Krakow. The focus is on events
          that a real person could reasonably attend, perform at, or use to understand the local scene. When an
          event is vague, duplicated, expired, or missing an official source, it may be left out until it can be
          verified.
        </p>
        <p>
          The guide also tries to add context that a raw calendar cannot. A visitor may not know whether a
          night is a casual open mic, a prepared showcase, an improv format, or a themed storytelling event. A
          performer may need to know which organiser to contact before asking for stage time. A new resident
          may simply want to find a friendly English-speaking room without joining every local group first.
          Those are the everyday problems this site is meant to solve.
        </p>
        <p>
          Krakow has a compact but varied comedy scene, and the most useful information is often local and
          practical: neighbourhood, venue style, show format, organiser, and the official link to follow for
          updates. The listings here are written with that in mind. They are not reviews, paid placements, or
          claims that an event will be good. They are a curated starting point for deciding what to check next.
        </p>
        <p>
          Comedy listings can change quickly. Venues move rooms, lineups change, start times shift, and some
          open mics use the event discussion as the performer signup list. Use this site as a clear starting
          point, then check the organiser&apos;s official event page before travelling, buying tickets, or asking
          for a spot. {editorialNote}
        </p>
      </section>

      <section className="space-y-4 sm:space-y-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">Upcoming in Krakow</h2>
          <p className="mt-1 text-sm text-zinc-500">
            The next manually checked English-language listings, with links back to organiser sources.
          </p>
        </div>
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {upcoming.slice(0, 8).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section id="calendar" className="space-y-4 sm:space-y-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">Calendar</h2>
        </div>
        <CalendarClient events={calendarEvents} compact />
      </section>

      <section className="space-y-4 sm:space-y-5">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">How to get involved</h2>
        <p className="text-zinc-400">
          Want to perform? Check the event links on Facebook first, then post in the event discussion/comments
          to ask for a spot. Most organisers use the event post as the main signup channel.
        </p>
      </section>

      <section id="organisers" className="space-y-4 sm:space-y-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
            Kraków organisers
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Local groups and hosts regularly putting on English-language nights in the city.
          </p>
        </div>
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {organisers.map((organiser) => {
            const isCozy = organiser.slug === "cozy-events";
            const isDzienTonic = organiser.slug === "dzien-tonic-story-slam";
            const isNotGay = organiser.slug === "not-gay-at-all-comedy";
            const websiteUrl = isDzienTonic
              ? "https://www.facebook.com/profile.php?id=100083820738347"
              : organiser.websiteUrl;
            const websiteLabel = isCozy
              ? "Meetup"
              : isDzienTonic
                ? "André San Miguel"
                : isNotGay
                  ? "Stan"
                  : "Website";
            const facebookLabel = isCozy ? "Facebook Group" : "Facebook Page";
            const instagramLabel = isNotGay ? "Luke" : "Instagram";

            return (
              <article
                key={organiser.id}
                className="rounded-2xl border-2 border-violet-500/35 bg-zinc-900/70 p-4 shadow-[0_0_28px_-10px_rgba(124,58,237,0.4)] ring-1 ring-cyan-500/10 transition-[box-shadow,border-color] hover:border-fuchsia-400/45 hover:shadow-[0_0_36px_-8px_rgba(217,70,239,0.3)] sm:p-6"
              >
              <h3 className="text-lg font-semibold tracking-tight text-zinc-50">
                {organiser.slug === "cozy-events" ? "Cozy Events (Story Slam)" : organiser.name}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                {getOrganiserDescription(organiser)}
              </p>
              <div className="mt-4">
                <ExternalLinks
                  websiteUrl={websiteUrl}
                  websiteLabel={websiteLabel}
                  facebookLabel={facebookLabel}
                  instagramLabel={instagramLabel}
                  facebookUrl={organiser.slug === "not-gay-at-all-comedy" ? null : organiser.facebookUrl}
                  instagramUrl={organiser.instagramUrl}
                />
              </div>
              <div className="mt-4 border-t border-zinc-700/60 pt-4">
                <p className="mb-2 text-sm font-semibold text-fuchsia-300/90">Upcoming events</p>
                {organiser.events.length > 0 ? (
                  <ul className="space-y-2 text-sm text-zinc-400">
                    {organiser.events.map((event) => (
                      <li key={event.id}>
                        <Link
                          href={`/events/${event.slug}`}
                          className="font-medium text-cyan-200 underline decoration-fuchsia-500/40 underline-offset-2 transition-colors hover:text-fuchsia-200"
                        >
                          {event.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-zinc-500">No upcoming events currently listed.</p>
                )}
              </div>
              </article>
            );
          })}
        </div>
        <Link
          href="/touring-comics"
          className="inline-flex rounded-full border border-cyan-500/35 bg-zinc-900/70 px-4 py-2 text-sm font-semibold text-cyan-100 transition-colors hover:border-fuchsia-400/50 hover:text-white"
        >
          See touring comics performing in English
        </Link>
      </section>

      <section id="map" className="space-y-4 sm:space-y-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">Venue map</h2>
          <p className="mt-1 text-sm text-zinc-500">Tap markers for upcoming nights at each spot.</p>
        </div>
        <MapClient venues={venues} />
      </section>

      <section id="venues" className="space-y-4 sm:space-y-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">Venues</h2>
          <p className="mt-1 text-sm text-zinc-500">Where the shows happen.</p>
        </div>
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {venues.map((venue) => (
            <article
              key={venue.id}
              className="rounded-2xl border-2 border-violet-500/35 bg-zinc-900/70 p-4 shadow-[0_0_28px_-10px_rgba(124,58,237,0.4)] ring-1 ring-cyan-500/10 transition-[box-shadow,border-color] hover:border-fuchsia-400/45 hover:shadow-[0_0_36px_-8px_rgba(217,70,239,0.3)] sm:p-6"
            >
              <h3 className="text-lg font-semibold tracking-tight">
                <Link
                  href={`/map?venue=${venue.slug}`}
                  className="text-cyan-200 underline decoration-fuchsia-500/40 underline-offset-2 transition-colors hover:text-fuchsia-200"
                >
                  {venue.name}
                </Link>
              </h3>
              <p className="mt-1.5 text-sm text-zinc-500">
                {venue.address}
                {venue.area ? ` · ${venue.area}` : ""}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                {getVenueDescription(venue)}
              </p>
              <div className="mt-4">
                <ExternalLinks
                  websiteUrl={venue.websiteUrl}
                  facebookUrl={venue.facebookUrl}
                  instagramUrl={venue.instagramUrl}
                />
              </div>
              <ul className="mt-4 space-y-2 border-t border-zinc-700/60 pt-4 text-sm text-zinc-400">
                {venue.events.slice(0, 3).map((event) => (
                  <li key={event.id} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                    <Link
                      href={`/events/${event.slug}`}
                      className="font-medium text-cyan-200 underline decoration-fuchsia-500/40 underline-offset-2 transition-colors hover:text-fuchsia-200"
                    >
                      {event.title}
                    </Link>
                    <span className="text-xs text-cyan-100/90 sm:text-sm">{formatEventDate(event.startDateTime)}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
