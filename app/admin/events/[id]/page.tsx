import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { updateEventAction } from "../../actions";

type EditEventProps = {
  params: Promise<{ id: string }>;
};

function toLocalInputValue(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export default async function EditEventPage({ params }: EditEventProps) {
  await requireAdmin();
  const { id } = await params;
  const eventId = Number(id);
  const [event, venues, organisers] = await Promise.all([
    prisma.event.findUnique({ where: { id: eventId } }),
    prisma.venue.findMany({ orderBy: { name: "asc" } }),
    prisma.organiser.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!event) notFound();

  const action = updateEventAction.bind(null, event.id);

  return (
    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit event</h1>
        <Link href="/admin/events" className="text-sm underline">
          Back to events
        </Link>
      </div>
      <form action={action} className="grid gap-2 md:grid-cols-2">
        <input name="title" defaultValue={event.title} required className="rounded border border-zinc-300 px-3 py-2 text-sm" />
        <input
          name="startDateTime"
          type="datetime-local"
          defaultValue={toLocalInputValue(event.startDateTime)}
          required
          className="rounded border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          name="endDateTime"
          type="datetime-local"
          defaultValue={event.endDateTime ? toLocalInputValue(event.endDateTime) : ""}
          className="rounded border border-zinc-300 px-3 py-2 text-sm"
        />
        <select name="eventType" defaultValue={event.eventType} className="rounded border border-zinc-300 px-3 py-2 text-sm">
          <option value="STAND_UP">Stand-up</option>
          <option value="OPEN_MIC">Open mic</option>
          <option value="IMPROV">Improv</option>
          <option value="STORY_SLAM">Story slam</option>
          <option value="SHOWCASE">Showcase</option>
        </select>
        <select name="language" defaultValue={event.language} className="rounded border border-zinc-300 px-3 py-2 text-sm">
          <option value="ENGLISH">English</option>
          <option value="POLISH">Polish</option>
          <option value="BILINGUAL">Bilingual</option>
        </select>
        <select name="venueId" defaultValue={String(event.venueId)} className="rounded border border-zinc-300 px-3 py-2 text-sm">
          {venues.map((venue) => (
            <option key={venue.id} value={String(venue.id)}>
              {venue.name}
            </option>
          ))}
        </select>
        <select name="organiserId" defaultValue={String(event.organiserId)} className="rounded border border-zinc-300 px-3 py-2 text-sm">
          {organisers.map((organiser) => (
            <option key={organiser.id} value={String(organiser.id)}>
              {organiser.name}
            </option>
          ))}
        </select>
        <input name="ticketUrl" defaultValue={event.ticketUrl ?? ""} placeholder="Ticket URL" className="rounded border border-zinc-300 px-3 py-2 text-sm" />
        <input name="facebookEventUrl" defaultValue={event.facebookEventUrl ?? ""} placeholder="Facebook event URL" className="rounded border border-zinc-300 px-3 py-2 text-sm" />
        <input name="instagramUrl" defaultValue={event.instagramUrl ?? ""} placeholder="Instagram URL" className="rounded border border-zinc-300 px-3 py-2 text-sm" />
        <input name="websiteUrl" defaultValue={event.websiteUrl ?? ""} placeholder="Website URL" className="rounded border border-zinc-300 px-3 py-2 text-sm" />
        <textarea name="description" defaultValue={event.description} required className="rounded border border-zinc-300 px-3 py-2 text-sm md:col-span-2" />
        <textarea name="sourceNotes" defaultValue={event.sourceNotes ?? ""} placeholder="Source notes" className="rounded border border-zinc-300 px-3 py-2 text-sm md:col-span-2" />
        <input
          name="externalSourceName"
          defaultValue={event.externalSourceName ?? ""}
          placeholder="Source name"
          className="rounded border border-zinc-300 px-3 py-2 text-sm"
        />
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isFeatured" defaultChecked={event.isFeatured} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isRecurring" defaultChecked={event.isRecurring} /> Recurring
          </label>
        </div>
        <button className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white md:col-span-2">Save changes</button>
      </form>
    </div>
  );
}
