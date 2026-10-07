import { defineConfig } from "@nuxtjs/mdc/config";
import remarkAlert from "./utils/remark-alert.mjs";

export default defineConfig({
  unified: {
    remark(processor) {
      return processor.use(remarkAlert);
    },
  },
});
