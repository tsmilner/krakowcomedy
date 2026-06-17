import { Event, EventType, Organiser, Venue } from "@prisma/client";
import { eventTypeLabel } from "./utils";

export const editorialNote =
  "Krakow Comedy is a curated guide and is not affiliated with every organiser listed.";

const organiserDescriptions: Record<string, string> = {
  "krak-me-up-comedy":
    "Krak Me Up Comedy is one of the regular English-language stand-up names in Krakow, with shows built around local comics, visiting performers, and hosted lineups. Listings here focus on nights that are useful for audience members as well as performers looking for stage time or local contacts.",
  "dzien-tonic-story-slam":
    "Dzien Tonic is connected with English-language open mic comedy in Krakow, especially casual rooms where newer material and local performers can appear alongside more experienced comics. Check the linked organiser pages for signup details, host updates, and the exact format of each night.",
  "cozy-events":
    "Cozy Events is listed here for Krakow Story Slam, a spoken-word and true-story format where the draw is personal storytelling rather than traditional stand-up. These nights are useful for people who want an English-speaking community event with a theme, a host, and a social atmosphere.",
  "not-gay-at-all-comedy":
    "Not Gay At All Comedy is associated with English open mic stand-up in Krakow. The listings are most useful for people looking for informal comedy rooms, local hosts, and events where performers may be testing shorter sets.",
  "improv-comedy-in-cracow":
    "Improv Comedy in Cracow focuses on improvised comedy and open-stage formats. These events are different from a standard stand-up bill: the audience usually sees scenes, games, or spontaneous group work shaped in the room.",
  "hot-chocolate-comedy":
    "Hot Chocolate Comedy appears in Krakow listings as an English-language open mic format. It is included when there is a clear public event source, so readers can find the date, venue, and organiser link without searching through social feeds.",
  "omnibus-musical-improv":
    "Omnibus Musical Improv brings a musical improv angle to the English-language scene, with shows shaped around spontaneous songs, scenes, and group performance. Listings here highlight public shows rather than rehearsals or private workshops.",
  "miguel-aliaga":
    "Miguel Aliaga is a touring English-language stand-up comedian. Touring comic pages are included when there is a Krakow date that may be relevant to English-speaking comedy audiences, rather than as a general biography page.",
  "victor-patrascan":
    "Victor Patrascan is a touring English-language stand-up comedian whose Krakow appearances are relevant for visitors and residents who want a larger ticketed comedy show. Always check the ticket page for the current venue and entry details.",
  "love-lub-comedy":
    "Love/Lub Comedy is included only when it has a Krakow-relevant listing. The guide does not try to archive every out-of-town organiser; it includes events that help people decide what to see locally.",
};

const venueDescriptions: Record<string, string> = {
  "chicago-jazz":
    "Chicago Jazz is an Old Town bar location used for English open mic and stand-up nights. Its central address makes it practical for visitors staying near the Main Square and for local performers moving between evening events.",
  "the-atrium-hotel":
    "The Atrium Hotel is a central Old Town venue used by Krakow Story Slam. It is a more structured setting than a bar open mic, which suits themed storytelling nights where the audience follows a sequence of spoken performances.",
  "cafe-szafe":
    "Cafe Szafe is an intimate Old Town cafe-bar setting suited to smaller open-stage events. For comedy, that usually means a close room where audience attention matters and performers can test material in a more conversational atmosphere.",
  "bracka-4-poziom-1":
    "Bracka 4, Poziom 1 is a basement-style central venue close to the Main Square. It is relevant for stand-up and open mic listings because it gives comedy nights a separate room feel while staying easy to reach.",
  "layla-lounge-bar":
    "Layla Lounge Bar is in Kazimierz and appears in the guide for English-language community and comedy events. The neighbourhood has a strong evening bar culture, so it can work well for informal open mic nights and post-show conversation.",
  "pub-103-8-fm":
    "Pub 103,8 FM is a Kazimierz performance pub used for comedy and live events. It is included because ticketed and touring stand-up shows sometimes use this kind of dedicated nightlife venue rather than a theatre.",
  "forum-horyzonty":
    "Forum Horyzonty is a larger event space near the river and Forum area. It is most relevant here when touring English-language comedians need a room that can handle a bigger audience than a typical open mic bar.",
  "swietego-tomasza-31":
    "Swietego Tomasza 31 is a central Old Town address used for live performance and improv listings. Its location is useful for visitors, while the format of events there can differ from conventional stand-up shows.",
};

export function getOrganiserDescription(organiser: Pick<Organiser, "slug" | "description">) {
  return organiserDescriptions[organiser.slug] ?? organiser.description;
}

export function getVenueDescription(venue: Pick<Venue, "slug" | "description">) {
  return venueDescriptions[venue.slug] ?? venue.description;
}

export function getEventLocalContext(
  event: Pick<Event, "eventType" | "title"> & {
    venue: Pick<Venue, "name" | "area">;
    organiser: Pick<Organiser, "name">;
  },
) {
  const area = event.venue.area ? ` in ${event.venue.area}` : "";
  const type = eventTypeLabel(event.eventType);

  const typeContext: Record<EventType, string> = {
    STAND_UP:
      "For stand-up shows, the useful details are usually the host, lineup, language, start time, and whether tickets or reservations are required.",
    OPEN_MIC:
      "For open mics, lineups can change late and signup rules vary by organiser, so performers should use the official event thread before assuming spots are available.",
    IMPROV:
      "For improv nights, the format may involve games, scenes, musical work, or audience suggestions rather than prepared stand-up sets.",
    STORY_SLAM:
      "For story slams, the theme and running order matter: these are usually spoken-story events with a host, timed stories, and a community audience.",
    SHOWCASE:
      "For showcase nights, expect a more planned bill than a drop-in open mic, but still check the organiser link for the latest lineup.",
  };

  return `${event.title ?? "This event"} is listed as an English-language ${type} event at ${event.venue.name}${area}, organised by ${event.organiser.name}. ${typeContext[event.eventType]}`;
}
