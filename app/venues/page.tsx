import Link from "next/link";
import { ExternalLinks } from "@/components/external-links";
import { getVenueWithEvents } from "@/lib/data";
import { formatEventDate } from "@/lib/utils";

export const metadata = {
  title: "Venues | Krakow Comedy Calendar",
  description: "Comedy-friendly venues across Krakow with upcoming events.",
};

export default async function VenuesPage() {
  const venues = await getVenueWithEvents();

  return (
    <div className="space-y-6">
      <h1 className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
        Krakow comedy venues
      </h1>
      <div className="grid gap-4 md:grid-cols-2">
        {venues.map((venue) => (
          <article
            key={venue.id}
            className="rounded-xl border border-violet-500/30 bg-zinc-900/70 p-5 shadow-[0_0_28px_-10px_rgba(124,58,237,0.35)] ring-1 ring-cyan-500/10"
          >
            <h2 className="text-xl font-semibold text-zinc-50">{venue.name}</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {venue.address} {venue.area ? `- ${venue.area}` : ""}
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{venue.description}</p>
            <div className="mt-4">
              <ExternalLinks
                websiteUrl={venue.websiteUrl}
                facebookUrl={venue.facebookUrl}
                instagramUrl={venue.instagramUrl}
              />
            </div>
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-fuchsia-300/90">Upcoming events</p>
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
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
