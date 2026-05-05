import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { createEventAction, logoutAction } from "../actions";

export default async function AdminEventsPage() {
  await requireAdmin();
  const [events, venues, organisers] = await Promise.all([
    prisma.event.findMany({
      include: { venue: true, organiser: true },
      orderBy: { startDateTime: "asc" },
    }),
    prisma.venue.findMany({ orderBy: { name: "asc" } }),
    prisma.organiser.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Admin - Events</h1>
        <div className="flex gap-2">
          <Link href="/admin/venues" className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm">
            Manage venues
          </Link>
          <Link href="/admin/organisers" className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm">
            Manage organisers
          </Link>
          <form action={logoutAction}>
            <button className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white">Logout</button>
          </form>
        </div>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Add event</h2>
        <form action={createEventAction} className="grid gap-2 md:grid-cols-2">
          <input name="title" placeholder="Title" required className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <input name="startDateTime" type="datetime-local" required className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <input name="endDateTime" type="datetime-local" className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <select name="eventType" required className="rounded border border-zinc-300 px-3 py-2 text-sm">
            <option value="STAND_UP">Stand-up</option>
            <option value="OPEN_MIC">Open mic</option>
            <option value="IMPROV">Improv</option>
            <option value="STORY_SLAM">Story slam</option>
            <option value="SHOWCASE">Showcase</option>
          </select>
          <select name="language" required className="rounded border border-zinc-300 px-3 py-2 text-sm">
            <option value="ENGLISH">English</option>
            <option value="POLISH">Polish</option>
            <option value="BILINGUAL">Bilingual</option>
          </select>
          <select name="venueId" required className="rounded border border-zinc-300 px-3 py-2 text-sm">
            {venues.map((venue) => (
              <option key={venue.id} value={String(venue.id)}>
                {venue.name}
              </option>
            ))}
          </select>
          <select name="organiserId" required className="rounded border border-zinc-300 px-3 py-2 text-sm">
            {organisers.map((organiser) => (
              <option key={organiser.id} value={String(organiser.id)}>
                {organiser.name}
              </option>
            ))}
          </select>
          <input name="ticketUrl" placeholder="Ticket URL" className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <input name="facebookEventUrl" placeholder="Facebook event URL" className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <input name="instagramUrl" placeholder="Instagram URL" className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <input name="websiteUrl" placeholder="Website URL" className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <input name="externalSourceName" placeholder="Source name (optional)" className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <textarea
            name="description"
            placeholder="Description"
            required
            className="rounded border border-zinc-300 px-3 py-2 text-sm md:col-span-2"
          />
          <textarea name="sourceNotes" placeholder="Source notes" className="rounded border border-zinc-300 px-3 py-2 text-sm md:col-span-2" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isFeatured" /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isRecurring" /> Recurring
          </label>
          <button className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white md:col-span-2">Create event</button>
        </form>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Edit events</h2>
        <div className="space-y-2">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between rounded border border-zinc-200 px-3 py-2 text-sm">
              <span>
                {event.title} - {event.venue.name} - {event.organiser.name}
              </span>
              <Link href={`/admin/events/${event.id}`} className="underline">
                Edit
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
