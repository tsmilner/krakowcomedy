"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
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

export function VenueMap({ venues }: { venues: VenueMapData[] }) {
  return (
    <div className="relative h-[460px] overflow-hidden rounded-2xl border border-violet-500/35 bg-zinc-900/80 shadow-[0_0_40px_-12px_rgba(124,58,237,0.45)] ring-1 ring-cyan-500/15">
      <MapContainer center={[50.0614, 19.9366]} zoom={13} className="h-full w-full">
        <TileLayer attribution={CARTO_ATTRIBUTION} url={MAP_TILE_URL} />
        {venues.map((venue) => (
          <Marker key={venue.id} position={[venue.latitude, venue.longitude]}>
            <Popup>
              <div className="space-y-2 text-sm text-zinc-200">
                <h3 className="font-semibold text-white">{venue.name}</h3>
                <p className="text-zinc-400">{venue.address}</p>
                <a
                  href={googleMapsDirectionsUrl(venue.latitude, venue.longitude)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-[0_0_14px_-3px_rgba(168,85,247,0.55)] hover:from-violet-500 hover:to-fuchsia-500"
                >
                  Get directions
                </a>
                <p className="font-medium text-cyan-200">Upcoming:</p>
                <ul className="list-disc pl-5 text-zinc-300">
                  {venue.events.slice(0, 3).map((event) => (
                    <li key={event.id}>
                      <Link
                        href={`/events/${event.slug}`}
                        className="font-medium text-cyan-200 underline decoration-fuchsia-500/40 underline-offset-2 hover:text-fuchsia-200"
                      >
                        {event.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {venue.websiteUrl && (
                    <a
                      href={venue.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-200 underline decoration-violet-500/40"
                    >
                      Website
                    </a>
                  )}
                  {venue.instagramUrl && (
                    <a
                      href={venue.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-200 underline decoration-violet-500/40"
                    >
                      Instagram
                    </a>
                  )}
                  {venue.facebookUrl && (
                    <a
                      href={venue.facebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-200 underline decoration-violet-500/40"
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
