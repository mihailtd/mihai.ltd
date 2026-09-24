<template>
  <div
    class="relative my-8 overflow-hidden rounded-3xl border transition-all duration-300"
    :class="[
      featured
        ? 'border-blue-500/40 bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-purple-950/40 shadow-2xl shadow-blue-900/20 ring-1 ring-blue-500/30'
        : 'border-white/10 bg-slate-950/70 backdrop-blur-xl hover:border-white/20',
      compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8',
    ]"
  >
    <!-- Ambient Glow Accent Orbs -->
    <div
      class="pointer-events-none absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl"
    ></div>
    <div
      class="pointer-events-none absolute -bottom-20 -left-20 -z-10 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl"
    ></div>

    <!-- Header Row: Badges & Partner Label -->
    <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Partner / Perk Badge -->
        <span
          class="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300"
        >
          <span
            class="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400"
          ></span>
          {{ badge || "Partner Perk" }}
        </span>

        <!-- Special Perk Highlight -->
        <span
          v-if="perk"
          class="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-300 shadow-sm"
        >
          <span>🎁</span>
          {{ perk }}
        </span>
      </div>

      <!-- Small sponsored transparency indicator -->
      <span
        class="text-[11px] font-medium uppercase tracking-wider text-gray-400"
      >
        Recommended Partner
      </span>
    </div>

    <!-- Main Content Area -->
    <div
      class="grid items-center gap-6"
      :class="bannerImage && !compact ? 'lg:grid-cols-12' : 'grid-cols-1'"
    >
      <!-- Left Column: Tool Details -->
      <div :class="bannerImage && !compact ? 'lg:col-span-7' : 'w-full'">
        <div class="flex items-start gap-4">
          <!-- Logo / Icon -->
          <div
            class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 shadow-inner"
          >
            <img
              v-if="logo"
              :src="logo"
              :alt="`${name} logo`"
              class="h-full w-full object-contain"
              loading="lazy"
            />
            <span v-else class="text-2xl">⚡</span>
          </div>

          <!-- Tool Title & Subtitle -->
          <div class="flex-1">
            <div class="flex items-baseline gap-2">
              <h3
                class="text-2xl font-bold tracking-tight text-white sm:text-3xl"
              >
                {{ name }}
              </h3>
              <span
                v-if="rating"
                class="inline-flex items-center text-xs font-semibold text-yellow-300"
              >
                ★ {{ rating }}
              </span>
            </div>
            <p v-if="tagline" class="mt-1 text-sm font-medium text-blue-300">
              {{ tagline }}
            </p>
          </div>
        </div>

        <!-- Description / Personal Verdict -->
        <div class="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base">
          <slot>
            <p>{{ description }}</p>
          </slot>
        </div>

        <!-- Feature Bullets (if provided) -->
        <ul
          v-if="parsedFeatures.length > 0"
          class="mt-4 grid grid-cols-1 gap-2 text-xs text-gray-300 sm:grid-cols-2"
        >
          <li
            v-for="(feature, idx) in parsedFeatures"
            :key="idx"
            class="flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 shrink-0 text-emerald-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ feature }}</span>
          </li>
        </ul>

        <!-- Action Row -->
        <div class="mt-6 flex flex-wrap items-center gap-3">
          <a
            :href="href"
            target="_blank"
            rel="sponsored noopener noreferrer"
            class="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/50 active:scale-[0.98]"
          >
            <span>{{ ctaText || "Explore " + name }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 transition-transform group-hover:translate-x-0.5"
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

          <a
            v-if="secondaryHref"
            :href="secondaryHref"
            class="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-gray-300 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <span>{{ secondaryText || "Learn More" }}</span>
          </a>
        </div>
      </div>

      <!-- Right Column: Visual Mockup / Banner (Desktop & Full view) -->
      <div
        v-if="bannerImage && !compact"
        class="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl lg:col-span-5"
      >
        <div class="aspect-[16/10] w-full overflow-hidden">
          <img
            :src="bannerImage"
            :alt="`${name} preview`"
            class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
          />
        </div>
        <div
          v-if="bannerCaption"
          class="border-t border-white/5 bg-black/40 px-3 py-2 text-center text-xs text-gray-400"
        >
          {{ bannerCaption }}
        </div>
      </div>
    </div>

    <!-- FTC / Affiliate Transparency Disclosure Footer -->
    <div class="mt-6 border-t border-white/5 pt-3">
      <p class="text-[11px] leading-relaxed text-gray-400">
        <span class="font-medium text-gray-300">Disclosure:</span>
        {{
          disclosure ||
          "If you sign up using this link, I may receive an affiliate commission at no extra cost to you. I only partner with platforms I actively evaluate or use in professional production."
        }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    name: string;
    tagline?: string;
    description?: string;
    badge?: string;
    perk?: string;
    href: string;
    ctaText?: string;
    secondaryHref?: string;
    secondaryText?: string;
    logo?: string;
    bannerImage?: string;
    bannerCaption?: string;
    rating?: string | number;
    features?: string[] | string;
    disclosure?: string;
    featured?: boolean;
    compact?: boolean;
  }>(),
  {
    tagline: "",
    description: "",
    badge: "Partner Perk",
    perk: "",
    ctaText: "Start Free Trial",
    secondaryHref: "",
    secondaryText: "",
    logo: "",
    bannerImage: "",
    bannerCaption: "",
    rating: "",
    features: () => [],
    disclosure: "",
    featured: false,
    compact: false,
  },
);

const parsedFeatures = computed<string[]>(() => {
  if (!props.features) return [];
  if (Array.isArray(props.features)) return props.features;
  if (typeof props.features === "string") {
    const trimmed = (props.features as string).trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        return JSON.parse(trimmed);
      } catch {
        // Fallback to comma separation
      }
    }
    return trimmed
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
});
</script>
