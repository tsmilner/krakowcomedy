import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ExternalLinks } from "@/components/external-links";

export const metadata = {
  title: "Organisers | Krakow Comedy Calendar",
  description: "Comedy organisers and communities shaping Krakow's live scene.",
};

export default async function OrganisersPage() {
  const organisers = await prisma.organiser.findMany({
    where: { slug: { not: "love-lub-comedy" } },
    include: {
      events: {
        where: { startDateTime: { gte: new Date() } },
        orderBy: { startDateTime: "asc" },
        
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
        Comedy organisers
      </h1>
      <div className="grid gap-4 md:grid-cols-2">
        {organisers.map((organiser) => {
          const isCozy = organiser.slug === "cozy-events";
          const isDzienTonic = organiser.slug === "dzien-tonic-story-slam";
          const websiteUrl = isDzienTonic
            ? "https://www.facebook.com/profile.php?id=100083820738347"
            : organiser.websiteUrl;
          const websiteLabel = isCozy ? "Meetup" : isDzienTonic ? "Andre San Miguel" : "Website";

          return (
            <article
              key={organiser.id}
              className="rounded-xl border border-violet-500/30 bg-zinc-900/70 p-5 shadow-[0_0_28px_-10px_rgba(124,58,237,0.35)] ring-1 ring-cyan-500/10"
            >
            <h2 className="text-xl font-semibold text-zinc-50">
              {organiser.slug === "cozy-events" ? "Cozy Events (Story Slam)" : organiser.name}
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{organiser.description}</p>
            <div className="mt-4">
              <ExternalLinks
                websiteUrl={websiteUrl}
                websiteLabel={websiteLabel}
                facebookUrl={organiser.slug === "not-gay-at-all-comedy" ? null : organiser.facebookUrl}
                instagramUrl={organiser.instagramUrl}
              />
            </div>
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-fuchsia-300/90">Upcoming events</p>
              {organiser.events.length > 0 ? (
                <ul className="space-y-1 text-sm text-zinc-400">
                  {organiser.events.map((event) => (
                    <li key={event.id}>
                      <Link
                        href={`/events/${event.slug}`}
                        className="font-medium text-cyan-200 underline decoration-fuchsia-500/40 underline-offset-2 hover:text-fuchsia-200"
                      >
                        {event.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-500">No upcoming events currently listed.</p>
              )}
            </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
