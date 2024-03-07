// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/apollo", "@nuxtjs/turnstile"],
  css: ["@/assets/index.css"],
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  turnstile: {
    siteKey: "0x4AAAAAAAUBxBNAPgRBo5hj",
  },
  runtimeConfig: {
    turnstile: {
      // This can be overridden at runtime via the NUXT_TURNSTILE_SECRET_KEY
      // environment variable.
      secretKey: "",
    },
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint: "https://cms.mihai.ltd/graphql",
      },
    },
  },
  app: {
    head: {
      title: "Mihai @ Let's Talk Dev - Portfolio Website",
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          hid: "description",
          name: "description",
          content: "Mihai's portfolio website",
        },
        {
          name: "keywords",
          content: "portfolio, website, dev, developer, programmer, youtube",
        },
      ],
    },
  },
});
