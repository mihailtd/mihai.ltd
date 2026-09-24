<template>
  <main class="relative min-h-screen overflow-hidden pb-20 pt-24">
    <!-- Ambient Background Glow -->
    <div
      class="pointer-events-none absolute left-0 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-blue-600/15 blur-[140px]"
    ></div>
    <div
      class="pointer-events-none absolute right-0 top-40 -z-10 h-[500px] w-[500px] translate-x-1/3 rounded-full bg-purple-600/15 blur-[140px]"
    ></div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="mb-12 border-b border-white/10 pb-10">
        <div class="max-w-3xl">
          <div
            class="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300"
          >
            <span>🛠️</span>
            <span>Tools & Recommendations</span>
          </div>
          <h1
            class="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-6xl"
          >
            Tech Stack & <br />
            <span
              class="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent"
            >
              Recommended Tools
            </span>
          </h1>
          <p class="text-lg leading-relaxed text-gray-400">
            A curated index of the cloud platforms, AI frameworks, creator
            tooling, and hardware I rely on daily for enterprise software
            architecture and content creation.
          </p>
        </div>

        <!-- Transparency Disclosure Note -->
        <div
          class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-gray-400 backdrop-blur-md"
        >
          <span class="font-semibold text-gray-200">FTC Transparency:</span>
          Some of the tools listed below feature partner perks, extended trials,
          or affiliate relationships. If you sign up using these links, I may
          receive a commission at no additional cost to you. I only recommend
          platforms I have evaluated, use in production, or stand behind.
        </div>
      </div>

      <!-- Featured Partner Showcase (LearnWorlds & Key Perks) -->
      <section class="mb-16">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold tracking-tight text-white">
            Featured Partner Perk
          </h2>
          <span class="text-xs text-gray-400">Exclusive community offer</span>
        </div>

        <!-- LearnWorlds Affiliate Card -->
        <AffiliateCard
          name="LearnWorlds"
          tagline="All-in-One AI-Powered Course Platform & LMS"
          badge="Featured Partner Perk"
          perk="30-Day Extended Free Trial"
          href="https://www.learnworlds.com/?ref=mihailtd"
          cta-text="Claim 30-Day Free Trial"
          logo="/images/partners/learnworlds-logo.svg"
          banner-image="/images/partners/learnworlds-banner.svg"
          banner-caption="Interactive Academy Builder • Built-in AI • White-label Mobile Apps"
          rating="4.9/5"
          :features="[
            'AI Assistant for course outlines, quizzes & assessments',
            'Interactive video editor with in-video questions & notes',
            '100% white-label academy with custom domain & mobile apps',
            'SCORM & xAPI compliance with flexible payment gateways',
          ]"
          :featured="true"
        >
          <p>
            If you're an engineer, educator, or founder looking to package your
            knowledge into high-end online courses or a corporate training
            academy, LearnWorlds is my top recommendation. Unlike basic course
            plugins, it provides a comprehensive, scalable LMS with built-in AI
            authoring and interactive video learning.
          </p>
        </AffiliateCard>
      </section>

      <!-- Category Filter & Search Bar -->
      <section class="mb-10">
        <div
          class="flex flex-col justify-between gap-4 md:flex-row md:items-center"
        >
          <!-- Category Pills -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="cat in categories"
              :key="cat.value"
              class="rounded-full border px-4 py-2 text-xs font-semibold backdrop-blur-sm transition-all duration-200"
              :class="
                selectedCategory === cat.value
                  ? 'border-blue-500/50 bg-blue-600/25 text-blue-200 shadow-lg shadow-blue-600/20 ring-1 ring-blue-500/30'
                  : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10 hover:text-white'
              "
              @click="selectedCategory = cat.value"
            >
              {{ cat.label }}
              <span
                class="ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                :class="
                  selectedCategory === cat.value
                    ? 'bg-blue-500/30 text-white'
                    : 'bg-white/10 text-gray-400'
                "
              >
                {{ getCategoryCount(cat.value) }}
              </span>
            </button>
          </div>

          <!-- Search Input -->
          <div class="relative w-full max-w-xs">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Filter tools..."
              class="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 backdrop-blur-md focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400"
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
        </div>
      </section>

      <!-- Tools Grid -->
      <section class="mb-20">
        <div
          v-if="filteredTools.length > 0"
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div
            v-for="tool in filteredTools"
            :key="tool.name"
            class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gray-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-gray-800/60 hover:shadow-xl hover:shadow-blue-900/10"
          >
            <div>
              <!-- Top Row: Icon, Name & Category Badge -->
              <div class="mb-4 flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2"
                  >
                    <img
                      v-if="tool.logo"
                      :src="tool.logo"
                      :alt="`${tool.name} logo`"
                      class="h-full w-full object-contain"
                      loading="lazy"
                    />
                    <span v-else class="text-xl">{{ tool.icon || "⚙️" }}</span>
                  </div>
                  <div>
                    <h3
                      class="font-bold text-white transition-colors group-hover:text-blue-300"
                    >
                      {{ tool.name }}
                    </h3>
                    <span class="text-xs text-gray-400">
                      {{ tool.categoryLabel }}
                    </span>
                  </div>
                </div>

                <!-- Perk Pill (if affiliate) -->
                <span
                  v-if="tool.perk"
                  class="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold text-yellow-300"
                >
                  {{ tool.perk }}
                </span>
              </div>

              <!-- Architect's Take -->
              <p class="mb-6 text-sm leading-relaxed text-gray-300">
                {{ tool.description }}
              </p>
            </div>

            <!-- Footer: Link / CTA Button -->
            <div class="border-t border-white/5 pt-4">
              <a
                :href="tool.url"
                target="_blank"
                :rel="
                  tool.isAffiliate
                    ? 'sponsored noopener noreferrer'
                    : 'noopener noreferrer'
                "
                class="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-gray-200 transition-all duration-200 hover:border-blue-500/40 hover:bg-blue-600/20 hover:text-white"
              >
                <span>{{ tool.cta || "Visit " + tool.name }}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
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
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="py-16 text-center">
          <p class="text-gray-400">No tools found matching your criteria.</p>
          <button
            class="mt-3 text-xs text-blue-400 hover:underline"
            @click="
              searchQuery = '';
              selectedCategory = 'all';
            "
          >
            Reset filters
          </button>
        </div>
      </section>

      <!-- Bottom Cross-Link to Tech Radar -->
      <section
        class="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-purple-950/40 p-8 text-center backdrop-blur-xl md:p-12"
      >
        <div class="mx-auto max-w-2xl">
          <h3 class="mb-3 text-2xl font-bold text-white md:text-3xl">
            Want in-depth architectural evaluations?
          </h3>
          <p class="mb-8 text-sm leading-relaxed text-gray-300 md:text-base">
            Check out my interactive ThoughtWorks-style Tech Radar with 55+
            frameworks, platforms, and methodologies analyzed across assess,
            trial, adopt, and hold stages.
          </p>
          <NuxtLink
            to="/radar"
            class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50"
          >
            <span>Explore Tech Radar</span>
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
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </NuxtLink>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
const searchQuery = ref("");
const selectedCategory = ref("all");

const categories = [
  { label: "All Stack", value: "all" },
  { label: "Creator & LMS", value: "creator" },
  { label: "AI & Automation", value: "ai" },
  { label: "Cloud & Infrastructure", value: "cloud" },
  { label: "Development", value: "dev" },
];

interface ToolItem {
  name: string;
  category: "creator" | "ai" | "cloud" | "dev";
  categoryLabel: string;
  description: string;
  url: string;
  logo?: string;
  icon?: string;
  perk?: string;
  cta?: string;
  isAffiliate?: boolean;
}

const tools: ToolItem[] = [
  {
    name: "LearnWorlds",
    category: "creator",
    categoryLabel: "Course Platform & LMS",
    description:
      "All-in-one platform for creating and selling online courses with built-in AI course generator, interactive video quizzes, and white-label branding.",
    url: "https://www.learnworlds.com/?ref=mihailtd",
    logo: "/images/partners/learnworlds-logo.svg",
    perk: "30-Day Free Trial",
    cta: "Start 30-Day Trial",
    isAffiliate: true,
  },
  {
    name: "Cloudflare",
    category: "cloud",
    categoryLabel: "Edge Infrastructure & CDN",
    description:
      "Powers DNS, edge caching, and Cloudflare Workers hosting for this very website. Unbeatable global latency and security.",
    url: "https://www.cloudflare.com",
    logo: "/images/cloudflare.svg",
    cta: "Explore Cloudflare",
  },
  {
    name: "n8n",
    category: "ai",
    categoryLabel: "Workflow Automation & AI",
    description:
      "Self-hostable, source-available workflow automation tool. My go-to engine for orchestrating LLM chains, agentic automations, and enterprise APIs.",
    url: "https://n8n.io",
    logo: "/images/logos/N8n.io_idWtnk-fDo_1.png",
    cta: "Check out n8n",
  },
  {
    name: "Claude Code & Anthropic",
    category: "ai",
    categoryLabel: "LLM & Agentic Coding",
    description:
      "Top-tier reasoning and coding models. Claude powers my agentic workflows, complex refactors, and architectural reasoning tasks.",
    url: "https://www.anthropic.com",
    logo: "/images/Claude_AI_symbol.svg.webp",
    cta: "Explore Claude",
  },
  {
    name: "Docker & Compose",
    category: "cloud",
    categoryLabel: "Containers & Runtime",
    description:
      "The undisputed standard for containerized microservices and reproducible local developer environments.",
    url: "https://www.docker.com",
    logo: "/images/docker-svgrepo-com.svg",
    cta: "View Docker",
  },
  {
    name: "Kubernetes & ArgoCD",
    category: "cloud",
    categoryLabel: "Orchestration & GitOps",
    description:
      "Declarative continuous deployment and production container orchestration for resilient cloud-native architectures.",
    url: "https://argo-cd.readthedocs.io",
    logo: "/images/argo-cd.svg",
    cta: "Explore GitOps",
  },
  {
    name: "VS Code",
    category: "dev",
    categoryLabel: "IDE & Code Editor",
    description:
      "My primary development environment, customized with strict TypeScript tooling, Tailwind extensions, and Vim keybindings.",
    url: "https://code.visualstudio.com",
    logo: "/images/vscode.svg",
    cta: "Get VS Code",
  },
  {
    name: "uv (Astral)",
    category: "dev",
    categoryLabel: "Python Package Manager",
    description:
      "Extremely fast Python package installer and resolver written in Rust. Completely replaced pip, poetry, and virtualenv for my Python projects.",
    url: "https://docs.astral.sh/uv/",
    logo: "/images/python-svgrepo-com.svg",
    cta: "View uv Docs",
  },
  {
    name: "TypeScript",
    category: "dev",
    categoryLabel: "Language",
    description:
      "Primary language for both frontend and backend architectures. Strict types and interfaces prevent countless production runtime issues.",
    url: "https://www.typescriptlang.org",
    logo: "/images/typescript-official-svgrepo-com.svg",
    cta: "Learn TypeScript",
  },
  {
    name: "UpCloud",
    category: "cloud",
    categoryLabel: "European Cloud Compute",
    description:
      "High-performance cloud servers with MaxIOPS storage. Great reliability and compliance for European data sovereignty needs.",
    url: "https://upcloud.com",
    logo: "/images/upcloud.svg",
    cta: "Visit UpCloud",
  },
  {
    name: "DuckDB",
    category: "dev",
    categoryLabel: "Embedded Analytics DB",
    description:
      "Fast in-process analytical database for columnar querying, data transformation, and local analytics pipelines.",
    url: "https://duckdb.org",
    logo: "/images/DuckDB_icon-darkmode.svg",
    cta: "Explore DuckDB",
  },
];

const getCategoryCount = (catValue: string) => {
  if (catValue === "all") return tools.length;
  return tools.filter((t) => t.category === catValue).length;
};

const filteredTools = computed(() => {
  let list = tools;
  if (selectedCategory.value !== "all") {
    list = list.filter((t) => t.category === selectedCategory.value);
  }
  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.categoryLabel.toLowerCase().includes(q),
    );
  }
  return list;
});

useSeoMeta({
  title: "Tech Stack & Recommended Tools - Mihai Farcas",
  description:
    "Curated software architecture tools, cloud platforms, AI engines, and creator equipment recommended by Mihai Farcas.",
  ogTitle: "Tech Stack & Recommended Tools - Mihai Farcas",
  ogDescription:
    "Curated software architecture tools, cloud platforms, AI engines, and creator equipment recommended by Mihai Farcas.",
  ogUrl: "https://mihai.ltd/stack",
});
</script>
