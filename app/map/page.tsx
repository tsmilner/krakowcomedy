import { getVenueWithEvents } from "@/lib/data";
import { MapClient } from "@/components/map-client";

export const metadata = {
  title: "Venue Map | Krakow Comedy Calendar",
  description: "Interactive map of Krakow comedy venues and upcoming events.",
};

type MapPageProps = {
  searchParams?: Promise<{ venue?: string }>;
};

export default async function MapPage({ searchParams }: MapPageProps) {
  const params = (await searchParams) ?? {};
  const venues = await getVenueWithEvents();
  return <MapPageContent venues={venues} highlightedVenueSlug={params.venue} />;
}

function MapPageContent({
  venues,
  highlightedVenueSlug,
}: {
  venues: Awaited<ReturnType<typeof getVenueWithEvents>>;
  highlightedVenueSlug?: string;
}) {
  return (
    <div className="space-y-6">
      <h1 className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
        Comedy venues map
      </h1>
      <p className="text-zinc-400">
        Explore where shows happen across Krakow. Click markers to view venue info and upcoming events.
      </p>
      <MapClient venues={venues} highlightedVenueSlug={highlightedVenueSlug} />
    </div>
  );
}
