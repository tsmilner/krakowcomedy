"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRouter } from "next/navigation";

type CalendarClientProps = {
  events: { id: string; title: string; start: string; end?: string; url: string }[];
  compact?: boolean;
};

export function CalendarClient({ events, compact = false }: CalendarClientProps) {
  const router = useRouter();

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-violet-500/35 bg-zinc-900/80 shadow-[0_0_36px_-12px_rgba(124,58,237,0.4)] ring-1 ring-cyan-500/15 ${compact ? "p-2.5" : "p-3.5"}`}
    >
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        timeZone="UTC"
        firstDay={1}
        initialView="dayGridMonth"
        headerToolbar={{
          left: compact ? "prev,next" : "prev,next today",
          center: "title",
          right: "dayGridMonth",
        }}
        buttonText={{
          today: "Today",
          month: compact ? "Month" : "Month",
        }}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        eventContent={(info) => (
          <div className="calendar-event-content">
            {info.timeText && <span className="calendar-event-time">{info.timeText}</span>}
            <span className="calendar-event-title">{info.event.title}</span>
          </div>
        )}
        events={events}
        eventClick={(info) => {
          info.jsEvent.preventDefault();
          if (info.event.url) router.push(info.event.url);
        }}
        fixedWeekCount={false}
        showNonCurrentDates={false}
        dayMaxEventRows={false}
        eventMinHeight={compact ? 14 : 18}
        height="auto"
      />
    </div>
  );
}
