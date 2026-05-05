const { getManualEvents } = require("./providers/manualProvider");

/**
 * Future extension point:
 * - fetchFromFacebook()
 * - fetchFromMeetup()
 * - mergeAndDeduplicateEvents()
 */
function loadEvents() {
  const now = new Date();
  const events = getManualEvents().filter((event) => new Date(event.date) >= now);
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function getEvents(language) {
  const events = loadEvents();
  if (!language) return events;
  return events.filter((event) => event.language === language);
}

function getVenues(language) {
  const events = getEvents(language);
  const grouped = new Map();

  for (const event of events) {
    const key = `${event.venue.name}-${event.venue.lat}-${event.venue.lng}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        name: event.venue.name,
        lat: event.venue.lat,
        lng: event.venue.lng,
        events: [],
      });
    }
    grouped.get(key).events.push({
      id: event.id,
      name: event.name,
      date: event.date,
      description: event.description,
      venue: event.venue,
      links: event.links,
      language: event.language,
    });
  }

  return Array.from(grouped.values());
}

module.exports = {
  getEvents,
  getVenues,
};
