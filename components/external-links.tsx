import clsx from "clsx";

type LinkSet = {
  facebookUrl?: string | null;
  facebookLabel?: string;
  instagramUrl?: string | null;
  instagramLabel?: string;
  websiteUrl?: string | null;
  websiteLabel?: string;
  ticketUrl?: string | null;
  googleCalendarUrl?: string | null;
};

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.026 4.388 11.021 10.125 11.927V15.56H7.078V12.07h3.047V9.413c0-3.022 1.792-4.69 4.533-4.69 1.313 0 2.686.236 2.686.236v2.966h-1.514c-1.49 0-1.955.93-1.955 1.885v2.26h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.099 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zm8.95 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4z" />
    </svg>
  );
}

function MeetupIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M9.3 4.4c.9 0 1.5.8 1.3 1.7l-1.1 4.8c-.2.7.4 1.3 1.1 1.2 1.5-.2 2.4-1.1 2.9-2.8l.8-2.6c.3-.9 1.2-1.5 2.2-1.3 1 .2 1.6 1.2 1.4 2.1L16.4 14c-.7 3.1-3 5-6.3 5-3.2 0-5-2.1-4.4-5.3l1.6-8.1c.2-.7.9-1.2 1.7-1.2h.3z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M10.59 13.41a1 1 0 0 1 0-1.41l3.59-3.59a3 3 0 1 1 4.24 4.24l-1.83 1.83a3 3 0 0 1-4.24 0 1 1 0 1 0-1.41 1.41 5 5 0 0 0 7.07 0l1.83-1.83a5 5 0 0 0-7.07-7.07L9.17 10.6a1 1 0 0 0 1.42 1.41z" />
      <path d="M13.41 10.59a1 1 0 0 1 0 1.41L9.82 15.6a3 3 0 0 1-4.24-4.24l1.83-1.83a3 3 0 0 1 4.24 0 1 1 0 1 0 1.41-1.41 5 5 0 0 0-7.07 0L4.17 9.95a5 5 0 0 0 7.07 7.07l3.59-3.59a1 1 0 0 0-1.42-1.41z" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7zm6 0v10h2V7H9zm4 0v10h2V7h-2z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1zm13 8H4v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9zM5 6a1 1 0 0 0-1 1v1h16V7a1 1 0 0 0-1-1H5z" />
    </svg>
  );
}

function getIcon(label: string, url: string) {
  if (url.includes("instagram.com")) return <InstagramIcon />;
  if (label.includes("Facebook")) return <FacebookIcon />;
  if (label === "André San Miguel") return <FacebookIcon />;
  if (label === "Instagram") return <InstagramIcon />;
  if (label === "Meetup") return <MeetupIcon />;
  if (label === "Tickets") return <TicketIcon />;
  if (label === "Add to Google Calendar") return <CalendarIcon />;
  return <LinkIcon />;
}

export function ExternalLinks({
  facebookUrl,
  facebookLabel = "Facebook Event Link",
  instagramUrl,
  instagramLabel = "Instagram",
  websiteUrl,
  websiteLabel = "Website",
  ticketUrl,
  googleCalendarUrl,
}: LinkSet) {
  const links = [
    { label: facebookLabel, url: facebookUrl },
    { label: instagramLabel, url: instagramUrl },
    { label: websiteLabel, url: websiteUrl },
    { label: "Tickets", url: ticketUrl },
    { label: "Add to Google Calendar", url: googleCalendarUrl },
  ]
    .filter((item): item is { label: string; url: string } => Boolean(item.url))
    // Avoid duplicate pills when two labels point to the exact same URL.
    .filter((item, index, arr) => arr.findIndex((entry) => entry.url === item.url) === index);

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
          <span className="inline-flex items-center gap-1.5">
            {getIcon(link.label, link.url)}
            <span>{link.label}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
