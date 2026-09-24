import { defineEventHandler, type H3Event } from "h3";
import { queryCollection } from "@nuxt/content/server";

export default defineEventHandler(async (event: H3Event) => {
  const urls: Array<{ loc: string }> = [];

  try {
    const blogPosts = await queryCollection(event, "blog").all();
    for (const post of blogPosts) {
      const slug = post.path.split("/").pop();
      if (slug) {
        urls.push({ loc: `/blog/${slug}` });
      }
    }
  } catch (e) {
    console.error("Error querying blog collection for sitemap:", e);
  }

  try {
    const books = await queryCollection(event, "books").all();
    for (const book of books) {
      const slug = book.path.split("/").pop();
      if (slug) {
        urls.push({ loc: `/blog/${slug}` });
      }
    }
  } catch (e) {
    console.error("Error querying books collection for sitemap:", e);
  }

  try {
    const radarItems = await queryCollection(event, "radar").all();
    for (const item of radarItems) {
      const slug = item.path.split("/").pop();
      if (slug) {
        urls.push({ loc: `/blog/${slug}` });
      }
    }
  } catch (e) {
    console.error("Error querying radar collection for sitemap:", e);
  }

  return urls;
});
