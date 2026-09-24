<template>
  <div
    class="my-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-2xl backdrop-blur-xl sm:p-6"
  >
    <!-- Header with Channel Info & External Link -->
    <div
      v-if="title || channel"
      class="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4"
    >
      <div class="flex items-center gap-3">
        <!-- YouTube Red Icon -->
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 text-red-500 ring-1 ring-red-500/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-6 w-6"
          >
            <path
              d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
            />
          </svg>
        </div>
        <div>
          <h4
            v-if="title"
            class="line-clamp-1 text-sm font-bold text-white sm:text-base"
          >
            {{ title }}
          </h4>
          <p class="text-xs text-gray-400">
            Featured video from
            <a
              :href="channelUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="font-semibold text-blue-400 transition-colors hover:text-blue-300"
            >
              {{ channel }}
            </a>
          </p>
        </div>
      </div>

      <!-- Watch on YouTube Button -->
      <a
        :href="`https://www.youtube.com/watch?v=${id}`"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20 hover:text-white"
      >
        <span>Watch on YouTube</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>

    <!-- Responsive 16:9 Video Frame -->
    <div
      class="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-inner"
    >
      <iframe
        :src="`https://www.youtube-nocookie.com/embed/${id}`"
        :title="title || 'YouTube video player'"
        class="absolute inset-0 h-full w-full border-0"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
          web-share;
        "
        allowfullscreen
        loading="lazy"
      ></iframe>
    </div>

    <!-- Optional Caption / Takeaway Note -->
    <div
      v-if="caption || $slots.default"
      class="mt-3.5 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-xs leading-relaxed text-gray-400"
    >
      <slot>
        <p>{{ caption }}</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    id: string;
    title?: string;
    channel?: string;
    channelUrl?: string;
    caption?: string;
  }>(),
  {
    title: "",
    channel: "Let's Talk Dev",
    channelUrl: "https://youtube.com/@letstalkdev",
    caption: "",
  },
);
</script>
