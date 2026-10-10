module.exports = {
  plugins: ["prettier-plugin-tailwindcss"],
  // Tailwind v4 has no JS config; the plugin reads the theme from the CSS entry.
  tailwindStylesheet: "./assets/index.css",
};
