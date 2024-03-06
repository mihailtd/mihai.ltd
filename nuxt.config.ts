// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["@/assets/index.css"],
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
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
