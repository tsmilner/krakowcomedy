import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLinks } from "@/components/external-links";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";
import {
  buildGoogleCalendarUrl,
  eventTypeLabel,
  formatEventDate,
  formatEventTime,
  languageLabel,
} from "@/lib/utils";

type EventDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: EventDetailProps) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { venue: true },
  });

  if (!event) {
    return { title: "Event not found | Krakow Comedy Calendar" };
  }

  return {
    title: `${event.title} | Krakow Comedy Calendar`,
    description: `${event.title} at ${event.venue.name}, Krakow.`,
  };
}

export default async function EventDetailPage({ params }: EventDetailProps) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      venue: true,
      organiser: true,
      tags: { include: { tag: true } },
    },
  });

  if (!event) notFound();

  const siteUrl = getSiteUrl();
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.startDateTime.toISOString(),
    ...(event.endDateTime ? { endDate: event.endDateTime.toISOString() } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue.name,
      address: event.venue.address,
    },
    organizer: { "@type": "Organization", name: event.organiser.name },
    url: `${siteUrl}/events/${event.slug}`,
  };

  const facebookUrl = event.facebookEventUrl;
  const facebookLabel = "Facebook Event Link";
  const googleCalendarUrl = buildGoogleCalendarUrl({
    title: event.title,
    startDateTime: event.startDateTime,
    endDateTime: event.endDateTime,
    description: event.description,
    location: event.venue.address,
  });

  return (
    <article className="relative space-y-8 overflow-hidden rounded-3xl border border-violet-500/35 bg-zinc-900/75 p-6 shadow-[0_0_48px_-14px_rgba(88,28,135,0.45)] ring-1 ring-cyan-500/15 sm:p-8">
      <SeoJsonLd data={eventJsonLd} />
      <div
        className="pointer-events-none absolute -right-20 top-0 h-48 w-48 rounded-full bg-fuchsia-600/20 blur-3xl"
        aria-hidden
      />
      <div className="relative space-y-2">
        <Link
          href="/#calendar"
          className="inline-flex text-sm font-medium text-zinc-500 underline decoration-violet-500/40 underline-offset-4 transition-colors hover:text-cyan-300 hover:decoration-cyan-400/50"
        >
          ← Back to calendar
        </Link>
        <header className="space-y-3 pt-1">
          <h1 className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-[2rem] sm:leading-tight">
            {event.title}
          </h1>
          <p className="text-base text-zinc-400">
            <span className="font-medium text-zinc-200">{formatEventDate(event.startDateTime)}</span>
            <span className="text-violet-500/70"> · </span>
            {formatEventTime(event.startDateTime)}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="rounded-full border border-zinc-600/80 bg-zinc-950/60 px-3 py-1 text-xs font-medium text-zinc-300">
              {languageLabel(event.language)}
            </span>
            <span className="rounded-full border border-fuchsia-500/45 bg-fuchsia-950/50 px-3 py-1 text-xs font-medium capitalize text-fuchsia-200">
              {eventTypeLabel(event.eventType)}
            </span>
          </div>
        </header>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <dl className="space-y-3 rounded-2xl border border-zinc-700/70 bg-zinc-950/50 p-5 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-fuchsia-400/80">Venue</dt>
            <dd className="mt-1 font-medium">
              <Link
                href={`/map?venue=${event.venue.slug}`}
                className="text-cyan-200 underline decoration-fuchsia-500/40 underline-offset-2 hover:text-fuchsia-200"
              >
                {event.venue.name}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-fuchsia-400/80">Address</dt>
            <dd className="mt-1 text-zinc-400">{event.venue.address}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-fuchsia-400/80">Organiser</dt>
            <dd className="mt-1 text-zinc-400">{event.organiser.name}</dd>
          </div>
        </dl>
        <div className="space-y-3 rounded-2xl border border-violet-500/30 bg-zinc-950/40 p-5 shadow-inner">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-400/80">Links</p>
          <ExternalLinks
            facebookUrl={facebookUrl}
            facebookLabel={facebookLabel}
            instagramUrl={event.instagramUrl}
            websiteUrl={event.websiteUrl ?? event.venue.websiteUrl}
            ticketUrl={event.ticketUrl}
            googleCalendarUrl={googleCalendarUrl}
          />
        </div>
      </div>

      <p className="max-w-3xl text-base leading-relaxed text-zinc-400">{event.description}</p>

      {event.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-zinc-700/60 pt-6">
          {event.tags.map((item) => (
            <span
              key={item.tagId}
              className="rounded-full border border-cyan-500/35 bg-zinc-950/70 px-3 py-1 text-xs font-medium text-cyan-100 shadow-[0_0_12px_-4px_rgba(34,211,238,0.2)]"
            >
              {item.tag.name}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
