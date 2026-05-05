import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { updateVenueAction } from "../../actions";

type EditVenueProps = {
  params: Promise<{ id: string }>;
};

export default async function EditVenuePage({ params }: EditVenueProps) {
  await requireAdmin();
  const { id } = await params;
  const venue = await prisma.venue.findUnique({ where: { id: Number(id) } });
  if (!venue) notFound();

  const action = updateVenueAction.bind(null, venue.id);

  return (
    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit venue</h1>
        <Link href="/admin/venues" className="text-sm underline">
          Back to venues
        </Link>
      </div>
      <form action={action} className="grid gap-2 md:grid-cols-2">
        <input name="name" defaultValue={venue.name} required className="rounded border border-zinc-300 px-3 py-2 text-sm" />
        <input name="address" defaultValue={venue.address} required className="rounded border border-zinc-300 px-3 py-2 text-sm" />
        <input name="latitude" defaultValue={venue.latitude} required className="rounded border border-zinc-300 px-3 py-2 text-sm" />
        <input name="longitude" defaultValue={venue.longitude} required className="rounded border border-zinc-300 px-3 py-2 text-sm" />
        <input name="area" defaultValue={venue.area ?? ""} className="rounded border border-zinc-300 px-3 py-2 text-sm" />
        <input name="websiteUrl" defaultValue={venue.websiteUrl ?? ""} className="rounded border border-zinc-300 px-3 py-2 text-sm" />
        <input name="facebookUrl" defaultValue={venue.facebookUrl ?? ""} className="rounded border border-zinc-300 px-3 py-2 text-sm" />
        <input name="instagramUrl" defaultValue={venue.instagramUrl ?? ""} className="rounded border border-zinc-300 px-3 py-2 text-sm" />
        <textarea name="description" defaultValue={venue.description} required className="rounded border border-zinc-300 px-3 py-2 text-sm md:col-span-2" />
        <button className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white md:col-span-2">Save changes</button>
      </form>
    </div>
  );
}
