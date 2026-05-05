"use client";

import dynamic from "next/dynamic";

const VenueMap = dynamic(() => import("./venue-map").then((mod) => mod.VenueMap), {
  ssr: false,
});

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

export function MapClient({ venues }: { venues: VenueMapData[] }) {
  return <VenueMap venues={venues} />;
}
