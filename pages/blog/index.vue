<template>
  <main class="relative min-h-screen overflow-hidden pb-16 pt-24">
    <!-- Background Ambient Glow -->
    <div
      class="pointer-events-none absolute left-0 top-0 -z-10 h-[500px] w-[500px] translate-x-[-50%] translate-y-[-20%] rounded-full bg-blue-600 opacity-20 blur-[120px]"
    ></div>
    <div
      class="pointer-events-none absolute right-0 top-40 -z-10 h-[400px] w-[400px] translate-x-[20%] rounded-full bg-purple-600 opacity-10 blur-[100px]"
    ></div>

    <!-- Header Section -->
    <div class="mx-auto mb-12 max-w-7xl px-6">
      <div
        class="flex flex-col justify-between gap-8 border-b border-white/10 pb-12 md:flex-row md:items-end"
      >
        <div class="max-w-2xl">
          <h1
            class="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-7xl"
          >
            <span
              class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              >Insights</span
            >
            & <br />
            Thoughts
          </h1>
          <p class="text-xl leading-relaxed text-gray-400">
            Exploring the frontiers of software architecture, AI agents, and
            modern development practices.
          </p>
        </div>

        <!-- Type Filter Toggles -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- All Insights Pill -->
          <button
            type="button"
            class="rounded-full border px-4 py-2 text-xs font-medium backdrop-blur-sm transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-sm"
            :class="
              isAllTypesActive
                ? 'border-blue-500/50 bg-blue-600/25 text-blue-200 shadow-[0_0_20px_rgba(37,99,235,0.25)] ring-1 ring-blue-500/30'
                : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10 hover:text-white'
            "
            @click="clearTypeFilters"
          >
            All Insights
            <span
              class="ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-bold"
              :class="
                isAllTypesActive
                  ? 'bg-blue-500/30 text-white'
                  : 'bg-white/10 text-gray-400'
              "
            >
              {{ typeCounts.all ?? 0 }}
            </span>
          </button>

          <!-- Individual Type Toggles -->
          <button
            v-for="type in individualTypes"
            :key="type.value"
            type="button"
            class="group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur-sm transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-sm"
            :class="
              isTypeSelected(type.value)
                ? 'border-blue-500/50 bg-blue-600/25 text-blue-200 shadow-[0_0_20px_rgba(37,99,235,0.25)] ring-1 ring-blue-500/30'
                : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10 hover:text-white'
            "
            :title="
              isTypeSelected(type.value)
                ? `Toggle off ${type.label}`
                : `Filter by ${type.label}`
            "
            @click="toggleTypeFilter(type.value)"
          >
            <span
              class="flex h-3.5 w-3.5 items-center justify-center rounded-full border text-[9px] transition-colors"
              :class="
                isTypeSelected(type.value)
                  ? 'border-blue-400 bg-blue-500 text-white'
                  : 'border-white/20 bg-white/5 text-transparent group-hover:border-white/40'
              "
            >
              ✓
            </span>
            <span>{{ type.label }}</span>
            <span
              class="ml-0.5 rounded-full px-1.5 py-0.5 text-xs font-bold"
              :class="
                isTypeSelected(type.value)
                  ? 'bg-blue-500/30 text-white'
                  : 'bg-white/10 text-gray-400'
              "
            >
              {{ typeCounts[type.value] ?? 0 }}
            </span>
          </button>
        </div>
      </div>

      <!-- Search & Topics Bar -->
      <div class="mt-8 space-y-4">
        <!-- Search Input with live match badge & clear button -->
        <div class="relative w-full">
          <div class="relative flex items-center">
            <!-- Search Icon -->
            <div
              class="pointer-events-none absolute left-4 flex items-center text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <!-- Input Element -->
            <input
              v-model="searchInput"
              type="text"
              placeholder="Search by keyword, technology, tag, or title (e.g. docker, agent, architecture)..."
              class="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-28 text-base text-white placeholder-gray-500 backdrop-blur-md transition-all duration-300 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              @keydown.esc="clearSearch"
            />

            <!-- Trailing Controls: Clear button and Results count -->
            <div class="absolute right-4 flex items-center gap-2">
              <button
                v-if="searchInput"
                type="button"
                class="rounded-full p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                title="Clear search"
                @click="clearSearch"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <span
                class="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-xs font-semibold text-gray-400"
              >
                {{ totalItems }} {{ totalItems === 1 ? "match" : "matches" }}
              </span>
            </div>
          </div>
        </div>

        <!-- Topics & Active Filter Details -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div class="flex flex-wrap items-center gap-2 text-xs text-gray-400">
            <span class="font-medium text-gray-400">Filter by Topic:</span>

            <!-- Active Selected Topic Tags (With X to dismiss) -->
            <div
              v-for="topic in selectedTopics"
              :key="`active-${topic}`"
              class="inline-flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-blue-500/25 px-3 py-1 font-semibold text-blue-200 shadow-sm transition-all"
            >
              <span>#{{ topic }}</span>
              <button
                type="button"
                class="rounded-full p-0.5 text-blue-300 transition-colors hover:bg-blue-500/40 hover:text-white"
                :title="`Remove #${topic} filter`"
                @click="toggleTopic(topic)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Suggested popular topic tags (Clicking toggles on/off) -->
            <button
              v-for="topic in popularTopics"
              :key="topic"
              type="button"
              class="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 transition-all"
              :class="
                isTopicSelected(topic)
                  ? 'border-blue-500/40 bg-blue-500/20 text-blue-200 ring-1 ring-blue-500/30'
                  : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/15 hover:bg-white/10 hover:text-white'
              "
              :title="
                isTopicSelected(topic)
                  ? `Toggle off #${topic}`
                  : `Filter by #${topic}`
              "
              @click="toggleTopic(topic)"
            >
              <span
                v-if="isTopicSelected(topic)"
                class="text-[10px] text-blue-300"
                >✓</span
              >
              <span>#{{ topic }}</span>
            </button>
          </div>

          <!-- Reset Filters Shortcut -->
          <button
            v-if="hasActiveFilters"
            type="button"
            class="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 transition-colors hover:text-blue-300 hover:underline"
            @click="resetFilters"
          >
            <span>Reset all filters</span>
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Content Grid & Pagination -->
    <div ref="contentGridRef" class="mx-auto max-w-7xl px-6">
      <!-- Loading Skeleton -->
      <div
        v-if="pending"
        class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="h-[420px] animate-pulse rounded-3xl bg-white/5"
        ></div>
      </div>

      <!-- Articles Grid -->
      <div
        v-else-if="paginatedArticles.length > 0"
        class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        <NuxtLink
          v-for="article in paginatedArticles"
          :key="article.id"
          :to="`/blog/${article.path?.split('/').pop()}`"
          class="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gray-900/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:bg-gray-800/60 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
        >
          <!-- Image -->
          <div class="relative aspect-[16/10] w-full overflow-hidden">
            <div
              class="absolute inset-0 z-10 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"
            ></div>
            <NuxtImg
              v-if="article.cover_image"
              :src="article.cover_image"
              :alt="article.title"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-white/5"
            >
              <span class="text-6xl">
                {{
                  article.type === "book_summary"
                    ? "📚"
                    : article.type === "tech_report"
                      ? "⚡"
                      : "📝"
                }}
              </span>
            </div>

            <!-- Floating Type & Status Badges -->
            <div class="absolute left-4 top-4 z-20 flex items-center gap-2">
              <span
                class="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-md"
              >
                {{ formatType(article.type) }}
              </span>
              <span
                v-if="article.stage"
                class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md"
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :style="{
                    backgroundColor: getRadarStatusMeta(
                      article.decision ?? article.stage,
                    ).color,
                  }"
                />
                {{
                  getRadarStatusMeta(article.decision ?? article.stage).label
                }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="flex flex-1 flex-col p-8">
            <div class="mb-4 flex items-center gap-3 text-sm text-gray-400">
              <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
              {{ formatDate(article.date) }}
              <span v-if="article.author" class="text-xs text-gray-500">
                • by {{ article.author }}
              </span>
            </div>

            <h2
              class="mb-3 text-2xl font-bold leading-tight text-white transition-colors group-hover:text-blue-200"
            >
              {{ article.title }}
            </h2>

            <p
              class="mb-6 line-clamp-2 text-base leading-relaxed text-gray-400"
            >
              {{ article.description }}
            </p>

            <!-- Tags (Clickable for quick topic toggle) -->
            <div
              class="mt-auto flex flex-wrap gap-2 border-t border-white/5 pt-6"
            >
              <button
                v-for="tag in article.tags?.slice(0, 3)"
                :key="tag"
                type="button"
                class="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors"
                :class="
                  isTopicSelected(tag)
                    ? 'bg-blue-500/30 text-blue-200 ring-1 ring-blue-500/40'
                    : 'bg-blue-500/10 text-blue-400/90 hover:bg-blue-500/20 hover:text-blue-300'
                "
                :title="
                  isTopicSelected(tag)
                    ? `Remove #${tag} filter`
                    : `Filter by #${tag}`
                "
                @click.prevent.stop="toggleTopic(tag)"
              >
                <span v-if="isTopicSelected(tag)" class="text-[10px]">✓</span>
                <span>#{{ tag }}</span>
              </button>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-else class="py-24 text-center">
        <div
          class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-3xl"
        >
          🔍
        </div>
        <h3 class="mb-2 text-xl font-bold text-white">No content found</h3>
        <p class="mx-auto max-w-md text-sm text-gray-400">
          We couldn't find any articles matching your search query or active
          filters.
        </p>
        <button
          class="mt-6 rounded-full border border-blue-500/40 bg-blue-600/20 px-6 py-2.5 text-sm font-semibold text-blue-300 transition-colors hover:bg-blue-600/30 hover:text-white"
          @click="resetFilters"
        >
          Clear all filters & search
        </button>
      </div>

      <!-- Pagination Bar -->
      <div
        v-if="totalPages > 1"
        class="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row"
      >
        <!-- Results Counter -->
        <p class="text-sm text-gray-400">
          Showing
          <span class="font-semibold text-white">{{ startIndex + 1 }}</span>
          to
          <span class="font-semibold text-white">{{ endIndex }}</span>
          of
          <span class="font-semibold text-white">{{ totalItems }}</span>
          items
        </p>

        <!-- Pagination Controls -->
        <div class="flex items-center gap-1.5 sm:gap-2">
          <!-- Previous Button -->
          <button
            type="button"
            class="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:px-4"
            :disabled="activePage <= 1"
            @click="goToPage(activePage - 1)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span class="hidden sm:inline">Previous</span>
          </button>

          <!-- Numbered Page Pills -->
          <template v-for="(p, idx) in visiblePages" :key="idx">
            <span
              v-if="p === '...'"
              class="select-none px-2 py-1 text-sm font-medium text-gray-500"
            >
              …
            </span>
            <button
              v-else
              type="button"
              class="min-w-[38px] rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200 sm:min-w-[42px]"
              :class="
                activePage === p
                  ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10 hover:text-white'
              "
              @click="goToPage(p)"
            >
              {{ p }}
            </button>
          </template>

          <!-- Next Button -->
          <button
            type="button"
            class="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:px-4"
            :disabled="activePage >= totalPages"
            @click="goToPage(activePage + 1)"
          >
            <span class="hidden sm:inline">Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import MiniSearch from "minisearch";

const route = useRoute();
const router = useRouter();

// Unified Content Item Type
type ContentItem = {
  id: string;
  title?: string;
  description?: string;
  path?: string;
  cover_image?: string;
  type: "blog_post" | "book_summary" | "tech_report";
  date?: string;
  tags?: string[];
  tagsString?: string;
  stage?: string;
  decision?: string;
  author?: string;
  rating?: number;
};

const individualTypes = [
  { label: "Articles", value: "blog_post" },
  { label: "Book Notes", value: "book_summary" },
  { label: "Tech Reports", value: "tech_report" },
];

// Data Fetching:
// Loads all content collections once into a static, pre-renderable payload.
// This allows 100% of filtering, keyword search, and pagination to run in client memory
// with zero round-trip latency, full offline resilience, and zero database dependencies
// on Cloudflare Workers edge runtime.
const { data: allArticles, pending } = await useAsyncData(
  "blog-all-content",
  async () => {
    const [blogPosts, bookSummaries, techReports] = await Promise.all([
      queryCollection("blog").all(),
      queryCollection("books").all(),
      queryCollection("radar").all(),
    ]);

    const formattedBlog: ContentItem[] = (blogPosts || []).map((item) => ({
      id: item.path || `/blog/${item.stem}`,
      title: item.title,
      description: item.description,
      path: item.path,
      cover_image: item.cover_image,
      type: "blog_post",
      date: item.date,
      tags: item.tags || [],
      tagsString: (item.tags || []).join(" "),
    }));

    const formattedBooks: ContentItem[] = (bookSummaries || []).map((item) => ({
      id: item.path || `/books/${item.stem}`,
      title: item.title,
      description: item.description,
      path: item.path,
      cover_image: item.cover_image,
      type: "book_summary",
      date: item.date,
      tags: item.tags || [],
      tagsString: (item.tags || []).join(" "),
      author: (item as unknown as Record<string, unknown>).author as
        string | undefined,
      rating: (item as unknown as Record<string, unknown>).rating as
        number | undefined,
    }));

    const formattedRadar: ContentItem[] = (techReports || []).map((item) => ({
      id: item.path || `/radar/${item.stem}`,
      title: item.title,
      description: item.description,
      path: item.path,
      cover_image: item.cover_image,
      type: "tech_report",
      date: item.date,
      tags: item.tags || [],
      tagsString: (item.tags || []).join(" "),
      stage: (item as unknown as Record<string, unknown>).stage as
        string | undefined,
      decision: (item as unknown as Record<string, unknown>).decision as
        string | undefined,
    }));

    return [...formattedBlog, ...formattedBooks, ...formattedRadar];
  },
);

// MiniSearch Search Engine Instance
const miniSearch = shallowRef<MiniSearch<ContentItem> | null>(null);

watch(
  () => allArticles.value,
  (articles) => {
    if (!articles || articles.length === 0) return;
    const ms = new MiniSearch<ContentItem>({
      fields: ["title", "description", "tagsString", "author"],
      storeFields: ["id"],
      searchOptions: {
        boost: { title: 3, tagsString: 2.5, author: 2, description: 1 },
        prefix: true,
        fuzzy: 0.2,
      },
    });
    ms.addAll(articles);
    miniSearch.value = ms;
  },
  { immediate: true },
);

// Reactive search input state initialized from URL query (?q=...)
const searchInput = ref<string>((route.query.q as string) || "");

// Debounce syncing search input to URL query
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
watch(searchInput, (newVal) => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    const query = { ...route.query };
    const trimmed = newVal.trim();
    if (trimmed) {
      query.q = trimmed;
    } else {
      delete query.q;
    }
    // Reset page to 1 whenever search query changes
    delete query.page;
    router.replace({ query });
  }, 250);
});

// Watch URL query ?q= to handle browser Back/Forward navigation
watch(
  () => route.query.q,
  (newQ) => {
    const val = (newQ as string) || "";
    if (val !== searchInput.value) {
      searchInput.value = val;
    }
  },
);

// URL Filter States (Multi-select toggles)
const selectedTypes = computed<string[]>(() => {
  const raw = route.query.type || route.query.types;
  if (!raw) return [];
  const list = Array.isArray(raw)
    ? raw.flatMap((r) => (r ? String(r).split(",") : []))
    : String(raw).split(",");
  return list
    .map((s) => s.trim())
    .filter(
      (s) => s && s !== "all" && individualTypes.some((t) => t.value === s),
    );
});

const isTypeSelected = (typeVal: string) => {
  return selectedTypes.value.includes(typeVal);
};

const isAllTypesActive = computed(() => {
  return (
    selectedTypes.value.length === 0 ||
    selectedTypes.value.length === individualTypes.length
  );
});

const selectedTopics = computed<string[]>(() => {
  const raw =
    route.query.topic ||
    route.query.topics ||
    route.query.tag ||
    route.query.tags;
  if (!raw) return [];
  const list = Array.isArray(raw)
    ? raw.flatMap((r) => (r ? String(r).split(",") : []))
    : String(raw).split(",");
  return Array.from(
    new Set(list.map((s) => s.trim().toLowerCase()).filter(Boolean)),
  );
});

const isTopicSelected = (topicVal: string) => {
  return selectedTopics.value.includes(topicVal.toLowerCase().trim());
};

const currentPageParam = computed(() => {
  const p = parseInt(route.query.page as string, 10);
  return isNaN(p) || p < 1 ? 1 : p;
});

// Category Counts
const typeCounts = computed(() => {
  const counts: Record<string, number> = {
    all: (allArticles.value || []).length,
    blog_post: 0,
    book_summary: 0,
    tech_report: 0,
  };
  for (const item of allArticles.value || []) {
    const current = counts[item.type];
    if (typeof current === "number") {
      counts[item.type] = current + 1;
    }
  }
  return counts;
});

// Top Popular Topics (Tags)
const popularTopics = computed(() => {
  const freq: Record<string, number> = {};
  for (const item of allArticles.value || []) {
    for (const tag of item.tags || []) {
      const clean = tag.toLowerCase().trim();
      if (clean) {
        freq[clean] = (freq[clean] || 0) + 1;
      }
    }
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);
});

const hasActiveFilters = computed(
  () =>
    !isAllTypesActive.value ||
    selectedTopics.value.length > 0 ||
    Boolean(searchInput.value.trim()),
);

// Toggle a content type on/off
const toggleTypeFilter = (typeVal: string) => {
  const query = { ...route.query };
  const current = [...selectedTypes.value];
  const idx = current.indexOf(typeVal);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else {
    current.push(typeVal);
  }

  // If none or all selected, clear query param for clean URLs
  if (current.length === 0 || current.length === individualTypes.length) {
    delete query.type;
    delete query.types;
  } else {
    query.type = current.join(",");
    delete query.types;
  }
  delete query.page;
  router.push({ query });
};

// Clear type filters (Select all)
const clearTypeFilters = () => {
  const query = { ...route.query };
  delete query.type;
  delete query.types;
  delete query.page;
  router.push({ query });
};

// Toggle a topic tag on/off
const toggleTopic = (topic: string) => {
  const query = { ...route.query };
  const clean = topic.trim().toLowerCase();
  if (!clean) return;

  const current = [...selectedTopics.value];
  const idx = current.indexOf(clean);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else {
    current.push(clean);
  }

  if (current.length === 0) {
    delete query.topic;
    delete query.topics;
    delete query.tag;
    delete query.tags;
  } else {
    query.topic = current.join(",");
    delete query.topics;
    delete query.tag;
    delete query.tags;
  }
  delete query.page;
  router.push({ query });
};

const clearSearch = () => {
  searchInput.value = "";
  const query = { ...route.query };
  delete query.q;
  delete query.page;
  router.replace({ query });
};

const resetFilters = () => {
  searchInput.value = "";
  router.push({ query: {} });
};

// Filtered & Ranked Articles
const filteredArticles = computed(() => {
  const items = allArticles.value || [];
  let result = [...items];

  // 1. Filter by content types (multi-select toggle)
  if (!isAllTypesActive.value) {
    result = result.filter((item) => selectedTypes.value.includes(item.type));
  }

  // 2. Filter by topics / tags (multi-select toggle: matches any of selected topics)
  if (selectedTopics.value.length > 0) {
    result = result.filter((item) =>
      item.tags?.some((t) =>
        selectedTopics.value.includes(t.toLowerCase().trim()),
      ),
    );
  }

  // 3. MiniSearch Keyword Ranking
  const q = searchInput.value.trim();
  if (q && miniSearch.value) {
    const cleanQ = q.startsWith("#") ? q.slice(1) : q;
    if (cleanQ) {
      const searchResults = miniSearch.value.search(cleanQ, {
        prefix: true,
        fuzzy: 0.2,
        boost: { title: 3, tagsString: 2.5, author: 2, description: 1 },
      });
      const scoreMap = new Map(searchResults.map((r) => [r.id, r.score]));
      result = result
        .filter((item) => scoreMap.has(item.id))
        .sort((a, b) => (scoreMap.get(b.id) || 0) - (scoreMap.get(a.id) || 0));
      return result;
    }
  }

  // 4. Default Sort: Latest date first
  result.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  return result;
});

// Pagination Configuration
const itemsPerPage = 9;

const totalItems = computed(() => filteredArticles.value.length);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalItems.value / itemsPerPage)),
);

const activePage = computed(() =>
  Math.min(Math.max(1, currentPageParam.value), totalPages.value),
);

const paginatedArticles = computed(() => {
  const start = (activePage.value - 1) * itemsPerPage;
  return filteredArticles.value.slice(start, start + itemsPerPage);
});

const startIndex = computed(() => (activePage.value - 1) * itemsPerPage);
const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage, totalItems.value),
);

const visiblePages = computed<(number | "...")[]>(() => {
  const total = totalPages.value;
  const current = activePage.value;
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
});

const contentGridRef = ref<HTMLElement | null>(null);

const goToPage = (page: number | string) => {
  if (typeof page !== "number") return;
  if (page < 1 || page > totalPages.value || page === activePage.value) return;

  const query = { ...route.query };
  if (page === 1) {
    delete query.page;
  } else {
    query.page = String(page);
  }
  router.push({ query });

  nextTick(() => {
    if (contentGridRef.value) {
      const yOffset = -90;
      const y =
        contentGridRef.value.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  });
};

// Formatting Helpers
const formatType = (type?: string) => {
  if (type === "book_summary") return "Book Summary";
  if (type === "tech_report") return "Tech Report";
  return "Blog Post";
};

const formatDate = (date?: string) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

useSeoMeta({
  title: computed(() => {
    if (searchInput.value.trim()) {
      return `Search: ${searchInput.value.trim()} - Blog - Mihai Farcas`;
    }
    if (selectedTopics.value.length > 0) {
      const topicTags = selectedTopics.value.map((t) => `#${t}`).join(", ");
      return `${topicTags} Articles - Blog - Mihai Farcas`;
    }
    if (!isAllTypesActive.value) {
      const typeLabels = selectedTypes.value
        .map((t) => individualTypes.find((it) => it.value === t)?.label || t)
        .join(" & ");
      return `${typeLabels} - Blog - Mihai Farcas`;
    }
    return "Blog - Mihai Farcas";
  }),
  description:
    "Thoughts on software architecture, Agentic AI, and development. Book summaries and technical deep dives.",
});
</script>
