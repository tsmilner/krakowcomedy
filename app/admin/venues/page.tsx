import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { createVenueAction } from "../actions";

export default async function AdminVenuesPage() {
  await requireAdmin();
  const venues = await prisma.venue.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin - Venues</h1>
        <Link href="/admin/events" className="text-sm underline">
          Back to events
        </Link>
      </div>
      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Add venue</h2>
        <form action={createVenueAction} className="grid gap-2 md:grid-cols-2">
          <input name="name" placeholder="Name" required className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <input name="address" placeholder="Address" required className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <input name="latitude" placeholder="Latitude" required className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <input name="longitude" placeholder="Longitude" required className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <input name="area" placeholder="Area / Neighbourhood" className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <input name="websiteUrl" placeholder="Website URL" className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <input name="facebookUrl" placeholder="Facebook URL" className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <input name="instagramUrl" placeholder="Instagram URL" className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <textarea name="description" placeholder="Description" required className="rounded border border-zinc-300 px-3 py-2 text-sm md:col-span-2" />
          <button className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white md:col-span-2">Create venue</button>
        </form>
      </section>
      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Edit venues</h2>
        <div className="space-y-2">
          {venues.map((venue) => (
            <div key={venue.id} className="flex items-center justify-between rounded border border-zinc-200 px-3 py-2 text-sm">
              <span>{venue.name}</span>
              <Link href={`/admin/venues/${venue.id}`} className="underline">
                Edit
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
