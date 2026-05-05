import clsx from "clsx";

type LinkSet = {
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  websiteLabel?: string;
  ticketUrl?: string | null;
};

export function ExternalLinks({
  facebookUrl,
  instagramUrl,
  websiteUrl,
  websiteLabel = "Website",
  ticketUrl,
}: LinkSet) {
  const links = [
    { label: "Facebook", url: facebookUrl },
    { label: "Instagram", url: instagramUrl },
    { label: websiteLabel, url: websiteUrl },
    { label: "Tickets", url: ticketUrl },
  ].filter((item): item is { label: string; url: string } => Boolean(item.url));

  if (!links.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className={clsx(
            "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all",
            link.label === "Tickets"
              ? "bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white shadow-[0_0_16px_-4px_rgba(244,63,94,0.55)] hover:from-fuchsia-500 hover:to-rose-500"
              : "border border-cyan-500/35 bg-zinc-950/80 text-cyan-100 shadow-[0_0_12px_-4px_rgba(34,211,238,0.2)] hover:border-fuchsia-400/50 hover:text-fuchsia-100 hover:shadow-[0_0_14px_-3px_rgba(217,70,239,0.35)]",
          )}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
