// Site-wide SEO defaults that must be correct on every route:
// - a self-referencing canonical + og:url (never the homepage for everything)
// - a default social card image, overridable per page
// - the Person / WebSite / Organization JSON-LD graph that page-level
//   schema (articles, FAQ, profile page) references by @id
import {
  DEFAULT_OG_IMAGE,
  PERSON_HEADLINE,
  PERSON_NAME,
  SITE_NAME,
  SITE_URL,
  organizationNode,
  personNode,
  websiteNode,
} from "~/composables/useSiteSchema";

export default defineNuxtPlugin(() => {
  const route = useRouter().currentRoute;

  const canonical = computed(() => {
    const path = route.value.path.replace(/\/+$/, "") || "/";
    const url = `${SITE_URL}${path === "/" ? "/" : path}`;
    // Paginated blog listings are distinct pages; every other query string
    // (filters, search) is a view of the same canonical page.
    const page = Number(route.value.query.page);
    if (path === "/blog" && Number.isInteger(page) && page > 1) {
      return `${url}?page=${String(page)}`;
    }
    return url;
  });

  useHead({
    htmlAttrs: { lang: "en" },
    link: [{ key: "canonical", rel: "canonical", href: canonical }],
    meta: [{ key: "og:url", property: "og:url", content: canonical }],
    script: [
      {
        key: "ld-site",
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [personNode, websiteNode, organizationNode],
        }),
      },
    ],
  });

  useSeoMeta({
    ogSiteName: SITE_NAME,
    ogLocale: "en_US",
    ogType: "website",
    ogImage: DEFAULT_OG_IMAGE,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: `${PERSON_NAME} — ${PERSON_HEADLINE}`,
    twitterCard: "summary_large_image",
    twitterImage: DEFAULT_OG_IMAGE,
  });
});
