// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  modules: [
    '@nuxtjs/tailwindcss',
    // '@nuxtjs/apollo', // enable when CMS is ready
    '@nuxtjs/turnstile',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxtjs/color-mode',
  ],
  css: ['@/assets/index.css'],
  app: {
    head: {
      title: "Mihai @ Let's Talk Dev - Portfolio",
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: "Mihai's portfolio website" },
        { name: 'keywords', content: 'portfolio, website, dev, developer, programmer, youtube' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://mihai.ltd/' },
        { property: 'og:title', content: "Mihai @ Let's Talk Dev - Portfolio" },
        { property: 'og:description', content: "Mihai's portfolio website" },
        { property: 'og:image', content: 'https://mihai.ltd/og-cover.jpg' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: "Mihai @ Let's Talk Dev - Portfolio" },
        { name: 'twitter:description', content: "Mihai's portfolio website" },
        { name: 'twitter:image', content: 'https://mihai.ltd/og-cover.jpg' },
      ],
      link: [{ rel: 'canonical', href: 'https://mihai.ltd/' }],
    },
  },
  site: { url: 'https://mihai.ltd', name: "Mihai @ Let's Talk Dev" },
  image: {},
  sitemap: {},
  robots: {
    groups: [{ userAgent: '*', allow: '/' }],
    sitemap: ['https://mihai.ltd/sitemap.xml'],
  },
  nitro: {
    prerender: { autoSubfolderIndex: false },
    routeRules: {
      '/**': { headers: { 'Cache-Control': 'public, max-age=600' } },
      '/images/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
      // Basic, safe security headers
      '/**': {
        headers: {
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
        }
      }
    },
  },
  turnstile: { siteKey: '0x4AAAAAAAUBxBNAPgRBo5hj' },
  // apollo: { clients: { default: { httpEndpoint: 'https://cms.mihai.ltd/graphql' } } },
});
