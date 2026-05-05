"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Link from "next/link";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const MAP_TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

function googleMapsDirectionsUrl(latitude: number, longitude: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}

type VenueMapData = {
  id: number;
  name: string;
  slug: string;
  address: string;
  latitude: number;
  longitude: number;
  websiteUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  events: { id: number; title: string; slug: string }[];
};

export function VenueMap({
  venues,
  highlightedVenueSlug,
}: {
  venues: VenueMapData[];
  highlightedVenueSlug?: string;
}) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});
  const highlightedVenue = useMemo(
    () => venues.find((venue) => venue.slug === highlightedVenueSlug),
    [venues, highlightedVenueSlug],
  );

  useEffect(() => {
    if (!highlightedVenue) return;
    let attempts = 0;
    const maxAttempts = 20;

    const openHighlightedPopup = () => {
      const marker = markerRefs.current[highlightedVenue.slug];
      const map = mapRef.current;

      if (marker && map) {
        map.setView([highlightedVenue.latitude, highlightedVenue.longitude], 15, { animate: true });
        marker.openPopup();
        return;
      }

      if (attempts < maxAttempts) {
        attempts += 1;
        window.setTimeout(openHighlightedPopup, 120);
      }
    };

    openHighlightedPopup();
  }, [highlightedVenue]);

  return (
    <div className="relative h-[360px] overflow-hidden rounded-2xl border border-violet-500/35 bg-zinc-900/80 shadow-[0_0_40px_-12px_rgba(124,58,237,0.45)] ring-1 ring-cyan-500/15 sm:h-[460px]">
      <MapContainer
        ref={mapRef}
        center={[50.0614, 19.9366]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer attribution={CARTO_ATTRIBUTION} url={MAP_TILE_URL} />
        {venues.map((venue) => (
          <Marker
            key={venue.id}
            position={[venue.latitude, venue.longitude]}
            ref={(marker) => {
              markerRefs.current[venue.slug] = marker;
            }}
          >
            <Popup>
              <div className="space-y-3 text-base text-white">
                <h3 className="text-lg font-bold text-white">{venue.name}</h3>
                <p className="text-sm text-slate-100">{venue.address}</p>
                <a
                  href={googleMapsDirectionsUrl(venue.latitude, venue.longitude)}
                  target="_blank"
                  rel="noreferrer"
                  className="popup-button inline-flex w-full items-center justify-center rounded-full border-2 border-violet-300/80 bg-violet-700 px-3.5 py-2.5 text-center text-base font-bold tracking-[0.01em] text-white shadow-sm hover:bg-violet-600"
                >
                  Get directions
                </a>
                <p className="text-base font-bold text-white">Upcoming:</p>
                <ul className="list-disc pl-5 text-slate-100">
                  {venue.events.slice(0, 3).map((event) => (
                    <li key={event.id}>
                      <Link
                        href={`/events/${event.slug}`}
                        className="font-semibold text-blue-100 underline decoration-blue-200/60 underline-offset-2 hover:text-white"
                      >
                        {event.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3 text-sm">
                  {venue.websiteUrl && (
                    <a
                      href={venue.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-blue-100 underline decoration-blue-200/60"
                    >
                      Website
                    </a>
                  )}
                  {venue.instagramUrl && (
                    <a
                      href={venue.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-blue-100 underline decoration-blue-200/60"
                    >
                      Instagram
                    </a>
                  )}
                  {venue.facebookUrl && (
                    <a
                      href={venue.facebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-blue-100 underline decoration-blue-200/60"
                    >
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
