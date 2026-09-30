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
  css: ["@/assets/index.css", "vue-echarts/style.css"],
  turnstile: {
    siteKey: "0x4AAAAAAAUBxBNAPgRBo5hj",
  },
  build: {
    transpile: ["echarts", "zrender", "tslib", "vue-echarts"],
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      title: "Mihai Farcas — Software Architect · Agentic AI, n8n & MCP",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Mihai Farcas is a Software Architect who designs and ships production Agentic AI systems, n8n automations and MCP servers, with 10+ years in enterprise healthcare, fintech and insurance. Creator of the Let's Talk Dev YouTube channel.",
        },
        { name: "author", content: "Mihai Farcas" },
        { name: "twitter:site", content: "@letstalkdev" },
        { name: "twitter:creator", content: "@letstalkdev" },
      ],
      // Canonical, og:url, og:image and the site JSON-LD graph are set per
      // route in plugins/seo.ts — a static canonical here would point every
      // page at the homepage.
    },
  },
  site: {
    url: "https://mihai.ltd",
    name: "Mihai Farcas",
  },
  image: {},
  sitemap: {
    sources: ["/api/_sitemap-urls"],
  },
  robots: {
    groups: [{ userAgent: "*", allow: "/" }],
    sitemap: ["https://mihai.ltd/sitemap.xml"],
  },
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
      crawlLinks: true,
      routes: [
        "/",
        "/blog",
        "/radar",
        "/stack",
        "/contact",
        "/sitemap.xml",
        "/llms.txt",
      ],
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
      // Explicitly prerender blog list, articles, and stack for static Cloudflare Workers serving
      "/blog": { prerender: true },
      "/blog/**": { prerender: true },
      "/stack": { prerender: true },
      // Backward compatibility redirects for legacy /books URLs
      "/books": {
        redirect: { to: "/blog?type=book_summary", statusCode: 301 },
      },
      "/books/**": {
        redirect: { to: "/blog/**", statusCode: 301 },
      },
    },
  },
});
