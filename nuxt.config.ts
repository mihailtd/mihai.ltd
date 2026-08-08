// https://nuxt.com/docs/api/configuration/nuxt-config

const isDev = process.env.NODE_ENV !== "production";

export default defineNuxtConfig({
  compatibilityDate: "2026-08-08",
  devtools: { enabled: isDev },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/turnstile",
    "@nuxt/image",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    "@nuxtjs/color-mode",
    "@nuxt/content",
  ],
  css: ["@/assets/index.css"],
  turnstile: {
    siteKey: "0x4AAAAAAAUBxBNAPgRBo5hj",
  },
  build: {
    transpile: ["echarts", "zrender", "tslib"],
  },
  app: {
    head: {
      title:
        "Mihai Farcas - Software Architect, Agentic AI Expert & Content Creator",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Mihai Farcas is a Software Architect specializing in Agentic AI, AI automations, and n8n consulting. YouTube content creator at Let's Talk Dev, helping developers build scalable enterprise systems.",
        },
        {
          name: "keywords",
          content:
            "Mihai Farcas, software architect, agentic ai, ai automations, n8n, n8n partner, content creator, consulting, youtube, software engineering, enterprise architecture, ai agents, langraph, automation workflows",
        },
        {
          name: "author",
          content: "Mihai Farcas",
        },
        // Open Graph
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://mihai.ltd/" },
        {
          property: "og:title",
          content:
            "Mihai Farcas - Software Architect, Agentic AI Expert & Content Creator",
        },
        {
          property: "og:description",
          content:
            "Mihai Farcas is a Software Architect specializing in Agentic AI, AI automations, and n8n consulting. YouTube content creator at Let's Talk Dev.",
        },
        { property: "og:image", content: "https://mihai.ltd/og-cover.jpg" },
        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content:
            "Mihai Farcas - Software Architect, Agentic AI Expert & Content Creator",
        },
        {
          name: "twitter:description",
          content:
            "Software Architect specializing in Agentic AI, AI automations, and n8n consulting. YouTube content creator at Let's Talk Dev.",
        },
        { name: "twitter:image", content: "https://mihai.ltd/og-cover.jpg" },
        { name: "twitter:site", content: "@letstalkdev" },
        { name: "twitter:creator", content: "@letstalkdev" },
      ],
      link: [{ rel: "canonical", href: "https://mihai.ltd/" }],
    },
  },
  site: {
    url: "https://mihai.ltd",
    name: "Mihai Farcas - Software Architect & Content Creator",
  },
  image: {},
  sitemap: {},
  robots: {
    groups: [{ userAgent: "*", allow: "/" }],
    sitemap: ["https://mihai.ltd/sitemap.xml"],
  },
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
      crawlLinks: true,
      routes: ["/sitemap.xml"],
    },
    routeRules: {
      // Content-hashed build assets are safe to cache forever — a filename
      // change invalidates the cache automatically.
      "/_nuxt/**": {
        headers: { "Cache-Control": "public, max-age=31536000, immutable" },
      },
      "/images/**": {
        headers: { "Cache-Control": "public, max-age=31536000, immutable" },
      },
      // Deliberately no blanket "/**" cache-control: these pages are
      // content-driven (queryCollection at request time) and edited often,
      // so a 10-minute browser cache on the HTML document itself was
      // serving stale pages after content changes until a hard refresh.
      "/blog/**": { prerender: true },
    },
  },
});
