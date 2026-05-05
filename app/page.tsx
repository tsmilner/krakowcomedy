import Link from "next/link";
import { CalendarClient } from "@/components/calendar-client";
import { EventCard } from "@/components/event-card";
import { ExternalLinks } from "@/components/external-links";
import { MapClient } from "@/components/map-client";
import { getEvents, getVenueWithEvents } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { formatEventDate } from "@/lib/utils";

export default async function Home() {
  const [upcoming, venues, organisers] = await Promise.all([
    getEvents({
      language: "",
      eventType: "",
    }),
    getVenueWithEvents(),
    prisma.organiser.findMany({
      where: { slug: { not: "love-lub-comedy" } },
      include: {
        events: {
          where: { startDateTime: { gte: new Date() } },
          orderBy: { startDateTime: "asc" },
          
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const calendarEvents = upcoming.map((event) => ({
    id: String(event.id),
    title: event.title,
    start: event.startDateTime.toISOString(),
    end: event.endDateTime ? event.endDateTime.toISOString() : undefined,
    url: `/events/${event.slug}`,
  }));

  return (
    <div id="top" className="space-y-8 sm:space-y-12">
      <section className="rounded-2xl border-2 border-cyan-500/35 bg-zinc-900/60 p-4 text-base leading-relaxed text-zinc-100 ring-1 ring-cyan-500/10 sm:p-6">
        We are here to provide information about English language comedy events in Krakow. For full details,
        lineups, entry rules, and updates, always check each individual organiser event page directly.
      </section>

      <section className="space-y-4 sm:space-y-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">Upcoming in Krakow</h2>
          <p className="mt-1 text-sm text-zinc-500">The next shows we know about.</p>
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
          <div className="mt-3">
            <a
              href="/api/calendar/all"
              className="inline-flex items-center rounded-full border border-violet-400/50 bg-violet-900/60 px-4 py-2 text-sm font-semibold text-violet-100 shadow-[0_0_14px_-4px_rgba(168,85,247,0.5)] transition-colors hover:bg-violet-800/70 hover:text-white"
            >
              Add all events to my Google Calendar
            </a>
          </div>
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
          <h2 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">Organisers</h2>
          <p className="mt-1 text-sm text-zinc-500">The people putting on nights in the city.</p>
        </div>
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {organisers.map((organiser) => {
            const isCozy = organiser.slug === "cozy-events";
            const isDzienTonic = organiser.slug === "dzien-tonic-story-slam";
            const websiteUrl = isDzienTonic
              ? "https://www.facebook.com/profile.php?id=100083820738347"
              : organiser.websiteUrl;
            const websiteLabel = isCozy ? "Meetup" : isDzienTonic ? "Andre San Miguel" : "Website";
            const facebookLabel = isCozy ? "Facebook Group" : "Facebook Page";

            return (
              <article
                key={organiser.id}
                className="rounded-2xl border-2 border-violet-500/35 bg-zinc-900/70 p-4 shadow-[0_0_28px_-10px_rgba(124,58,237,0.4)] ring-1 ring-cyan-500/10 transition-[box-shadow,border-color] hover:border-fuchsia-400/45 hover:shadow-[0_0_36px_-8px_rgba(217,70,239,0.3)] sm:p-6"
              >
              <h3 className="text-lg font-semibold tracking-tight text-zinc-50">
                {organiser.slug === "cozy-events" ? "Cozy Events (Story Slam)" : organiser.name}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">{organiser.description}</p>
              <div className="mt-4">
                <ExternalLinks
                  websiteUrl={websiteUrl}
                  websiteLabel={websiteLabel}
                  facebookLabel={facebookLabel}
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
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">{venue.description}</p>
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
