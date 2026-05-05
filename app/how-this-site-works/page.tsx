import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How this site works",
  description:
    "How Krakow Comedy Calendar gathers listings from organisers, curates them for clarity, and when users should double-check official event posts.",
  alternates: { canonical: "/how-this-site-works" },
};

export default function HowThisSiteWorksPage() {
  return (
    <article className="space-y-5 rounded-2xl border border-violet-500/30 bg-zinc-900/70 p-5 shadow-[0_0_28px_-10px_rgba(124,58,237,0.35)] ring-1 ring-cyan-500/10 sm:p-7">
      <h1 className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
        How this site works
      </h1>
      <p className="text-zinc-200">
        Krakow Comedy Calendar is a curated events guide. We combine organiser updates with manual checks to
        make event info easier to browse in one place.
      </p>
      <div className="space-y-3 text-zinc-300">
        <p>
          <strong className="text-zinc-100">1) Sources:</strong> listings come from organiser and event
          pages (Facebook, Instagram, Meetup, and official links).
        </p>
        <p>
          <strong className="text-zinc-100">2) Curation:</strong> events are grouped by organiser and venue
          so people can quickly see what is happening around Krakow.
        </p>
        <p>
          <strong className="text-zinc-100">3) Verification:</strong> key details are reviewed, but changes
          can happen fast, so users should always check each event page directly for final updates.
        </p>
      </div>
      <p className="text-zinc-400">
        If you spot a mistake or want an event added, use the Contact page and include an official source
        link.
      </p>
    </article>
  );
}

