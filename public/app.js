const state = {
  language: "EN",
  events: [],
  map: null,
  markers: [],
  selectedEventId: null,
  calendarDate: new Date(),
};

const eventListEl = document.getElementById("event-list");
const calendarGridEl = document.getElementById("calendar-grid");
const calendarMonthEl = document.getElementById("calendar-month");
const calendarPrevEl = document.getElementById("calendar-prev");
const calendarNextEl = document.getElementById("calendar-next");

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getEventLinks(event) {
  return event.links || (event.link ? [event.link] : []);
}

function toGoogleCalendarDate(date) {
  return date.toISOString().replace(/[-:]|\.\d{3}/g, "");
}

function getGoogleCalendarUrl(event) {
  const start = new Date(event.date);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const sourceLinks = getEventLinks(event)
    .map((eventLink) => `${eventLink.label}: ${eventLink.url}`)
    .join("\n");
  const details = [event.description, sourceLinks].filter(Boolean).join("\n\n");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.name,
    dates: `${toGoogleCalendarDate(start)}/${toGoogleCalendarDate(end)}`,
    details,
    location: `${event.venue.name}, Krakow, Poland`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function renderLinks(event) {
  const links = document.createElement("div");
  links.className = "event-links";

  getEventLinks(event).forEach((eventLink) => {
    const link = document.createElement("a");
    link.className = "event-link";
    link.href = eventLink.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = eventLink.label;
    links.appendChild(link);
  });

  const calendarLink = document.createElement("a");
  calendarLink.className = "event-link calendar-link";
  calendarLink.href = getGoogleCalendarUrl(event);
  calendarLink.target = "_blank";
  calendarLink.rel = "noreferrer";
  calendarLink.textContent = "Add to my Google Calendar";
  links.appendChild(calendarLink);

  return links;
}

function formatDate(iso) {
  const date = new Date(iso);
  return date.toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function setCalendarMonth(date) {
  state.calendarDate = new Date(date.getFullYear(), date.getMonth(), 1);
  renderCalendar();
}

function renderCalendar() {
  if (!calendarGridEl || !calendarMonthEl) return;

  const monthStart = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth(), 1);
  const monthEnd = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() + 1, 0);
  const startOffset = (monthStart.getDay() + 6) % 7;
  const eventsByDate = new Map();

  state.events.forEach((event) => {
    const key = dateKey(new Date(event.date));
    if (!eventsByDate.has(key)) eventsByDate.set(key, []);
    eventsByDate.get(key).push(event);
  });

  calendarMonthEl.textContent = monthStart.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
  calendarGridEl.innerHTML = "";

  for (let i = 0; i < startOffset; i += 1) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day empty";
    calendarGridEl.appendChild(emptyCell);
  }

  for (let day = 1; day <= monthEnd.getDate(); day += 1) {
    const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
    const key = dateKey(date);
    const dayEvents = eventsByDate.get(key) || [];
    const cell = document.createElement(dayEvents.length ? "button" : "div");
    cell.className = "calendar-day";
    if (dayEvents.length) cell.classList.add("has-event");
    if (key === dateKey(new Date())) cell.classList.add("today");

    const number = document.createElement("span");
    number.className = "calendar-day-number";
    number.textContent = String(day);
    cell.appendChild(number);

    dayEvents.slice(0, 2).forEach((event) => {
      const eventLabel = document.createElement("span");
      eventLabel.className = "calendar-event";
      eventLabel.textContent = `${formatTime(event.date)} ${event.name}`;
      cell.appendChild(eventLabel);
    });

    if (dayEvents.length > 2) {
      const more = document.createElement("span");
      more.className = "calendar-more";
      more.textContent = `+${dayEvents.length - 2} more`;
      cell.appendChild(more);
    }

    if (dayEvents.length) {
      cell.type = "button";
      cell.addEventListener("click", () => highlightEvent(dayEvents[0].id));
    }

    calendarGridEl.appendChild(cell);
  }
}

function eventCard(event) {
  const card = document.createElement("article");
  card.className = "event-card";
  card.id = `event-${event.id}`;
  if (state.selectedEventId === event.id) {
    card.classList.add("highlighted");
  }

  const name = document.createElement("h3");
  name.className = "event-name";
  name.textContent = event.name;

  const meta = document.createElement("p");
  meta.className = "event-meta";
  meta.textContent = `${formatDate(event.date)} - ${event.venue.name}`;

  const description = document.createElement("p");
  description.className = "event-description";
  description.textContent = event.description || "";

  card.append(name, meta);
  if (event.description) card.append(description);
  card.append(renderLinks(event));
  return card;
}

function renderEventList() {
  eventListEl.innerHTML = "";
  state.events.forEach((event) => {
    eventListEl.appendChild(eventCard(event));
  });
}

function highlightEvent(eventId) {
  state.selectedEventId = eventId;
  renderEventList();
  renderCalendar();
  const target = document.getElementById(`event-${eventId}`);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function clearMarkers() {
  state.markers.forEach((marker) => state.map.removeLayer(marker));
  state.markers = [];
}

function buildPopupContent(venue) {
  const wrapper = document.createElement("div");
  const title = document.createElement("div");
  title.className = "popup-title";
  title.textContent = venue.name;
  wrapper.appendChild(title);

  venue.events.forEach((event, index) => {
    const row = document.createElement("div");
    row.className = "popup-event";
    const eventName = document.createElement("div");
    eventName.textContent = event.name;
    const eventDate = document.createElement("div");
    eventDate.textContent = formatDate(event.date);
    const focusButton = document.createElement("button");
    focusButton.type = "button";
    focusButton.textContent = "Highlight";
    focusButton.addEventListener("click", () => highlightEvent(event.id));
    row.append(eventName, eventDate, renderLinks(event), focusButton);
    wrapper.appendChild(row);

    if (index === 0) {
      wrapper.addEventListener("click", () => highlightEvent(event.id), { once: true });
    }
  });

  return wrapper;
}

async function renderMap() {
  const response = await fetch(`/api/venues?language=${state.language}`);
  const payload = await response.json();
  const venues = payload.venues;

  clearMarkers();

  venues.forEach((venue) => {
    const marker = L.marker([venue.lat, venue.lng]).addTo(state.map);
    marker.bindPopup(buildPopupContent(venue));
    marker.on("click", () => {
      if (venue.events[0]) highlightEvent(venue.events[0].id);
    });
    state.markers.push(marker);
  });
}

async function loadEvents() {
  const response = await fetch(`/api/events?language=${state.language}`);
  const payload = await response.json();
  state.events = payload.events;
  state.selectedEventId = state.events[0]?.id || null;
  if (state.events[0]) {
    const firstEventDate = new Date(state.events[0].date);
    state.calendarDate = new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), 1);
  }
  renderCalendar();
  renderEventList();
  await renderMap();
}

function initMap() {
  state.map = L.map("map").setView([50.0617, 19.9373], 13.4);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(state.map);
}

initMap();
calendarPrevEl?.addEventListener("click", () => {
  setCalendarMonth(new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() - 1, 1));
});
calendarNextEl?.addEventListener("click", () => {
  setCalendarMonth(new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() + 1, 1));
});
loadEvents();
