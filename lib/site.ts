/**
 * Canonical site URL for SEO (metadataBase, sitemap, robots, JSON-LD).
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://www.krakowcomedy.com).
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.krakowcomedy.com";
  return raw.replace(/\/$/, "");
}
