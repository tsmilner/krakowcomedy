import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact and Submit Events",
  description:
    "Submit an English-language comedy event in Krakow, request a correction, or send organiser and venue updates for Krakow Comedy.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <article className="space-y-6 rounded-2xl border border-violet-500/30 bg-zinc-900/70 p-5 shadow-[0_0_28px_-10px_rgba(124,58,237,0.35)] ring-1 ring-cyan-500/10 sm:p-7">
      <h1 className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
        Contact / Submit an Event
      </h1>
      <div className="space-y-4 text-zinc-300">
        <p className="text-zinc-200">
          Use this page to request corrections, submit English-language comedy shows, or update organiser and
          venue information. There is no public form yet, so email is the simplest placeholder contact method.
        </p>
        <p>
          Organisers can send new listings, changed start times, cancelled events, updated venue details, or
          better official links. Performers can submit shows if there is a public source page and the event is
          relevant to English-speaking comedy audiences in Krakow.
        </p>
        <div className="rounded-xl border border-cyan-500/25 bg-zinc-950/50 p-4">
          <p className="font-semibold text-zinc-100">Email placeholder</p>
          <a
            href="mailto:hello@krakowcomedy.com"
            className="text-cyan-200 underline decoration-violet-500/40 underline-offset-2 hover:text-fuchsia-200"
          >
            hello@krakowcomedy.com
          </a>
        </div>
        <div>
          <p className="font-semibold text-zinc-100">Please include:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Event title, date, start time, and expected end time if known</li>
            <li>Venue name and address</li>
            <li>Organiser name and official source link</li>
            <li>Whether it is stand-up, open mic, improv, story slam, or another comedy format</li>
            <li>What needs changing if you are reporting a correction</li>
          </ul>
        </div>
        <p className="text-zinc-400">
          Submissions are reviewed manually. The site may decline listings that are off-topic, unverifiable,
          duplicated, expired, or not useful for the English-speaking Krakow comedy scene.
        </p>
      </div>
    </article>
  );
}
