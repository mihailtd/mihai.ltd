<template>
  <NuxtLayout>
    <main class="mx-auto max-w-xl px-6 py-36 text-center">
      <p class="mb-4 text-5xl" aria-hidden="true">
        {{ is404 ? "📄" : "⚠️" }}
      </p>
      <h1 class="text-3xl font-extrabold text-white">
        {{ is404 ? "Page not found" : "Something went wrong" }}
      </h1>
      <p class="mt-3 text-sm text-gray-400">
        {{
          is404
            ? "The page, article, book note or tech report you requested does not exist or has moved."
            : "An unexpected error occurred while loading this page."
        }}
      </p>
      <nav
        aria-label="Helpful links"
        class="mt-8 flex flex-wrap items-center justify-center gap-4"
      >
        <NuxtLink
          to="/"
          class="rounded-full bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500"
          @click="clearError()"
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/radar"
          class="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white"
          @click="clearError()"
        >
          Explore Tech Radar
        </NuxtLink>
        <NuxtLink
          to="/blog"
          class="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white"
          @click="clearError()"
        >
          View Blog
        </NuxtLink>
      </nav>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();
const is404 = computed(() => props.error?.statusCode === 404);

useSeoMeta({
  title: () =>
    is404.value ? "Page not found | Mihai Farcas" : "Error | Mihai Farcas",
  robots: "noindex, follow",
});
</script>
