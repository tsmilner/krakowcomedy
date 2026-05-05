import { EventLanguage, EventType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seeds agreed organisers + tags only. No events and no venues — those come from
 * Admin or `npm run sync:facebook` (Meta Graph API with your token).
 */
async function main() {
  await prisma.eventTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.event.deleteMany();
  await prisma.organiser.deleteMany();
  await prisma.venue.deleteMany();

  await Promise.all([
    prisma.organiser.create({
      data: {
        name: "Krak Me Up Comedy",
        slug: "krak-me-up-comedy",
        description:
          "English-language stand-up comedy nights featuring local and touring comics, hosted by Oliver Haze and Konrad Beerski.",
        instagramUrl: "https://www.instagram.com/krakmeupcomedy/",
        facebookUrl: "https://www.facebook.com/krakmeupcomedy/",
      },
    }),
    prisma.organiser.create({
      data: {
        name: "Dzień Tonic",
        slug: "dzien-tonic-story-slam",
        description:
          "English-language open mic in Krakow (The Dzień Tonic Show), hosted by Andre San Miguel.",
        websiteUrl: "https://www.facebook.com/profile.php?id=100083820738347",
        instagramUrl: "https://www.instagram.com/dzientonic/",
        facebookUrl: "https://www.facebook.com/profile.php?id=61555282495625",
      },
    }),
    prisma.organiser.create({
      data: {
        name: "Cozy Events",
        slug: "cozy-events",
        description:
          "Community event organiser behind Krakow Story Slam nights on Meetup.",
        websiteUrl: "https://www.meetup.com/cozy-events/",
        instagramUrl: "https://www.instagram.com/krakowstoryslam",
        facebookUrl: "https://www.facebook.com/groups/krakowstoryslam",
      },
    }),
    prisma.organiser.create({
      data: {
        name: "Not Gay At All Comedy",
        slug: "not-gay-at-all-comedy",
        description:
          "English stand-up open mic in Krakow hosted by Luke Dwornik-Longacre and Stanislav Kelberg.",
      },
    }),
    prisma.organiser.create({
      data: {
        name: "Improv Comedy in Cracow",
        slug: "improv-comedy-in-cracow",
        description: "Improv comedy nights and open-stage format events in Krakow.",
        facebookUrl: "https://www.facebook.com/improvcomedyincracow",
        instagramUrl: "https://www.instagram.com/improvkrakow",
      },
    }),
    prisma.organiser.create({
      data: {
        name: "Love/Lub Comedy",
        slug: "love-lub-comedy",
        description:
          "Poznan-based one-off open mic organiser appearing in Krakow listings.",
      },
    }),
  ]);

  await Promise.all([
    prisma.venue.create({
      data: {
        name: "Chicago Jazz",
        slug: "chicago-jazz",
        address: "Sławkowska 11, 31-014 Kraków",
        latitude: 50.0642,
        longitude: 19.9369,
        area: "Old Town",
        description: "Bar venue hosting English open mic nights.",
      },
    }),
    prisma.venue.create({
      data: {
        name: "The Atrium Hotel",
        slug: "the-atrium-hotel",
        address: "ul. Krzywa 7, 31-149 Kraków",
        latitude: 50.067559,
        longitude: 19.939433,
        area: "Old Town",
        description: "Story Slam venue in central Krakow.",
      },
    }),
    prisma.venue.create({
      data: {
        name: "Cafe Szafe",
        slug: "cafe-szafe",
        address: "Felicjanek 10, 31-104 Kraków",
        latitude: 50.0574,
        longitude: 19.9288,
        area: "Old Town",
        description: "Intimate cafe bar used for open-stage nights.",
      },
    }),
    prisma.venue.create({
      data: {
        name: "Bracka 4, Poziom 1",
        slug: "bracka-4-poziom-1",
        address: "Bracka 4, 31-005 Kraków",
        latitude: 50.0613,
        longitude: 19.9353,
        area: "Old Town",
        description: "Basement room used for stand-up and open mic events.",
      },
    }),
  ]);

  await Promise.all([
    prisma.event.create({
      data: {
        title: "The Dzien Tonic Show",
        slug: "the-dzien-tonic-show-2026-05-06",
        description: "English stand-up open mic hosted by Andre San Miquel.",
        startDateTime: new Date("2026-05-06T20:00:00+02:00"),
        eventType: EventType.OPEN_MIC,
        language: EventLanguage.ENGLISH,
        facebookEventUrl: "https://www.facebook.com/events/828682103095071/",
        venue: { connect: { slug: "chicago-jazz" } },
        organiser: { connect: { slug: "dzien-tonic-story-slam" } },
      },
    }),
    prisma.event.create({
      data: {
        title: "Story Slam",
        slug: "story-slam-2026-05-15",
        description: "True-story open mic with audience voting.",
        startDateTime: new Date("2026-05-15T19:00:00+02:00"),
        eventType: EventType.STORY_SLAM,
        language: EventLanguage.ENGLISH,
        facebookEventUrl: "https://www.facebook.com/events/1673537580763277/",
        venue: { connect: { slug: "the-atrium-hotel" } },
        organiser: { connect: { slug: "cozy-events" } },
      },
    }),
    prisma.event.create({
      data: {
        title: "Not Gay At All Open Mic",
        slug: "not-gay-at-all-open-mic-2026-05-20",
        description: "English stand-up open mic by Luke Dwornik-Longacre and Stanislav Kelberg.",
        startDateTime: new Date("2026-05-20T20:00:00+02:00"),
        eventType: EventType.OPEN_MIC,
        language: EventLanguage.ENGLISH,
        facebookEventUrl: "https://www.facebook.com/events/1384701813675528/",
        venue: { connect: { slug: "chicago-jazz" } },
        organiser: { connect: { slug: "not-gay-at-all-comedy" } },
      },
    }),
    prisma.event.create({
      data: {
        title: "Improv Comedy Open Stage",
        slug: "improv-comedy-open-stage-2026-05-07",
        description: "Open-stage improv jam night.",
        startDateTime: new Date("2026-05-07T20:00:00+02:00"),
        eventType: EventType.IMPROV,
        language: EventLanguage.ENGLISH,
        venue: { connect: { slug: "cafe-szafe" } },
        organiser: { connect: { slug: "improv-comedy-in-cracow" } },
      },
    }),
    prisma.event.create({
      data: {
        title: "Love/Lub Open Mic",
        slug: "love-lub-open-mic-2026-05-15",
        description: "One-off English open mic in Krakow by Love/Lub Comedy.",
        startDateTime: new Date("2026-05-15T19:50:00+02:00"),
        eventType: EventType.OPEN_MIC,
        language: EventLanguage.ENGLISH,
        facebookEventUrl: "https://fb.me/e/9n1ML2XeG",
        venue: { connect: { slug: "bracka-4-poziom-1" } },
        organiser: { connect: { slug: "love-lub-comedy" } },
      },
    }),
  ]);

  await Promise.all(
    ["expat-friendly", "new-comics", "storytelling"].map((name) =>
      prisma.tag.create({ data: { name } }),
    ),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
