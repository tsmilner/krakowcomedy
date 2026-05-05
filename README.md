# Krakow Comedy

Compact Krakow comedy events app with:
- EN/PL tabs (`Events in English`, `Events in Polish`)
- Chronological upcoming event cards
- Source-labeled links (`Meetup`, `Facebook`, `Website`)
- Leaflet map with venue markers and event popups
- Marker click -> highlights matching event card

## Tech

- Node.js
- Express backend
- Vanilla JS frontend
- Leaflet map

## Event model

The app uses this structured format in `server/services/providers/manualProvider.js`:

```js
{
  name: string,
  date: ISO string,
  language: "EN" | "PL",
  venue: {
    name: string,
    lat: number,
    lng: number
  },
  link: {
    url: string,
    label: string
  }
}
```

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production run:

```bash
npm install
npm run build
npm run start
```

(`build` is a no-op for this MVP.)

## SEO config

Set `PUBLIC_SITE_URL` in production so canonical URLs, `robots.txt`, `sitemap.xml`, and structured data use the real domain:

```bash
PUBLIC_SITE_URL="https://your-domain.com"
```

## Deploy to VPS

1. Copy project to server
2. Install Node.js 20+
3. Run:

```bash
npm install
npm run start
```

## PM2

```bash
pm2 start npm --name krakow-comedy -- start
pm2 save
pm2 startup
```

## Nginx reverse proxy (example)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Future integration architecture

Current data comes from `manualProvider`.

To add auto-updating later:
- Add `facebookProvider.js` and `meetupProvider.js`
- Merge provider outputs in `eventService.js`
- Deduplicate and normalize to the same event model
- Optionally add scheduled refresh (cron/queue) before exposing to `/api/events`
