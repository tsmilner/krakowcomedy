import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLinks } from "@/components/external-links";
import { getOrganiserDescription } from "@/lib/editorial";
import { prisma } from "@/lib/prisma";

const NON_LOCAL_ORGANISER_SLUGS = ["love-lub-comedy", "miguel-aliaga", "victor-patrascan"];

export const metadata: Metadata = {
  title: "Krakow Comedy Organisers",
  description:
    "Human-curated notes on Krakow organisers running English-language stand-up, open mics, improv, story slams and touring comedy shows.",
  alternates: { canonical: "/organisers" },
};

export default async function OrganisersPage() {
  const organisersRaw = await prisma.organiser.findMany({
    where: { slug: { notIn: NON_LOCAL_ORGANISER_SLUGS } },
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

  const organisers = [...organisersRaw].sort((a, b) => {
    const isBottom = (slug: string) =>
      slug === "cozy-events" || slug === "improv-comedy-in-cracow";
    const aBottom = isBottom(a.slug);
    const bBottom = isBottom(b.slug);
    if (aBottom !== bBottom) return aBottom ? 1 : -1;
    return a.name.localeCompare(b.name);
  });

  const organiserCard = (organiser: (typeof organisers)[number]) => {
    const isCozy = organiser.slug === "cozy-events";
    const isDzienTonic = organiser.slug === "dzien-tonic-story-slam";
    const isNotGay = organiser.slug === "not-gay-at-all-comedy";
    const websiteUrl = isDzienTonic
      ? "https://www.facebook.com/profile.php?id=100083820738347"
      : organiser.websiteUrl;
    const websiteLabel = isCozy
      ? "Meetup"
      : isDzienTonic
        ? "Andre San Miguel"
        : isNotGay
          ? "Stan"
          : "Website";

    return (
      <article
        key={organiser.id}
        className="rounded-xl border border-violet-500/30 bg-zinc-900/70 p-5 shadow-[0_0_28px_-10px_rgba(124,58,237,0.35)] ring-1 ring-cyan-500/10"
      >
        <h3 className="text-xl font-semibold text-zinc-50">
          {isCozy ? "Cozy Events (Story Slam)" : organiser.name}
        </h3>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          {getOrganiserDescription(organiser)}
        </p>
        <div className="mt-4">
          <ExternalLinks
            websiteUrl={websiteUrl}
            websiteLabel={websiteLabel}
            facebookLabel={isCozy ? "Facebook Group" : "Facebook Page"}
            instagramLabel={isNotGay ? "Luke" : "Instagram"}
            facebookUrl={isNotGay ? null : organiser.facebookUrl}
            instagramUrl={organiser.instagramUrl}
          />
        </div>
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-fuchsia-300/90">
            Upcoming English events
          </p>
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
            <p className="text-sm text-zinc-500">
              No upcoming English-language events are currently listed here. Check the organiser&apos;s own
              links for the latest posts.
            </p>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-6">
      <section className="space-y-6">
        <div>
          <h1 className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
            Regular comedy organisers
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
            These are Krakow-based groups and hosts that appear in the guide because they run, host, or
            support English-language comedy nights. The notes are written to help readers understand the
            format of each organiser&apos;s events before clicking through to social pages.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {organisers.map(organiserCard)}
        </div>
      </section>
    </div>
  );
}
