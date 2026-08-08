<template>
  <main class="relative min-h-screen overflow-hidden pb-12 pt-24">
    <!-- Background Elements -->
    <div
      class="pointer-events-none absolute left-0 top-0 -z-10 h-[500px] w-[500px] translate-x-[-50%] translate-y-[-20%] rounded-full bg-blue-600 opacity-20 blur-[120px]"
    ></div>
    <div
      class="pointer-events-none absolute right-0 top-40 -z-10 h-[400px] w-[400px] translate-x-[20%] rounded-full bg-purple-600 opacity-10 blur-[100px]"
    ></div>

    <!-- Header / Filter Section -->
    <div class="mx-auto mb-16 max-w-7xl px-6">
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

        <!-- Type Filter -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="type in contentTypes"
            :key="type.value"
            class="rounded-full border px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition-all duration-300"
            :class="
              selectedType === type.value
                ? 'border-blue-500/50 bg-blue-600/20 text-blue-300 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10 hover:text-white'
            "
            @click="setTypeFilter(type.value)"
          >
            {{ type.label }}
          </button>
        </div>
      </div>

      <!-- Active Topic Filter Display -->
      <div
        v-if="selectedTopic"
        class="mt-6 inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2"
      >
        <span class="text-sm font-medium text-blue-300">Topic:</span>
        <span class="flex items-center gap-2 font-bold text-white">
          #{{ selectedTopic }}
          <button
            class="rounded-full p-0.5 text-blue-300 transition-colors hover:bg-blue-500/20"
            title="Clear filter"
            @click="clearTopic"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="h-4 w-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </span>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="mx-auto max-w-7xl px-6">
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

      <div
        v-else-if="articles && articles.length > 0"
        class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        <NuxtLink
          v-for="article in articles"
          :key="article.path"
          :to="`/blog/${article.path?.split('/').pop()}`"
          class="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gray-900/40 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/30 hover:bg-gray-800/60 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
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
              <span class="text-6xl">📝</span>
            </div>

            <!-- Floating Type Badge -->
            <div class="absolute left-4 top-4 z-20 flex items-center gap-2">
              <span
                class="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-md"
              >
                {{ formatType(article.type) }}
              </span>
              <span
                v-if="article.stage"
                class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md"
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :style="{
                    backgroundColor: getRadarStatusMeta(article.decision ?? article.stage).color,
                  }"
                />
                {{ getRadarStatusMeta(article.decision ?? article.stage).label }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="flex flex-1 flex-col p-8">
            <div class="mb-4 flex items-center gap-3 text-sm text-gray-400">
              <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
              {{ formatDate(article.date) }}
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

            <!-- Tags -->
            <div
              class="mt-auto flex flex-wrap gap-2 border-t border-white/5 pt-6"
            >
              <span
                v-for="tag in article.tags?.slice(0, 3)"
                :key="tag"
                class="rounded bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400/80"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="py-24 text-center">
        <p class="text-xl text-gray-400">
          No content found matching your criteria.
        </p>
        <button
          class="mt-4 text-blue-400 hover:text-blue-300 hover:underline"
          @click="resetFilters"
        >
          Clear all filters
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

// Filter States
type ContentItem = {
  date?: string;
  tags?: string[];
  stage?: string;
  decision?: string;
  [key: string]: unknown;
};

const contentTypes = [
  { label: "All", value: "all" },
  { label: "Blog Posts", value: "blog_post" },
  { label: "Book Summaries", value: "book_summary" },
  { label: "Tech Reports", value: "tech_report" },
];

const selectedType = ref("all");
const selectedTopic = computed(() => route.query.topic as string | undefined);

// Handle Type Filter Click
const setTypeFilter = (type: string) => {
  selectedType.value = type;
};

const clearTopic = () => {
  const query = { ...route.query };
  delete query.topic;
  router.push({ query });
};

const resetFilters = () => {
  selectedType.value = "all";
  clearTopic();
};

// Data Fetching
const { data: articles, pending } = await useAsyncData(
  "articles",
  async () => {
    let blogPosts: ContentItem[] = [];
    let bookSummaries: ContentItem[] = [];
    let techReports: ContentItem[] = [];

    if (selectedType.value === "all" || selectedType.value === "blog_post") {
      blogPosts = (await queryCollection("blog").all()) as ContentItem[];
    }
    if (selectedType.value === "all" || selectedType.value === "book_summary") {
      bookSummaries = (await queryCollection("books").all()) as ContentItem[];
    }
    if (selectedType.value === "all" || selectedType.value === "tech_report") {
      techReports = (await queryCollection("radar").all()) as ContentItem[];
    }

    let allContent = [...blogPosts, ...bookSummaries, ...techReports];

    // Filter by topic
    if (selectedTopic.value) {
      allContent = allContent.filter((article) =>
        article.tags?.includes(selectedTopic.value),
      );
    }

    // Sort by date
    allContent.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    return allContent;
  },
  {
    watch: [selectedType, selectedTopic],
  },
);

// Helpers
const formatType = (type: string) => {
  if (type === "book_summary") return "Book Summary";
  if (type === "tech_report") return "Tech Report";
  return "Blog Post";
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

useSeoMeta({
  title: "Blog - Mihai Farcas",
  description:
    "Thoughts on software architecture, Agentic AI, and development. Book summaries and technical deep dives.",
});
</script>
