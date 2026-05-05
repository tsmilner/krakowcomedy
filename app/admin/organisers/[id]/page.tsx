import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { updateOrganiserAction } from "../../actions";

type EditOrganiserProps = {
  params: Promise<{ id: string }>;
};

export default async function EditOrganiserPage({ params }: EditOrganiserProps) {
  await requireAdmin();
  const { id } = await params;
  const organiser = await prisma.organiser.findUnique({ where: { id: Number(id) } });
  if (!organiser) notFound();

  const action = updateOrganiserAction.bind(null, organiser.id);

  return (
    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit organiser</h1>
        <Link href="/admin/organisers" className="text-sm underline">
          Back to organisers
        </Link>
      </div>
      <form action={action} className="grid gap-2 md:grid-cols-2">
        <input name="name" defaultValue={organiser.name} required className="rounded border border-zinc-300 px-3 py-2 text-sm" />
        <input name="websiteUrl" defaultValue={organiser.websiteUrl ?? ""} className="rounded border border-zinc-300 px-3 py-2 text-sm" />
        <input name="facebookUrl" defaultValue={organiser.facebookUrl ?? ""} className="rounded border border-zinc-300 px-3 py-2 text-sm" />
        <input name="instagramUrl" defaultValue={organiser.instagramUrl ?? ""} className="rounded border border-zinc-300 px-3 py-2 text-sm" />
        <textarea name="description" defaultValue={organiser.description} required className="rounded border border-zinc-300 px-3 py-2 text-sm md:col-span-2" />
        <button className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white md:col-span-2">Save changes</button>
      </form>
    </div>
  );
}
