<template>
  <figure
    class="image-wrapper not-prose my-10 text-center"
    :class="wrapperClasses"
  >
    <div
      class="inline-block w-full overflow-hidden rounded-2xl border border-white/10 bg-[#090025]/60 shadow-2xl backdrop-blur-xs transition-all duration-300"
    >
      <component
        :is="ImageComponent"
        :src="refinedSrc"
        :alt="cleanAlt"
        :width="props.width"
        :height="props.height"
        class="mx-auto h-auto w-full object-contain"
        loading="lazy"
      />
    </div>
    <figcaption
      v-if="caption"
      aria-hidden="true"
      class="mt-3 text-center font-mono text-xs text-gray-400"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { withTrailingSlash, withLeadingSlash, joinURL } from "ufo";
import { useRuntimeConfig } from "#imports";
import ImageComponent from "#build/mdc-image-component.mjs";

const props = defineProps({
  src: {
    type: String,
    default: "",
  },
  alt: {
    type: String,
    default: "",
  },
  width: {
    type: [String, Number],
    default: undefined,
  },
  height: {
    type: [String, Number],
    default: undefined,
  },
});

const size = computed(() => {
  const src = props.src || "";
  const alt = props.alt || "";

  // Extra-wide / full width modifier
  if (
    src.includes("#extra-wide") ||
    src.includes("#extrawide") ||
    src.includes("#full") ||
    src.includes("size=extra-wide") ||
    src.includes("size=full") ||
    alt.includes("#extra-wide") ||
    alt.includes("| extra-wide") ||
    alt.includes("| full")
  ) {
    return "extra-wide";
  }

  // Wide modifier (wider than article container)
  if (
    src.includes("#wide") ||
    src.includes("size=wide") ||
    alt.includes("#wide") ||
    alt.includes("| wide")
  ) {
    return "wide";
  }

  // Default: narrow (fits standard article column)
  return "narrow";
});

const wrapperClasses = computed(() => {
  if (size.value === "extra-wide") {
    // Medium-style extra-wide / almost screen width
    return "relative left-1/2 -translate-x-1/2 w-[min(1380px,calc(100vw-2rem))] max-w-[1380px]";
  }
  if (size.value === "wide") {
    // Medium-style wide / breaking out of article column symmetrically
    return "relative left-1/2 -translate-x-1/2 w-[min(1140px,calc(100vw-3rem))] max-w-[1140px]";
  }
  // Standard narrow / in-column
  return "mx-auto w-full max-w-full";
});

const cleanSrc = computed(() => {
  let s = props.src || "";
  s = s.replace(/#(extra-wide|extrawide|wide|narrow|full)$/, "");
  s = s.replace(/[?&]size=(extra-wide|extrawide|wide|narrow|full)/, "");
  return s;
});

const refinedSrc = computed(() => {
  const s = cleanSrc.value;
  if (s.startsWith("/") && !s.startsWith("//")) {
    const _base = withLeadingSlash(
      withTrailingSlash(useRuntimeConfig().app.baseURL),
    );
    if (_base !== "/" && !s.startsWith(_base)) {
      return joinURL(_base, s);
    }
  }
  return s;
});

const caption = computed(() => {
  const alt = props.alt || "";
  if (alt.includes("|")) {
    return (alt.split("|")[0] ?? "").trim();
  }
  const stripped = alt
    .replace(/#(extra-wide|extrawide|wide|narrow|full)/g, "")
    .trim();
  return stripped;
});

const cleanAlt = computed(() => {
  return caption.value || "Illustration";
});
</script>
