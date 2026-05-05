const MANUAL_EVENTS = [
  {
    id: "storyslam-2026-05-15",
    name: 'Krakow Story Slam: "What I Never Said"',
    date: "2026-05-15T19:00:00+02:00",
    language: "EN",
    venue: {
      name: "The Atrium Hotel",
      lat: 50.067559,
      lng: 19.939433,
    },
    links: [
      {
        url: "https://www.facebook.com/events/1673537580763277/",
        label: "Facebook event",
      },
    ],
    description: "Live story slam night with audience judging and 5-7 minute true stories around the theme: What I Never Said. Not strictly a comedy night, but comedians often perform.",
  },
  {
    id: "love-lub-comedy-2026-05-15",
    name: "English Stand-Up Comedy Open Mic - Krakow",
    date: "2026-05-15T19:50:00+02:00",
    language: "EN",
    venue: {
      name: "Bracka 4, Poziom 1",
      lat: 50.0613,
      lng: 19.9353,
    },
    links: [
      {
        url: "https://www.facebook.com/events/854334386973245",
        label: "Facebook event",
      },
    ],
    description: "English stand-up comedy open mic in Krakow hosted by Poznan-based Love/Lub Comedy and Hung Yu-Yu as they test events in Krakow.",
  },
  {
    id: "not-gay-at-all-2026-05-20",
    name: "NOT GAY AT ALL - English Stand up Comedy Open Mic",
    date: "2026-05-20T20:00:00+02:00",
    language: "EN",
    venue: {
      name: "Chicago Jazz",
      lat: 50.0642,
      lng: 19.9369,
    },
    links: [
      {
        url: "https://www.facebook.com/events/1384701813675528/",
        label: "Facebook event",
      },
    ],
    description: "English stand-up open mic in Krakow by Luke Dwornik-Longacre and Stanislav Kelberg. Audience and performers welcome.",
  },
  {
    id: "dzien-tonic-2026-05-06",
    name: "The Dzien Tonic Show! English Standup Open Mic",
    date: "2026-05-06T20:00:00+02:00",
    language: "EN",
    venue: {
      name: "Chicago Jazz",
      lat: 50.0642,
      lng: 19.9369,
    },
    links: [
      {
        url: "https://www.facebook.com/events/828682103095071/",
        label: "Facebook event",
      },
    ],
    description: "Free English standup open mic hosted by André San Miguel, with local comedians and new material.",
  },
];

function getManualEvents() {
  return MANUAL_EVENTS.map((event) => ({
    ...event,
    venue: { ...event.venue },
    links: event.links.map((link) => ({ ...link })),
  }));
}

module.exports = {
  getManualEvents,
};
