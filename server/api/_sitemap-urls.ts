import { defineEventHandler, type H3Event } from "h3";
import { queryCollection } from "@nuxt/content/server";

type SitemapEntry = { loc: string; lastmod?: string };

// Every collection is served under /blog/<slug>. lastmod comes from the
// `updated` frontmatter (falling back to `date`) so crawlers can tell which
// reports changed.
const toEntry = (item: {
  path: string;
  date?: string;
  updated?: string;
}): SitemapEntry | null => {
  const slug = item.path.split("/").pop();
  if (!slug) return null;
  const lastmod = item.updated || item.date;
  return { loc: `/blog/${slug}`, ...(lastmod ? { lastmod } : {}) };
};

export default defineEventHandler(async (event: H3Event) => {
  const urls: SitemapEntry[] = [];

  for (const collection of ["blog", "books", "radar"] as const) {
    try {
      const items = await queryCollection(event, collection).all();
      for (const item of items) {
        const entry = toEntry(item);
        if (entry) urls.push(entry);
      }
    } catch (e) {
      console.error(`Error querying ${collection} collection for sitemap:`, e);
    }
  }

  return urls;
});
