import type { Metadata } from "next";
import Link from "next/link";
import { editorialNote } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "About Krakow Comedy",
  description:
    "About Krakow Comedy: an independently maintained, manually curated guide to English-language stand-up, open mics, improv and story slams in Krakow.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="space-y-6 rounded-2xl border border-violet-500/30 bg-zinc-900/70 p-5 shadow-[0_0_28px_-10px_rgba(124,58,237,0.35)] ring-1 ring-cyan-500/10 sm:p-7">
      <h1 className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
        About Krakow Comedy
      </h1>
      <div className="space-y-4 text-zinc-300">
        <p className="text-zinc-200">
          Krakow Comedy is an independently maintained guide to English-language comedy in Krakow. It is
          built for people who want a clear, local view of the scene without having to check several social
          media pages every week.
        </p>
        <p>
          The guide focuses on events that are relevant to the English-speaking comedy community: stand-up
          shows, open mics, improv nights, story slams, and selected touring shows when they have a Krakow
          date. The goal is not to host every event automatically. A listing is most likely to appear when
          there is a public source, a clear date and venue, and enough information for someone to decide
          whether the event is useful to attend or perform at.
        </p>
        <p>
          This site is not a ticket seller, venue operator, or official representative of the organisers
          listed. Organisers control their own lineups, door policies, prices, performer signup rules, and
          last-minute updates. Krakow Comedy summarises public information and links back to official event
          sources so readers can verify details before making plans.
        </p>
        <p>
          If you run a show, host a room, manage a venue, or spot an outdated listing, please send a clear
          update through the <Link href="/contact" className="text-cyan-200 underline decoration-violet-500/40 underline-offset-2 hover:text-fuchsia-200">Contact / Submit page</Link>.
          Include the official event link whenever possible. Corrections are prioritised over volume: it is
          better for the guide to be smaller and accurate than broad and unreliable.
        </p>
        <p className="rounded-xl border border-cyan-500/25 bg-zinc-950/50 p-4 text-sm text-cyan-100">
          {editorialNote}
        </p>
      </div>
    </article>
  );
}
