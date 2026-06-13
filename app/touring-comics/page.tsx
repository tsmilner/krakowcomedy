import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLinks } from "@/components/external-links";
import { prisma } from "@/lib/prisma";

const TOURING_COMIC_SLUGS = ["miguel-aliaga", "victor-patrascan"];

export const metadata: Metadata = {
  title: "Touring Comics",
  description: "Touring comics with upcoming English-language comedy shows in Krakow.",
  alternates: { canonical: "/touring-comics" },
};

export default async function TouringComicsPage() {
  const touringComics = await prisma.organiser.findMany({
    where: {
      slug: { in: TOURING_COMIC_SLUGS },
      events: {
        some: {
          startDateTime: { gte: new Date() },
          language: "ENGLISH",
        },
      },
    },
    include: {
      events: {
        where: {
          startDateTime: { gte: new Date() },
          language: "ENGLISH",
        },
        orderBy: { startDateTime: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
          Touring comics performing in English
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
          Visiting comedians with a currently listed English-language show in Krakow.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {touringComics.map((comic) => (
          <article
            key={comic.id}
            className="rounded-xl border border-violet-500/30 bg-zinc-900/70 p-5 shadow-[0_0_28px_-10px_rgba(124,58,237,0.35)] ring-1 ring-cyan-500/10"
          >
            <h2 className="text-xl font-semibold text-zinc-50">{comic.name}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{comic.description}</p>
            <div className="mt-4">
              <ExternalLinks
                websiteUrl={comic.websiteUrl}
                facebookUrl={comic.facebookUrl}
                instagramUrl={comic.instagramUrl}
              />
            </div>
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-fuchsia-300/90">
                Upcoming English shows
              </p>
              <ul className="space-y-1 text-sm text-zinc-400">
                {comic.events.map((event) => (
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
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
