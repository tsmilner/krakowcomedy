import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLinks } from "@/components/external-links";
import { getVenueWithEvents } from "@/lib/data";
import { getVenueDescription } from "@/lib/editorial";
import { formatEventDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Krakow Comedy Venues",
  description:
    "Local notes on Krakow venues that host English-language stand-up, open mics, improv and storytelling, with neighbourhood context and upcoming listings.",
  alternates: { canonical: "/venues" },
};

export default async function VenuesPage() {
  const venues = await getVenueWithEvents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
          Krakow comedy venues
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
          Comedy in Krakow happens in different kinds of rooms: central bars, basement stages, hotel event
          spaces, cafe-bars, and larger venues for touring comics. These notes explain why each venue matters
          to the English-language comedy calendar, not just where it is on a map.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {venues.map((venue) => (
          <article
            key={venue.id}
            className="rounded-xl border border-violet-500/30 bg-zinc-900/70 p-5 shadow-[0_0_28px_-10px_rgba(124,58,237,0.35)] ring-1 ring-cyan-500/10"
          >
            <h2 className="text-xl font-semibold">
              <Link
                href={`/map?venue=${venue.slug}`}
                className="text-cyan-200 underline decoration-fuchsia-500/40 underline-offset-2 hover:text-fuchsia-200"
              >
                {venue.name}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {venue.address} {venue.area ? `- ${venue.area}` : ""}
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{getVenueDescription(venue)}</p>
            <div className="mt-4">
              <ExternalLinks
                websiteUrl={venue.websiteUrl}
                facebookUrl={venue.facebookUrl}
                instagramUrl={venue.instagramUrl}
              />
            </div>
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-fuchsia-300/90">Upcoming events</p>
              {venue.events.length > 0 ? (
                <ul className="space-y-1 text-sm text-zinc-400">
                  {venue.events.map((event) => (
                    <li key={event.id}>
                      <Link
                        href={`/events/${event.slug}`}
                        className="font-medium text-cyan-200 underline decoration-fuchsia-500/40 underline-offset-2 hover:text-fuchsia-200"
                      >
                        {event.title}
                      </Link>{" "}
                      <span className="text-cyan-100/90">({formatEventDate(event.startDateTime)})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-500">
                  No upcoming English-language comedy events are currently listed for this venue.
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
