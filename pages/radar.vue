<template>
  <main class="min-h-screen pt-24 text-yellow-100">
    <div class="mx-auto max-w-7xl px-6">
      <div
        class="mb-8 flex flex-col items-center justify-between gap-6 md:flex-row"
      >
        <div>
          <h1 class="text-4xl font-bold text-white md:text-5xl">Tech Radar</h1>
          <p class="mt-2 text-gray-400">
            Exploring technologies, tools, and techniques.
          </p>
        </div>

        <div
          class="flex items-center rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm"
        >
          <button
            class="flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium transition-all duration-300"
            :class="
              selectedView === 'treemap'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-gray-400 hover:text-white'
            "
            @click="selectedView = 'treemap'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
              />
            </svg>
            Treemap
          </button>
          <button
            class="flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium transition-all duration-300"
            :class="
              selectedView === 'sunburst'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-gray-400 hover:text-white'
            "
            @click="selectedView = 'sunburst'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
              />
            </svg>
            Radar
          </button>
        </div>
      </div>

      <!-- Adoption Progress + Status Filter -->
      <div
        class="mb-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
      >
        <div>
          <div
            class="mb-2 flex items-center justify-between text-xs text-gray-400"
          >
            <span>Adoption Progress</span>
            <span>{{ allItems.length }} technologies tracked</span>
          </div>
          <div class="flex h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              v-for="segment in progressSegments"
              :key="segment.status"
              class="h-full first:rounded-l-full last:rounded-r-full"
              :style="{
                width: segment.percent + '%',
                backgroundColor: segment.color,
              }"
              :title="`${segment.label}: ${segment.count}`"
            />
          </div>
        </div>

        <!-- Status pills double as a top-level filter -->
        <div class="flex flex-wrap items-center gap-2">
          <button
            class="rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200"
            :class="
              selectedStatus === 'all'
                ? 'border-white/30 bg-white/10 text-white'
                : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
            "
            @click="selectedStatus = 'all'"
          >
            All <span class="ml-1 font-semibold">{{ allItems.length }}</span>
          </button>
          <button
            v-for="segment in progressSegments"
            :key="`filter-${segment.status}`"
            class="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200"
            :class="
              selectedStatus === segment.status
                ? 'text-white'
                : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
            "
            :style="
              selectedStatus === segment.status
                ? { backgroundColor: segment.color + '26', borderColor: segment.color }
                : {}
            "
            @click="
              selectedStatus = selectedStatus === segment.status ? 'all' : segment.status
            "
          >
            <span
              class="h-2 w-2 shrink-0 rounded-full"
              :style="{ backgroundColor: segment.color }"
            />
            {{ segment.label }}
            <span
              class="font-semibold"
              :class="selectedStatus === segment.status ? 'text-white' : 'text-gray-300'"
              >{{ segment.count }}</span
            >
          </button>
        </div>
      </div>

      <div
        class="overflow-hidden rounded-3xl border border-white/10 bg-black/20 backdrop-blur-sm"
      >
        <client-only>
          <VChart class="chart" :option="options" />
        </client-only>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useHead } from "#app";
import type { EChartsOption } from "echarts";
import { SunburstChart, TreemapChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import { use as useECharts } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { computed, ref } from "vue";
import VChart from "vue-echarts";

useHead({
  title: "Tech Radar - Mihai Farcas",
});

useSeoMeta({
  title: "Tech Radar - Mihai Farcas Software Architecture Technologies",
  description:
    "Explore the technologies and tools used by Mihai Farcas for software architecture, Agentic AI development, and enterprise solutions. Including Kubernetes, Vue.js, Node.js, n8n, LangGraph, and more.",
  ogTitle: "Tech Radar - Mihai Farcas Technologies & Tools",
  ogDescription:
    "Discover the technology stack and tools for modern software architecture and AI automation.",
  ogUrl: "https://mihai.ltd/radar",
  twitterTitle: "Tech Radar - Mihai Farcas",
  twitterDescription:
    "Technologies and tools for software architecture and AI automation by Mihai Farcas.",
});

useECharts([
  CanvasRenderer,
  SunburstChart,
  TreemapChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

// Radar entries live as markdown content (content/radar/*.md) so editing a
// tech's frontmatter (status, score, satisfaction...) is the single source
// of truth for both its own report page and this radar view.
type RadarPlacement = { category: string; subCategory: string };

type RawRadarContent = {
  path: string;
  title: string;
  description?: string;
  placements: RadarPlacement[];
  stage: StageKey;
  evaluatedScore?: number;
  satisfaction?: number;
  decision?: DecisionKey;
  decisionReason?: string;
  decisionInFavorOf?: string;
  reviewTrigger?: string;
  decidedDate?: string;
  link?: string;
  logoPath?: string;
  target?: string;
  [key: string]: unknown;
};

type RadarItem = {
  slug: string;
  name: string;
  description?: string;
  placements: RadarPlacement[];
  stage: StageKey;
  evaluatedScore: number;
  satisfaction?: number;
  decision?: DecisionKey;
  decisionReason?: string;
  decisionInFavorOf?: string;
  reviewTrigger?: string;
  decidedDate?: string;
  link?: string;
  logoPath?: string;
  target?: string;
};

type RadarLeaf = RadarItem & {
  value: number;
  itemStyle: { borderColor: string; borderWidth: number; opacity: number };
};

type RadarGroup = {
  name: string;
  children: RadarLeaf[];
};

const { data: radarContent } = await useAsyncData("radar-items", () =>
  queryCollection("radar").all(),
);

const allItems = computed<RadarItem[]>(() =>
  ((radarContent.value ?? []) as unknown as RawRadarContent[]).map((raw) => ({
    slug: raw.path.split("/").pop() ?? raw.path,
    name: raw.title,
    description: raw.description,
    placements: raw.placements,
    stage: raw.stage,
    evaluatedScore: raw.evaluatedScore ?? 0,
    satisfaction: raw.satisfaction,
    decision: raw.decision,
    decisionReason: raw.decisionReason,
    decisionInFavorOf: raw.decisionInFavorOf,
    reviewTrigger: raw.reviewTrigger,
    decidedDate: raw.decidedDate,
    link: raw.link,
    logoPath: raw.logoPath,
    target: raw.target,
  })),
);

const itemsBySlug = computed(
  () => new Map(allItems.value.map((item) => [item.slug, item])),
);

const categoryMeta: Record<string, { label: string; color: string }> = {
  languages_and_frameworks: {
    label: "Languages & Frameworks",
    color: "#3b82f6", // blue-500
  },
  platforms: { label: "Platforms", color: "#a855f7" }, // purple-500
  tools: { label: "Tools", color: "#f59e0b" }, // amber-500
  techniques: { label: "Techniques", color: "#10b981" }, // emerald-500
};
const categoryOrder = Object.keys(categoryMeta);

const selectedStatus = ref<StatusKey | "all">("all");

const filteredItems = computed(() =>
  selectedStatus.value === "all"
    ? allItems.value
    : allItems.value.filter(
        (item) => getEffectiveStatus(item.stage, item.decision) === selectedStatus.value,
      ),
);

const toLeaf = (item: RadarItem): RadarLeaf => ({
  ...item,
  value: 1,
  // Border color is the at-a-glance adoption-status indicator,
  // independent of the fill color which encodes the top-level category.
  itemStyle: {
    borderColor: getRadarStatusMeta(getEffectiveStatus(item.stage, item.decision)).color,
    borderWidth: 3,
    // Rejected tech fades back instead of competing for attention
    // with what's actually adopted, trialing, or on hold.
    opacity: item.decision === "reject" ? 0.5 : 1,
  },
});

// Items can carry more than one placement (e.g. TypeScript under both
// front_end and back_end), so a single item can appear as a leaf in more
// than one branch of the tree — expand before grouping, rather than
// grouping items 1:1.
const chartData = computed(() => {
  const byCategory = new Map<string, Map<string, RadarLeaf[]>>();

  for (const item of filteredItems.value) {
    for (const placement of item.placements) {
      if (!byCategory.has(placement.category)) {
        byCategory.set(placement.category, new Map());
      }
      const bySubCategory = byCategory.get(placement.category)!;
      if (!bySubCategory.has(placement.subCategory)) {
        bySubCategory.set(placement.subCategory, []);
      }
      bySubCategory.get(placement.subCategory)!.push(toLeaf(item));
    }
  }

  return categoryOrder
    .filter((categoryKey) => byCategory.has(categoryKey))
    .map((categoryKey) => {
      const bySubCategory = byCategory.get(categoryKey)!;
      const children: RadarGroup[] = Array.from(bySubCategory.entries()).map(
        ([subCategory, leaves]) => ({ name: subCategory, children: leaves }),
      );
      return {
        name: categoryMeta[categoryKey].label,
        children,
        itemStyle: { color: categoryMeta[categoryKey].color },
      };
    });
});

const progressSegments = computed(() => {
  const total = allItems.value.length;
  return radarStatusOrder
    .map((status) => {
      const meta = radarStatusMeta[status];
      const count = allItems.value.filter(
        (item) => getEffectiveStatus(item.stage, item.decision) === status,
      ).length;
      return {
        status,
        label: meta.label,
        color: meta.color,
        count,
        percent: total ? (count / total) * 100 : 0,
      };
    })
    .filter((segment) => segment.count > 0);
});

interface RadarTooltipData {
  slug?: string;
  stage?: StageKey;
  decision?: DecisionKey;
  evaluatedScore?: number;
  satisfaction?: number;
  decisionReason?: string;
  decisionInFavorOf?: string;
  reviewTrigger?: string;
  decidedDate?: string;
  logoPath?: string;
  link?: string;
  target?: string;
}

interface RadarTooltipInfo {
  name?: string;
  data?: RadarTooltipData;
}

const scoreBarHtml = (score: number, color: string) => {
  const segments = Array.from({ length: 4 }, (_, i) => {
    const filled = i < score;
    return `<span class="h-1.5 flex-1 rounded-full${filled ? "" : " bg-white/10"}" style="${filled ? `background-color:${color}` : ""}"></span>`;
  }).join("");
  return `<div class="flex w-20 items-center gap-1">${segments}</div>`;
};

const satisfactionStarsHtml = (rating: number) => {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  const filled = "★".repeat(clamped);
  const empty = "☆".repeat(5 - clamped);
  return `<span class="text-sm tracking-wider"><span class="text-amber-400">${filled}</span><span class="text-slate-600">${empty}</span></span>`;
};

const formatDecidedDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const tooltipFormatter = (info: RadarTooltipInfo) => {
  if (!info.data || !info.data.stage) return ""; // Only show for leaf nodes

  const effectiveStatus = getEffectiveStatus(info.data.stage, info.data.decision);
  const meta = getRadarStatusMeta(effectiveStatus);
  const stageLabel = getRadarStatusMeta(info.data.stage).label;
  const score = Number(info.data.evaluatedScore) || 0;
  const slug = info.data.slug;

  const logoImage = info.data.logoPath
    ? `<img class="h-8 w-8 object-contain" src="${info.data.logoPath}"/>`
    : "";

  const externalLink = info.data.link
    ? `
      <a href="${info.data.link}" target="${info.data.target ?? "_blank"}" rel="noopener noreferrer" class="mt-2 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
        <span>External Link</span>
      </a>`
    : "";

  const internalLink = slug
    ? `<a class="mt-1 text-sm text-blue-400 hover:text-blue-300 underline decoration-wavy underline-offset-4 transition-colors" href="/blog/${slug}">Read Tech Report</a>`
    : "";

  const favorOfTarget = info.data.decisionInFavorOf
    ? itemsBySlug.value.get(info.data.decisionInFavorOf)
    : undefined;
  const favorOfRow = favorOfTarget
    ? `
      <div class="flex items-center justify-between gap-4">
        <span class="text-gray-400">In favor of:</span>
        <a href="/blog/${favorOfTarget.slug}" class="font-medium text-blue-400 hover:text-blue-300">${favorOfTarget.name} →</a>
      </div>`
    : "";

  const reviewTriggerRow =
    info.data.decision === "hold" && info.data.reviewTrigger
      ? `
      <div>
        <span class="text-gray-400">Revisit when:</span>
        <p class="mt-0.5 line-clamp-2 font-medium text-white">${info.data.reviewTrigger}</p>
      </div>`
      : "";

  const satisfactionRow =
    info.data.satisfaction != null
      ? `
      <div class="flex items-center justify-between gap-4">
        <span class="text-gray-400">Satisfaction:</span>
        <div class="flex items-center gap-2">
          ${satisfactionStarsHtml(info.data.satisfaction)}
          <span class="text-xs font-medium text-white">${info.data.satisfaction}/5</span>
        </div>
      </div>`
      : "";

  const decisionReasonParagraph = info.data.decisionReason
    ? `<p class="line-clamp-3 text-xs italic leading-relaxed text-gray-400">&ldquo;${info.data.decisionReason}&rdquo;</p>`
    : "";

  const decidedCaption =
    info.data.decision && info.data.decidedDate
      ? `<span class="ml-1.5 text-[10px] font-normal normal-case text-gray-500">· ${formatDecidedDate(info.data.decidedDate)}</span>`
      : "";

  return `
    <div class="bg-slate-900/90 p-4 rounded-lg border border-slate-700 shadow-xl backdrop-blur-md w-80 max-w-full break-words">
      <div class="flex items-center gap-3 mb-2">
        ${logoImage}
        <span class="font-bold text-lg text-white">${info.name}</span>
      </div>
      <div class="space-y-2 text-sm text-gray-300">
        <div class="flex items-center justify-between gap-4">
          <span class="text-gray-400">Status:</span>
          <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${meta.bg} ${meta.text} ${meta.ring}">${meta.label}${decidedCaption}</span>
        </div>
        <div class="flex items-center justify-between gap-4">
          <span class="text-gray-400">Progress (${stageLabel}):</span>
          <div class="flex items-center gap-2">
            ${scoreBarHtml(score, meta.color)}
            <span class="text-xs font-medium text-white">${score}/4</span>
          </div>
        </div>
        ${satisfactionRow}
        ${favorOfRow}
        ${reviewTriggerRow}
        ${decisionReasonParagraph}
      </div>
      <div class="mt-3 pt-3 border-t border-slate-700 flex flex-col">
        ${internalLink}
        ${externalLink}
      </div>
    </div>
  `;
};

const treemapOption = computed<EChartsOption>(() => ({
  backgroundColor: "transparent",
  tooltip: {
    show: true,
    enterable: true,
    padding: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    // Keep the tooltip fully on-screen instead of letting it spill past the
    // window edge when hovering items near the border of the chart. A fixed,
    // wrapping width (rather than echart's default nowrap sizing) is what
    // actually stops it — without it the box grows to fit unwrapped text and
    // forces a horizontal scrollbar on the whole page.
    confine: true,
    transitionDuration: 0.2,
    extraCssText: "width: 320px; max-width: 85vw; white-space: normal; overflow: hidden;",
    formatter: tooltipFormatter,
  },
  series: [
    {
      type: "treemap",
      id: "radar",
      animationDuration: 1000,
      animationDurationUpdate: 1000,
      roam: false,
      nodeClick: "zoomToNode",
      leafDepth: 2,
      visibleMin: 300,
      data: chartData.value,
      universalTransition: true,
      label: {
        show: true,
        formatter: (param) => {
          const isRejected = param.data?.decision === "reject";
          return `${isRejected ? "⊘ " : ""}${param.name}`;
        },
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
      },
      upperLabel: {
        show: true,
        height: 30,
        color: "#fff",
        backgroundColor: "transparent",
      },
      itemStyle: {
        borderColor: "#1e293b", // slate-800
        borderWidth: 2,
        gapWidth: 2,
      },
      breadcrumb: {
        show: true,
        top: 10,
        left: 10,
        height: 30,
        emptyItemWidth: 30,
        itemStyle: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.2)",
          borderWidth: 1,
          shadowBlur: 0,
          textStyle: {
            color: "#fff",
          },
        },
      },
      levels: [
        {
          itemStyle: {
            borderColor: "#0f172a", // slate-900
            borderWidth: 0,
            gapWidth: 4,
          },
          upperLabel: {
            show: false,
          },
        },
        {
          itemStyle: {
            borderColor: "#1e293b", // slate-800
            borderWidth: 2,
            gapWidth: 2,
          },
          emphasis: {
            itemStyle: {
              borderColor: "#cbd5e1", // slate-300
            },
          },
        },
        {
          colorSaturation: [0.35, 0.5],
          itemStyle: {
            borderWidth: 1,
            gapWidth: 1,
            borderColorSaturation: 0.6,
          },
        },
      ],
    },
  ],
}));

const sunburstOption = computed<EChartsOption>(() => ({
  backgroundColor: "transparent",
  tooltip: {
    show: true,
    enterable: true,
    padding: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    // Keep the tooltip fully on-screen instead of letting it spill past the
    // window edge when hovering items near the border of the chart. A fixed,
    // wrapping width (rather than echart's default nowrap sizing) is what
    // actually stops it — without it the box grows to fit unwrapped text and
    // forces a horizontal scrollbar on the whole page.
    confine: true,
    transitionDuration: 0.2,
    extraCssText: "width: 320px; max-width: 85vw; white-space: normal; overflow: hidden;",
    formatter: tooltipFormatter,
  },
  series: [
    {
      type: "sunburst",
      id: "radar",
      radius: ["15%", "90%"],
      animationDurationUpdate: 1000,
      nodeClick: "rootToNode",
      data: chartData.value,
      universalTransition: true,
      itemStyle: {
        borderWidth: 1,
        borderColor: "#1e293b", // slate-800
        borderRadius: 4,
      },
      label: {
        show: true,
        rotate: "radial",
        color: "#fff",
        fontSize: 10,
        formatter: (param) => {
          const isRejected = param.data?.decision === "reject";
          const label = `${isRejected ? "⊘ " : ""}${param.name}`;
          return label.length > 10 ? label.slice(0, 10) + "..." : label;
        },
      },
      levels: [
        {},
        {
          r0: "15%",
          r: "40%",
          itemStyle: {
            borderWidth: 2,
          },
          label: {
            rotate: "tangential",
            fontSize: 12,
            fontWeight: "bold",
          },
        },
        {
          r0: "40%",
          r: "70%",
          label: {
            align: "right",
          },
        },
        {
          r0: "70%",
          r: "90%",
          label: {
            position: "outside",
            padding: 3,
            silent: false,
          },
          itemStyle: {
            borderWidth: 3,
          },
        },
      ],
    },
  ],
}));

type ChartType = "sunburst" | "treemap";

const selectedView = ref<ChartType>("treemap");

const options = computed(() => {
  if (selectedView.value === "sunburst") {
    return sunburstOption.value;
  } else {
    return treemapOption.value;
  }
});
</script>

<style scoped>
.chart {
  height: 80vh;
  width: 100%;
}
</style>
