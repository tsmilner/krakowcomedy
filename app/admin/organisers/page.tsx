import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { createOrganiserAction } from "../actions";

export default async function AdminOrganisersPage() {
  await requireAdmin();
  const organisers = await prisma.organiser.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin - Organisers</h1>
        <Link href="/admin/events" className="text-sm underline">
          Back to events
        </Link>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Add organiser</h2>
        <form action={createOrganiserAction} className="grid gap-2 md:grid-cols-2">
          <input name="name" placeholder="Name" required className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <input name="websiteUrl" placeholder="Website URL" className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <input name="facebookUrl" placeholder="Facebook URL" className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <input name="instagramUrl" placeholder="Instagram URL" className="rounded border border-zinc-300 px-3 py-2 text-sm" />
          <textarea name="description" placeholder="Description" required className="rounded border border-zinc-300 px-3 py-2 text-sm md:col-span-2" />
          <button className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white md:col-span-2">Create organiser</button>
        </form>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Edit organisers</h2>
        <div className="space-y-2">
          {organisers.map((organiser) => (
            <div key={organiser.id} className="flex items-center justify-between rounded border border-zinc-200 px-3 py-2 text-sm">
              <span>{organiser.name}</span>
              <Link href={`/admin/organisers/${organiser.id}`} className="underline">
                Edit
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
