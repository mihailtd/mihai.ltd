<template>
  <figure
    class="image-wrapper not-prose my-10 text-center"
    :class="wrapperClasses"
  >
    <div
      class="inline-block w-full overflow-hidden rounded-2xl border border-white/10 bg-[#090025]/60 shadow-2xl backdrop-blur-xs transition-all duration-300"
    >
      <NuxtImg
        :src="src"
        :alt="alt || caption || 'Blog image'"
        class="mx-auto h-auto w-full object-contain"
        loading="lazy"
      />
    </div>
    <figcaption
      v-if="caption"
      class="mt-3 text-center font-mono text-xs text-gray-400"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    size?: "narrow" | "wide" | "extra-wide" | "full";
    caption?: string;
  }>(),
  {
    size: "narrow",
    alt: "",
    caption: "",
  },
);

const wrapperClasses = computed(() => {
  if (props.size === "extra-wide" || props.size === "full") {
    // Medium-style extra-wide (almost screen width)
    return "relative left-1/2 -translate-x-1/2 w-[min(1380px,calc(100vw-2rem))] max-w-[1380px]";
  }
  if (props.size === "wide") {
    // Medium-style wide (extends past the article text margins)
    return "relative left-1/2 -translate-x-1/2 w-[min(1140px,calc(100vw-3rem))] max-w-[1140px]";
  }
  // Standard narrow (in-article width)
  return "mx-auto w-full max-w-full";
});
</script>
