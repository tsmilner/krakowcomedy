import { EventLanguage, EventType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seeds organisers, venues, and events with direct facebook.com/events/{id} URLs only.
 * For incremental adds after initial seed, use `npx tsx scripts/import-researched-events.ts`
 * or `npm run sync:facebook` (Meta Graph API with your token).
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
          "English-language open mic in Krakow (The Dzień Tonic Show), hosted by André San Miguel.",
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
        instagramUrl: "https://www.instagram.com/lukedwornikmusicandcomedy/",
        websiteUrl: "https://www.instagram.com/stanscomedy",
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
    prisma.organiser.create({
      data: {
        name: "Hot Chocolate Comedy",
        slug: "hot-chocolate-comedy",
        description: "English-language comedy open mic hosted by Tony (Anthony Robinson).",
      },
    }),
    prisma.organiser.create({
      data: {
        name: "Omnibus Musical Improv",
        slug: "omnibus-musical-improv",
        description:
          "English-language musical improv comedy group creating fully improvised shows in Krakow.",
        facebookUrl: "https://www.facebook.com/omnibus.musical.improv",
        instagramUrl: "https://www.instagram.com/omnibus_improv/",
      },
    }),
    prisma.organiser.create({
      data: {
        name: "Miguel Aliaga",
        slug: "miguel-aliaga",
        description: "International English-language stand-up comedian and producer.",
        instagramUrl: "https://www.instagram.com/miguelaliagacomedy/",
      },
    }),
    prisma.organiser.create({
      data: {
        name: "Victor Patrascan",
        slug: "victor-patrascan",
        description: "Touring English-language stand-up comedian and social commentator.",
        websiteUrl: "https://victorpatrascan.com/",
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
    prisma.venue.create({
      data: {
        name: "Layla Lounge Bar",
        slug: "layla-lounge-bar",
        address: "Józefa Dietla 91, 31-031 Kraków",
        latitude: 50.0563895,
        longitude: 19.9458846,
        area: "Kazimierz",
        description: "Lebanese lounge bar hosting international community and comedy events.",
        facebookUrl: "https://www.facebook.com/LaylaLoungeBar/",
        instagramUrl: "https://www.instagram.com/layla_lounge_bar/",
      },
    }),
    prisma.venue.create({
      data: {
        name: "Pub 103,8 FM",
        slug: "pub-103-8-fm",
        address: "Bożego Ciała 7, 31-059 Kraków",
        latitude: 50.0511,
        longitude: 19.9447,
        area: "Kazimierz",
        description: "Comedy pub and live performance venue in Kazimierz.",
        websiteUrl: "https://www.kupbilecik.pl/obiekty/6949/Pub%2B103%2C8%2BFM/",
        instagramUrl: "https://www.instagram.com/103.8fm_pub/",
      },
    }),
    prisma.venue.create({
      data: {
        name: "Forum Horyzonty",
        slug: "forum-horyzonty",
        address: "Marii Konopnickiej 28, 30-302 Kraków",
        latitude: 50.0478,
        longitude: 19.9322,
        area: "Ludwinów",
        description: "Event space at Forum used for touring comedy shows.",
      },
    }),
    prisma.venue.create({
      data: {
        name: "Świętego Tomasza 31",
        slug: "swietego-tomasza-31",
        address: "Świętego Tomasza 31, 31-027 Kraków",
        latitude: 50.0621481,
        longitude: 19.9419453,
        area: "Old Town",
        description: "Central Krakow venue hosting live performance and improv events.",
      },
    }),
  ]);

  await Promise.all([
    prisma.event.create({
      data: {
        title: "The Dzien Tonic Show",
        slug: "the-dzien-tonic-show-2026-05-06",
        description: "English stand-up open mic hosted by André San Miquel.",
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
        title: 'Krakow Story Slam: Theme - "The Light Returns"',
        slug: "krakow-story-slam-the-light-returns-2026-06-26",
        description:
          "English-language Krakow Story Slam night with the theme The Light Returns.",
        startDateTime: new Date("2026-06-26T19:00:00+02:00"),
        endDateTime: new Date("2026-06-26T21:30:00+02:00"),
        eventType: EventType.STORY_SLAM,
        language: EventLanguage.ENGLISH,
        facebookEventUrl: "https://www.facebook.com/events/1531819255155782",
        externalSourceName: "Facebook event",
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
        title: "Lub Me Up, Krak Me Down",
        slug: "lub-me-up-krak-me-down-2026-06-10",
        description:
          "English stand-up comedy night with YuYu and friends, co-hosted by Luke Dwornik-Longacre and Stan Kelberg.",
        startDateTime: new Date("2026-06-10T20:00:00+02:00"),
        endDateTime: new Date("2026-06-10T22:00:00+02:00"),
        eventType: EventType.SHOWCASE,
        language: EventLanguage.ENGLISH,
        facebookEventUrl: "https://www.facebook.com/events/1361779456000844/",
        instagramUrl: "https://www.instagram.com/p/DYqMDfBNrBn/",
        externalSourceName: "Facebook / Instagram",
        sourceNotes: "Co-hosted by Luke Dwornik-Longacre and Stan Kelberg.",
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
        facebookEventUrl: "https://www.facebook.com/events/1489991542638579/",
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
        facebookEventUrl: "https://www.facebook.com/events/854334386973245",
        venue: { connect: { slug: "bracka-4-poziom-1" } },
        organiser: { connect: { slug: "love-lub-comedy" } },
      },
    }),
    prisma.event.create({
      data: {
        title: "The Hot Chocolate Comedy Show",
        slug: "the-hot-chocolate-comedy-show-2026-06-18",
        description: "English comedy open mic hosted by Tony (Anthony Robinson).",
        startDateTime: new Date("2026-06-18T21:00:00+02:00"),
        endDateTime: new Date("2026-06-18T23:00:00+02:00"),
        eventType: EventType.OPEN_MIC,
        language: EventLanguage.ENGLISH,
        facebookEventUrl: "https://www.facebook.com/events/1293415799616803/",
        websiteUrl: "https://www.facebook.com/events/1293415799616803/",
        externalSourceName: "Facebook",
        sourceNotes:
          "Facebook confirms the date, venue, and host; 21:00 start follows the established time of previous editions.",
        isRecurring: true,
        venue: { connect: { slug: "layla-lounge-bar" } },
        organiser: { connect: { slug: "hot-chocolate-comedy" } },
      },
    }),
    prisma.event.create({
      data: {
        title: 'Krakow Story Slam: "The Most Out of Place I Felt."',
        slug: "krakow-story-slam-the-most-out-of-place-i-felt-2026-07-24",
        description:
          "English-language true-story open mic with the theme The Most Out of Place I Felt. Stories are 5–7 minutes; audience judges score each tale.",
        startDateTime: new Date("2026-07-24T19:00:00+02:00"),
        endDateTime: new Date("2026-07-24T21:30:00+02:00"),
        eventType: EventType.STORY_SLAM,
        language: EventLanguage.ENGLISH,
        facebookEventUrl: "https://www.facebook.com/events/1998006590835841/",
        websiteUrl: "https://www.facebook.com/events/1998006590835841/",
        externalSourceName: "Facebook",
        sourceNotes: "facebookEventId:1998006590835841; user-supplied link.",
        venue: { connect: { slug: "the-atrium-hotel" } },
        organiser: { connect: { slug: "cozy-events" } },
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
