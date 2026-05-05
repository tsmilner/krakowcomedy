import { getEvents } from "@/lib/data";

function formatIcsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export async function GET() {
  const events = await getEvents();
  const now = formatIcsDate(new Date());

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Krakow Comedy Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const event of events) {
    const start = event.startDateTime;
    const end = event.endDateTime ?? new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const location = [event.venue.name, event.venue.address].filter(Boolean).join(", ");
    const details = [
      event.description,
      `Event page: https://www.krakowcomedy.com/events/${event.slug}`,
      event.facebookEventUrl ? `Facebook: ${event.facebookEventUrl}` : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.slug}@krakowcomedy.com`,
      `DTSTAMP:${now}`,
      `DTSTART:${formatIcsDate(start)}`,
      `DTEND:${formatIcsDate(end)}`,
      `SUMMARY:${escapeIcsText(event.title)}`,
      `DESCRIPTION:${escapeIcsText(details)}`,
      `LOCATION:${escapeIcsText(location)}`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");

  return new Response(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="krakow-comedy-events.ics"',
      "Cache-Control": "no-store",
    },
  });
}

