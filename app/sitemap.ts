import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticPaths: MetadataRoute.Sitemap = [
    "",
    "/calendar",
    "/venues",
    "/organisers",
    "/touring-comics",
    "/map",
    "/about",
    "/contact",
    "/how-this-site-works",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const events = await prisma.event.findMany({
    select: { slug: true, updatedAt: true, startDateTime: true },
    orderBy: { startDateTime: "desc" },
  });

  const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${base}/events/${event.slug}`,
    lastModified: event.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPaths, ...eventEntries];
}
