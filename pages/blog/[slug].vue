<template>
  <main class="relative min-h-screen pb-24">
    <!-- Background Gradient -->
    <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        class="absolute left-1/2 top-0 h-[600px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-blue-900/10 blur-[120px]"
      ></div>
    </div>

    <article v-if="article">
      <!-- Hero Section -->
      <header
        class="relative border-b border-white/5 bg-gradient-to-b from-transparent to-black/20 px-6 pb-16 pt-32"
      >
        <div class="mx-auto max-w-4xl text-center">
          <!-- Back Button -->
          <div class="mb-8 flex justify-center">
            <NuxtLink
              :to="backLink.to"
              class="group flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:border-white/10 hover:bg-white/5 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {{ backLink.label }}
            </NuxtLink>
          </div>

          <!-- Meta info -->
          <div
            class="mb-6 flex flex-wrap items-center justify-center gap-4 text-sm"
          >
            <span
              class="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-blue-300"
            >
              {{ formatType(article.type) }}
            </span>
            <span
              v-if="publishedDate"
              class="flex items-center gap-2 text-gray-400"
            >
              <span class="h-1 w-1 rounded-full bg-gray-500"></span>
              Published
              <time :datetime="publishedDate">{{
                formatDate(publishedDate)
              }}</time>
            </span>
            <span
              v-if="modifiedDate && modifiedDate !== publishedDate"
              class="flex items-center gap-2 text-gray-400"
            >
              <span class="h-1 w-1 rounded-full bg-gray-500"></span>
              Updated
              <time :datetime="modifiedDate">{{
                formatDate(modifiedDate)
              }}</time>
            </span>
          </div>

          <h1
            class="mb-8 text-balance text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            {{ displayHeadline }}
          </h1>

          <p
            class="mx-auto max-w-2xl text-balance text-xl font-light leading-relaxed text-gray-300"
          >
            {{ article.description }}
          </p>

          <!-- Author byline: ties every article to one named, linkable author -->
          <div class="mt-10 flex items-center justify-center gap-3">
            <img
              src="/mihai_farcas.webp"
              alt="Mihai Farcas"
              width="44"
              height="44"
              class="h-11 w-11 rounded-full border border-white/10 object-cover object-[center_20%]"
            />
            <div class="text-left text-sm">
              <p class="text-gray-300">
                By
                <NuxtLink
                  to="/#about"
                  rel="author"
                  class="font-semibold text-white hover:text-blue-300"
                  >Mihai Farcas</NuxtLink
                >
              </p>
              <p class="text-xs text-gray-500">{{ PERSON_HEADLINE }}</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <div class="relative z-10 mx-auto -mt-12 max-w-4xl px-6">
        <!-- Radar Snapshot (tech_report entries only) -->
        <aside
          v-if="article.stage"
          aria-labelledby="radar-snapshot-heading"
          class="mb-16 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
        >
          <div class="mb-4 flex items-center justify-between">
            <h2
              id="radar-snapshot-heading"
              class="text-sm font-semibold uppercase tracking-wider text-gray-400"
            >
              Radar Snapshot
            </h2>
            <div class="flex items-center gap-2">
              <span
                class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset"
                :class="[
                  getRadarStatusMeta(article.decision ?? article.stage).bg,
                  getRadarStatusMeta(article.decision ?? article.stage).text,
                  getRadarStatusMeta(article.decision ?? article.stage).ring,
                ]"
              >
                {{
                  getRadarStatusMeta(article.decision ?? article.stage).label
                }}
              </span>
              <span
                v-if="article.decision && article.decidedDate"
                class="text-xs text-gray-500"
              >
                {{ formatDate(article.decidedDate) }}
              </span>
            </div>
          </div>

          <div class="space-y-3 text-sm">
            <div class="flex items-center justify-between gap-4">
              <span class="text-gray-400"
                >Progress ({{ getRadarStatusMeta(article.stage).label }})</span
              >
              <div class="flex items-center gap-2">
                <div class="flex w-24 items-center gap-1">
                  <span
                    v-for="i in 4"
                    :key="i"
                    class="h-1.5 flex-1 rounded-full"
                    :class="
                      i > (article.evaluatedScore || 0) ? 'bg-white/10' : ''
                    "
                    :style="
                      i <= (article.evaluatedScore || 0)
                        ? {
                            backgroundColor: getRadarStatusMeta(
                              article.decision ?? article.stage,
                            ).color,
                          }
                        : {}
                    "
                  />
                </div>
                <span class="font-medium text-white"
                  >{{ article.evaluatedScore || 0 }}/4</span
                >
              </div>
            </div>

            <div
              v-if="article.satisfaction != null"
              class="flex items-center justify-between gap-4"
            >
              <span class="text-gray-400">Satisfaction</span>
              <div class="flex items-center gap-2">
                <span class="tracking-wider">
                  <span class="text-amber-400">{{
                    "★".repeat(article.satisfaction)
                  }}</span>
                  <span class="text-slate-600">{{
                    "☆".repeat(5 - article.satisfaction)
                  }}</span>
                </span>
                <span class="font-medium text-white"
                  >{{ article.satisfaction }}/5</span
                >
              </div>
            </div>

            <div
              v-if="favorOfTarget"
              class="flex items-center justify-between gap-4"
            >
              <span class="text-gray-400">In favor of</span>
              <NuxtLink
                :to="`/blog/${favorOfTarget.path?.split('/').pop()}`"
                class="font-medium text-blue-400 hover:text-blue-300"
              >
                {{ favorOfTarget.title }} →
              </NuxtLink>
            </div>

            <div
              v-if="article.decision === 'hold' && article.reviewTrigger"
              class="flex items-start justify-between gap-4"
            >
              <span class="shrink-0 text-gray-400">Revisit when</span>
              <span class="text-right font-medium text-white">{{
                article.reviewTrigger
              }}</span>
            </div>

            <p
              v-if="article.decisionReason"
              class="border-t border-white/10 pt-3 text-xs italic leading-relaxed text-gray-400"
            >
              &ldquo;{{ article.decisionReason }}&rdquo;
            </p>
          </div>
        </aside>

        <!-- Cover Image -->
        <div
          v-if="article.cover_image"
          class="mb-16 overflow-hidden rounded-3xl border border-white/10 bg-gray-800 shadow-2xl ring-1 ring-white/5"
        >
          <NuxtImg
            :src="article.cover_image"
            :alt="`${article.title} cover image`"
            class="h-auto w-full object-cover"
            loading="eager"
          />
        </div>

        <!-- Content -->
        <div
          class="prose prose-lg prose-invert mx-auto max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-p:leading-relaxed prose-p:text-gray-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 hover:prose-a:underline prose-blockquote:rounded-r-lg prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-900/10 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:not-italic prose-blockquote:text-blue-200 prose-code:rounded prose-code:bg-blue-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-blue-300 prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-gray-900/50 prose-li:text-gray-300 prose-li:marker:text-blue-500 prose-img:rounded-xl prose-img:border prose-img:border-white/10 prose-img:shadow-lg"
        >
          <ContentRenderer :value="article">
            <template #empty>
              <p>No content found.</p>
            </template>
          </ContentRenderer>
        </div>

        <!-- Tags Footer -->
        <footer class="mt-20 border-t border-white/10 pt-10">
          <div
            class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"
          >
            <h2
              class="text-sm font-semibold uppercase tracking-wider text-gray-400"
            >
              Related Topics
            </h2>
            <div class="flex flex-wrap gap-2">
              <NuxtLink
                v-for="tag in article.tags"
                :key="tag"
                :to="`/blog?topic=${tag}`"
                class="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-gray-300 transition-all hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-300"
              >
                #{{ tag }}
              </NuxtLink>
            </div>
          </div>
        </footer>
      </div>
    </article>
  </main>
</template>

<script setup lang="ts">
const route = useRoute();

// Get the current path without the trailing slash if present
// Path construction handled inside useAsyncData based on collection

// The blog/books collections don't declare these — only radar (tech_report)
// entries have them. Intersecting (rather than replacing the real collection
// type) keeps `article` fully compatible with ContentRenderer below, while
// letting the template read the radar-specific fields on any branch.
type RadarFields = {
  author?: string;
  isbn?: string;
  stage?: string;
  decision?: string;
  decisionReason?: string;
  decisionInFavorOf?: string;
  reviewTrigger?: string;
  decidedDate?: string;
  evaluatedScore?: number;
  satisfaction?: number;
};

const { data: article } = await useAsyncData(
  `blog-${route.params.slug}`,
  async () => {
    const slug = route.params.slug;
    try {
      const blogPost = await queryCollection("blog")
        .path(`/blog/${slug}`)
        .first();
      if (blogPost) return blogPost as typeof blogPost & RadarFields;
    } catch {
      // Ignore error if not found in blog
    }

    try {
      const bookSummary = await queryCollection("books")
        .path(`/books/${slug}`)
        .first();
      if (bookSummary) return bookSummary as typeof bookSummary & RadarFields;
    } catch {
      // Ignore error if not found in books
    }

    try {
      const techReport = await queryCollection("radar")
        .path(`/radar/${slug}`)
        .first();
      if (techReport) return techReport as typeof techReport & RadarFields;
    } catch {
      // Ignore error if not found in radar
    }

    return null;
  },
);

// Unknown slugs must return a real 404 status, not a 200 "not found" page.
if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Article not found",
    fatal: true,
  });
}

// Radar snapshot panel — only relevant for tech_report entries. Resolves the
// "rejected/on hold in favor of" link by looking up that item's own report.
const { data: favorOfTarget } = await useAsyncData(
  `blog-${route.params.slug}-favor-of`,
  async () => {
    const targetSlug = article.value?.decisionInFavorOf;
    if (!targetSlug) return null;
    try {
      return await queryCollection("radar")
        .path(`/radar/${targetSlug}`)
        .first();
    } catch {
      return null;
    }
  },
  { watch: [article] },
);

const formatType = (type?: string) => {
  if (type === "book_summary") return "Book Summary";
  if (type === "tech_report") return "Tech Report";
  return "Blog Post";
};

const backLink = computed(() => {
  if (article.value?.type === "tech_report") {
    return { to: "/radar", label: "Back to Tech Radar" };
  }
  if (article.value?.type === "book_summary") {
    return { to: "/blog?type=book_summary", label: "Back to Book Summaries" };
  }
  return { to: "/blog", label: "Back to Blog" };
});

const formatDate = (date?: string) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const slug = String(route.params.slug);
const pageUrl = `${SITE_URL}/blog/${slug}`;

const displayHeadline = computed(
  () => article.value?.headline || article.value?.title || "",
);
const publishedDate = computed(() => article.value?.date || undefined);
const modifiedDate = computed(
  () => article.value?.updated || article.value?.date || undefined,
);

const radarVerdict = computed(() => {
  const a = article.value;
  if (!a?.stage) return "";
  const favor = favorOfTarget.value?.title;
  switch (a.decision) {
    case "adopt":
      return favor ? `Adopted over ${favor}` : "Adopted";
    case "hold":
      return favor ? `On Hold in Favor of ${favor}` : "On Hold";
    case "reject":
      return favor ? `Rejected in Favor of ${favor}` : "Rejected";
    default:
      return a.stage === "trial" ? "In Trial" : "Under Assessment";
  }
});

// Descriptive <title>s: the short `title` ("n8n", "AWS") is fine for cards
// and the radar, but on its own it tells a search engine nothing.
const pageTitle = computed(() => {
  const a = article.value;
  if (!a) return "Article";
  if (a.seoTitle) return a.seoTitle;
  if (a.type === "tech_report") {
    return `${a.title} Review: ${radarVerdict.value} | Mihai Farcas Tech Radar`;
  }
  if (a.type === "book_summary") {
    return a.author
      ? `${a.title} by ${a.author} — Book Notes | Mihai Farcas`
      : `${a.title} — Book Notes | Mihai Farcas`;
  }
  return `${a.title} | Mihai Farcas`;
});

const ogImage = computed(
  () => absoluteUrl(article.value?.cover_image) || DEFAULT_OG_IMAGE,
);

useSeoMeta({
  title: pageTitle,
  description: () => article.value?.description || undefined,
  ogTitle: pageTitle,
  ogDescription: () => article.value?.description || undefined,
  ogType: "article",
  ogImage,
  twitterImage: ogImage,
  twitterTitle: pageTitle,
  twitterDescription: () => article.value?.description || undefined,
  articlePublishedTime: publishedDate,
  articleModifiedTime: modifiedDate,
  articleAuthor: [`${SITE_URL}/`],
  articleTag: () => article.value?.tags ?? [],
});

const section = computed(() => {
  if (article.value?.type === "tech_report")
    return { name: "Tech Radar", path: "/radar" };
  if (article.value?.type === "book_summary")
    return { name: "Book Notes", path: "/blog?type=book_summary" };
  return { name: "Blog", path: "/blog" };
});

useJsonLd("article", () => {
  const a = article.value;
  if (!a) return [];
  const about =
    a.type === "tech_report"
      ? { "@type": "Thing", name: a.title }
      : a.type === "book_summary"
        ? {
            "@type": "Book",
            name: a.title,
            author: a.author
              ? { "@type": "Person", name: a.author }
              : undefined,
            isbn: a.isbn || undefined,
          }
        : undefined;
  const videos = (a.videos ?? []).map((v) => ({
    "@type": "VideoObject",
    "@id": `https://www.youtube.com/watch?v=${v.id}`,
    name: v.title,
    description: v.description,
    thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
    uploadDate: v.uploadDate,
    embedUrl: `https://www.youtube.com/embed/${v.id}`,
    contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
    creator: { "@id": PERSON_ID },
  }));
  return [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: pageTitle.value,
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      primaryImageOfPage: { "@type": "ImageObject", url: ogImage.value },
      datePublished: publishedDate.value,
      dateModified: modifiedDate.value,
      inLanguage: "en",
    },
    {
      "@type": a.type === "tech_report" ? "TechArticle" : "BlogPosting",
      "@id": `${pageUrl}#article`,
      headline: displayHeadline.value.slice(0, 110),
      name: a.title,
      description: a.description || undefined,
      url: pageUrl,
      mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
      datePublished: publishedDate.value,
      dateModified: modifiedDate.value,
      author: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
      image: ogImage.value,
      keywords: (a.tags ?? []).join(", "),
      articleSection: section.value.name,
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
      about,
      video: videos.length ? videos : undefined,
    },
    breadcrumbNode(
      [
        { name: "Home", path: "/" },
        section.value,
        { name: a.title, path: `/blog/${slug}` },
      ],
      pageUrl,
    ),
  ];
});
</script>
