import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn why Krakow Comedy Calendar exists: an independent, curated guide to English-language comedy in Kraków — not a ticket seller, built for clarity and discovery.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="space-y-5 rounded-2xl border border-violet-500/30 bg-zinc-900/70 p-5 shadow-[0_0_28px_-10px_rgba(124,58,237,0.35)] ring-1 ring-cyan-500/10 sm:p-7">
      <h1 className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
        About Krakow Comedy Calendar
      </h1>
      <p className="text-zinc-200">
        Krakow Comedy Calendar is an independent guide to English-language comedy nights in Krakow. The
        aim is simple: make it easier for locals, newcomers, and visitors to quickly see what is on this
        week without hunting through multiple social feeds.
      </p>
      <p className="text-zinc-300">
        This project focuses on practical details: when events happen, where they are, who runs them, and
        where to check official event posts. Listings are curated from organiser pages and event links, then
        reviewed for clarity. We do not sell tickets directly and we are not an official representative of
        each organiser.
      </p>
      <p className="text-zinc-300">
        The scene changes quickly, so details can move. For final lineups, entry rules, pricing, and last
        minute changes, always check each organiser&apos;s event link directly.
      </p>
    </article>
  );
}

