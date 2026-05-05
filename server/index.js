const express = require("express");
const fs = require("fs");
const path = require("path");
const { getEvents, getVenues } = require("./services/eventService");

const app = express();
const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "..", "public");
const indexTemplate = fs.readFileSync(path.join(publicDir, "index.html"), "utf8");

app.set("trust proxy", true);

app.use(express.static(publicDir, { index: false }));

function getBaseUrl(req) {
  const configuredUrl = process.env.PUBLIC_SITE_URL || process.env.SITE_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");
  return `${req.protocol}://${req.get("host")}`;
}

function getPrimaryLink(event) {
  return event.links?.[0]?.url || event.link?.url;
}

function getStructuredData(baseUrl) {
  const events = getEvents("EN");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        name: "Krakow Comedy",
        url: baseUrl,
        inLanguage: "en",
        description: "English-language comedy shows, open mics, and storytelling nights in Krakow.",
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "Krakow Comedy",
        url: baseUrl,
        sameAs: [
          "https://www.facebook.com/profile.php?id=61555282495625",
          "https://www.facebook.com/profile.php?id=100083820738347",
          "https://www.instagram.com/krakowstoryslam",
          "https://www.facebook.com/share/g/1ASGjHJ5dx/",
          "https://www.facebook.com/Krakmeupcomedy/",
          "https://www.instagram.com/krakmeupcomedy/",
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${baseUrl}/#events`,
        name: "Upcoming English comedy events in Krakow",
        itemListElement: events.map((event, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Event",
            "@id": `${baseUrl}/#${event.id}`,
            name: event.name,
            description: event.description,
            startDate: event.date,
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            inLanguage: "en",
            url: getPrimaryLink(event) || baseUrl,
            location: {
              "@type": "Place",
              name: event.venue.name,
              geo: {
                "@type": "GeoCoordinates",
                latitude: event.venue.lat,
                longitude: event.venue.lng,
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Krakow",
                addressCountry: "PL",
              },
            },
            organizer: {
              "@type": "Organization",
              name: event.name.split(":")[0].replace(/!$/, ""),
              url: getPrimaryLink(event) || baseUrl,
            },
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              url: getPrimaryLink(event) || baseUrl,
            },
          },
        })),
      },
    ],
  };
}

function renderIndex(req) {
  const baseUrl = getBaseUrl(req);
  return indexTemplate
    .replaceAll("__CANONICAL_URL__", `${baseUrl}/`)
    .replace("__STRUCTURED_DATA__", JSON.stringify(getStructuredData(baseUrl), null, 2));
}

app.get("/api/events", (req, res) => {
  const language = req.query.language;
  const events = getEvents(language);
  res.json({ events });
});

app.get("/api/venues", (req, res) => {
  const language = req.query.language;
  const venues = getVenues(language);
  res.json({ venues });
});

app.get("/robots.txt", (req, res) => {
  const baseUrl = getBaseUrl(req);
  res.type("text/plain").send(`User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`);
});

app.get("/sitemap.xml", (req, res) => {
  const baseUrl = getBaseUrl(req);
  res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`);
});

app.use((_req, res) => {
  res.send(renderIndex(_req));
});

app.listen(port, () => {
  console.log(`Krakow Comedy running on http://localhost:${port}`);
});
