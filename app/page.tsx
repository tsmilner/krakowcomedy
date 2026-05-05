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
    <div id="top" className="space-y-12">
      <section className="rounded-2xl border border-cyan-500/30 bg-zinc-900/60 p-5 text-base leading-relaxed text-zinc-100 ring-1 ring-cyan-500/10 sm:p-6">
        We are here to provide information about English language comedy events in Krakow. For full details,
        lineups, entry rules, and updates, always check each individual organiser event page directly.
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">Upcoming in Krakow</h2>
          <p className="mt-1 text-sm text-zinc-500">The next shows we know about.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {upcoming.slice(0, 8).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section id="calendar" className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">Calendar</h2>
        </div>
        <CalendarClient events={calendarEvents} compact />
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">How to get involved</h2>
        <p className="text-zinc-400">
          Want to perform? Check the event links on Facebook first, then post in the event discussion/comments
          to ask for a spot. Most organisers use the event post as the main signup channel.
        </p>
      </section>

      <section id="organisers" className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">Organisers</h2>
          <p className="mt-1 text-sm text-zinc-500">The people putting on nights in the city.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {organisers.map((organiser) => {
            const isCozy = organiser.slug === "cozy-events";
            const isDzienTonic = organiser.slug === "dzien-tonic-story-slam";
            const websiteUrl = isDzienTonic
              ? "https://www.facebook.com/profile.php?id=100083820738347"
              : organiser.websiteUrl;
            const websiteLabel = isCozy ? "Meetup" : isDzienTonic ? "Andre San Miguel" : "Website";

            return (
              <article
                key={organiser.id}
                className="rounded-2xl border border-violet-500/30 bg-zinc-900/70 p-6 shadow-[0_0_28px_-10px_rgba(124,58,237,0.4)] ring-1 ring-cyan-500/10 transition-[box-shadow,border-color] hover:border-fuchsia-400/40 hover:shadow-[0_0_36px_-8px_rgba(217,70,239,0.3)]"
              >
              <h3 className="text-lg font-semibold tracking-tight text-zinc-50">
                {organiser.slug === "cozy-events" ? "Cozy Events (Story Slam)" : organiser.name}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">{organiser.description}</p>
              <div className="mt-4">
                <ExternalLinks
                  websiteUrl={websiteUrl}
                  websiteLabel={websiteLabel}
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

      <section id="map" className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">Venue map</h2>
          <p className="mt-1 text-sm text-zinc-500">Tap markers for upcoming nights at each spot.</p>
        </div>
        <MapClient venues={venues} />
      </section>

      <section id="venues" className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">Venues</h2>
          <p className="mt-1 text-sm text-zinc-500">Where the shows happen.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {venues.map((venue) => (
            <article
              key={venue.id}
              className="rounded-2xl border border-violet-500/30 bg-zinc-900/70 p-6 shadow-[0_0_28px_-10px_rgba(124,58,237,0.4)] ring-1 ring-cyan-500/10 transition-[box-shadow,border-color] hover:border-fuchsia-400/40 hover:shadow-[0_0_36px_-8px_rgba(217,70,239,0.3)]"
            >
              <h3 className="text-lg font-semibold tracking-tight text-zinc-50">{venue.name}</h3>
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
