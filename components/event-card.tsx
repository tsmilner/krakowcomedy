import { Event, Organiser, Venue } from "@prisma/client";
import Link from "next/link";
import {
  buildGoogleCalendarUrl,
  eventTypeLabel,
  formatEventDate,
  formatEventTime,
  languageLabel,
} from "@/lib/utils";
import { ExternalLinks } from "./external-links";

type EventCardProps = {
  event: Event & { venue: Venue; organiser: Organiser };
};

export function EventCard({ event }: EventCardProps) {
  const googleCalendarUrl = buildGoogleCalendarUrl({
    title: event.title,
    startDateTime: event.startDateTime,
    endDateTime: event.endDateTime,
    description: event.description,
    location: event.venue.address,
  });

  return (
    <article className="group relative overflow-hidden rounded-2xl border-2 border-violet-500/35 bg-zinc-900/70 p-4 shadow-[0_0_32px_-12px_rgba(88,28,135,0.45)] ring-1 ring-cyan-500/15 transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-fuchsia-400/50 hover:shadow-[0_0_40px_-8px_rgba(217,70,239,0.35)] sm:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug tracking-tight text-zinc-50 sm:text-lg">
          <Link
            href={`/events/${event.slug}`}
            className="decoration-fuchsia-500/50 underline-offset-2 transition-colors hover:text-cyan-200 hover:underline"
          >
            {event.title}
          </Link>
        </h3>
        {event.isFeatured && (
          <span className="shrink-0 rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]">
            Featured
          </span>
        )}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-400">
        <span className="whitespace-nowrap font-medium text-zinc-200">
          {formatEventDate(event.startDateTime)}
        </span>
        <span aria-hidden className="text-violet-500/80">
          /
        </span>
        <span className="whitespace-nowrap">{formatEventTime(event.startDateTime)}</span>
        <span aria-hidden className="text-violet-500/80">
          /
        </span>
        <Link
          href={`/map?venue=${event.venue.slug}`}
          className="font-medium text-cyan-200 underline decoration-fuchsia-500/40 underline-offset-2 hover:text-fuchsia-200"
        >
          {event.venue.name}
        </Link>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-zinc-600/80 bg-zinc-950/60 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
          {languageLabel(event.language)}
        </span>
        <span className="rounded-full border border-fuchsia-500/40 bg-fuchsia-950/40 px-2.5 py-0.5 text-xs font-medium capitalize text-fuchsia-200">
          {eventTypeLabel(event.eventType)}
        </span>
        <span className="text-xs text-cyan-100/90">by {event.organiser.name}</span>
      </div>
      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-zinc-400">{event.description}</p>
      <ExternalLinks
        facebookUrl={event.facebookEventUrl}
        facebookLabel="Facebook Event Link"
        instagramUrl={event.instagramUrl}
        websiteUrl={event.websiteUrl}
        ticketUrl={event.ticketUrl}
        googleCalendarUrl={googleCalendarUrl}
      />
    </article>
  );
}
