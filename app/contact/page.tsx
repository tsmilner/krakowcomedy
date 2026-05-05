import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Krakow Comedy Calendar for corrections, new listings, or broken links — include official sources so updates stay accurate.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <article className="space-y-5 rounded-2xl border border-violet-500/30 bg-zinc-900/70 p-5 shadow-[0_0_28px_-10px_rgba(124,58,237,0.35)] ring-1 ring-cyan-500/10 sm:p-7">
      <h1 className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
        Contact
      </h1>
      <p className="text-zinc-200">
        Found an outdated listing, wrong link, or missing event? Send an update and we will correct it.
      </p>
      <div className="space-y-2 text-zinc-300">
        <p>
          Best way to reach us:{" "}
          <a
            href="mailto:hello@krakowcomedy.com"
            className="text-cyan-200 underline decoration-violet-500/40 underline-offset-2 hover:text-fuchsia-200"
          >
            hello@krakowcomedy.com
          </a>
        </p>
        <p>Please include:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Event or organiser name</li>
          <li>What should be changed</li>
          <li>Official source link (Facebook/Instagram/Meetup/event page)</li>
        </ul>
      </div>
      <p className="text-zinc-400">
        We aim to keep information accurate, but event details can change quickly. Always verify the latest
        details on the organiser&apos;s official event page.
      </p>
    </article>
  );
}

