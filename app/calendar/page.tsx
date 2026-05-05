import { EventLanguage, EventType } from "@prisma/client";
import { CalendarClient } from "@/components/calendar-client";
import { EventCard } from "@/components/event-card";
import { getEvents, getVenuesWithUpcomingListings } from "@/lib/data";
import { prisma } from "@/lib/prisma";

type CalendarPageProps = {
  searchParams: Promise<{
    from?: string;
    to?: string;
    language?: EventLanguage;
    eventType?: EventType;
    venueId?: string;
    organiserId?: string;
  }>;
};

export const metadata = {
  title: "Calendar | Krakow Comedy Calendar",
  description: "Monthly and list views of upcoming comedy events in Krakow.",
};

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const filters = await searchParams;
  const [venues, organisers, events] = await Promise.all([
    getVenuesWithUpcomingListings(),
    prisma.organiser.findMany({ orderBy: { name: "asc" } }),
    getEvents({
      from: filters.from,
      to: filters.to,
      language: filters.language ?? "",
      eventType: filters.eventType ?? "",
      venueId: filters.venueId,
      organiserId: filters.organiserId,
    }),
  ]);

  const calendarEvents = events.map((event) => ({
    id: String(event.id),
    title: event.title,
    start: event.startDateTime.toISOString(),
    end: event.endDateTime ? event.endDateTime.toISOString() : undefined,
    url: `/events/${event.slug}`,
  }));

  return (
    <div className="space-y-6">
      <h1 className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
        Comedy calendar
      </h1>
      <div>
        <a
          href="/api/calendar/all"
          className="inline-flex items-center rounded-full border border-violet-400/50 bg-violet-900/60 px-4 py-2 text-sm font-semibold text-violet-100 shadow-[0_0_14px_-4px_rgba(168,85,247,0.5)] transition-colors hover:bg-violet-800/70 hover:text-white"
        >
          Add all events to my Google Calendar
        </a>
      </div>
      <form className="grid gap-3 rounded-xl border border-violet-500/30 bg-zinc-900/70 p-4 shadow-[0_0_28px_-10px_rgba(124,58,237,0.35)] ring-1 ring-cyan-500/10 md:grid-cols-3">
        <input
          type="date"
          name="from"
          defaultValue={filters.from}
          className="rounded-md border border-zinc-600/80 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-cyan-500/30"
        />
        <input
          type="date"
          name="to"
          defaultValue={filters.to}
          className="rounded-md border border-zinc-600/80 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-cyan-500/30"
        />
        <select
          name="eventType"
          defaultValue={filters.eventType}
          className="rounded-md border border-zinc-600/80 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-cyan-500/30"
        >
          <option value="">All types</option>
          <option value="STAND_UP">Stand-up</option>
          <option value="OPEN_MIC">Open mic</option>
          <option value="STORY_SLAM">Story slam</option>
          <option value="SHOWCASE">Showcase</option>
        </select>
        <select
          name="language"
          defaultValue={filters.language}
          className="rounded-md border border-zinc-600/80 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-cyan-500/30"
        >
          <option value="">All languages</option>
          <option value="ENGLISH">English</option>
          <option value="POLISH">Polish</option>
          <option value="BILINGUAL">Bilingual</option>
        </select>
        <select
          name="venueId"
          defaultValue={filters.venueId}
          className="rounded-md border border-zinc-600/80 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-cyan-500/30"
        >
          <option value="">All venues</option>
          {venues.map((venue) => (
            <option key={venue.id} value={String(venue.id)}>
              {venue.name}
            </option>
          ))}
        </select>
        <select
          name="organiserId"
          defaultValue={filters.organiserId}
          className="rounded-md border border-zinc-600/80 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-cyan-500/30"
        >
          <option value="">All organisers</option>
          {organisers.map((organiser) => (
            <option key={organiser.id} value={String(organiser.id)}>
              {organiser.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_18px_-4px_rgba(168,85,247,0.45)] hover:from-violet-500 hover:to-fuchsia-500 md:col-span-3"
        >
          Apply filters
        </button>
      </form>

      <CalendarClient events={calendarEvents} />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-zinc-50">Upcoming list</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
