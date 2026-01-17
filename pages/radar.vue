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
            @click="selectedView = 'treemap'"
            class="flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium transition-all duration-300"
            :class="
              selectedView === 'treemap'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-gray-400 hover:text-white'
            "
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
            @click="selectedView = 'sunburst'"
            class="flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium transition-all duration-300"
            :class="
              selectedView === 'sunburst'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-gray-400 hover:text-white'
            "
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
import { ref, computed } from "vue";
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

const languagesAndFrameworks = [
  {
    name: "Vue.js",
    category: "languages_and_frameworks",
    subCategory: "front_end",
    status: "adopt",
    evaluatedScore: "4",
    link: "https://vuejs.org/",
    blogTopic: "vue",
    target: "_blank",
  },
  {
    name: "Bun",
    category: "languages_and_frameworks",
    subCategory: "back_end",
    status: "trial",
    evaluatedScore: "2",
    logoPath: "/bun-logo.svg",
    link: "https://bun.sh/",
    blogTopic: "bun",
    target: "_blank",
  },
  {
    name: "Nuxt.js",
    category: "languages_and_frameworks",
    subCategory: "front_end",
    status: "trial",
    evaluatedScore: "4",
  },
  {
    name: "GoLang",
    category: "languages_and_frameworks",
    subCategory: "back_end",
    status: "asses",
  },
];

const platforms = [
  {
    name: "Kubernetes",
    category: "platforms",
    subCategory: "cloud",
    status: "adopt",
    evaluatedScore: "4",
  },
  {
    name: "Civo",
    category: "platforms",
    subCategory: "cloud",
    status: "trial",
    evaluatedScore: "0",
  },
  {
    name: "Cloudflare",
    category: "platforms",
    subCategory: "cloud",
    status: "adopt",
    evaluatedScore: "4",
  },
];

const tools = [
  {
    name: "GitLab",
    category: "tools",
    subCategory: "CI/CD",
    status: "adopt",
    evaluatedScore: "3",
  },
  {
    name: "ArgoCD",
    category: "tools",
    subCategory: "CI/CD",
    status: "adopt",
    evaluatedScore: "2",
  },
  {
    name: "Rancher Desktop",
    category: "tools",
    subCategory: "development",
    status: "adopt",
    evaluatedScore: "4",
  },
  {
    name: "Docker Desktop",
    category: "tools",
    subCategory: "development",
    status: "hold",
    evaluatedScore: "4",
  },
];

const techniques = [
  {
    name: "GitOps",
    category: "techniques",
    subCategory: "architecture",
    status: "adopt",
    evaluatedScore: "4",
  },
];

const processData = (data: any[]) => {
  return data.reduce((acc, item) => {
    const subCategory = item.subCategory;
    const subCategoryIndex = acc.findIndex((i: any) => i.name === subCategory);
    if (subCategoryIndex === -1) {
      acc.push({
        name: subCategory,
        children: [{ ...item, value: 1 }],
      });
    } else {
      acc[subCategoryIndex].children.push({ ...item, value: 1 });
    }
    return acc;
  }, []);
};

const languagesAndFrameworksBySubcategory = processData(languagesAndFrameworks);
const platformsBySubcategory = processData(platforms);
const toolsBySubcategory = processData(tools);
const techniquesBySubcategory = processData(techniques);

const chartData = [
  {
    name: "Languages & Frameworks",
    children: languagesAndFrameworksBySubcategory,
    itemStyle: { color: "#3b82f6" }, // blue-500
  },
  {
    name: "Platforms",
    children: platformsBySubcategory,
    itemStyle: { color: "#a855f7" }, // purple-500
  },
  {
    name: "Tools",
    children: toolsBySubcategory,
    itemStyle: { color: "#f59e0b" }, // amber-500
  },
  {
    name: "Techniques",
    children: techniquesBySubcategory,
    itemStyle: { color: "#10b981" }, // emerald-500
  },
];

const tooltipFormatter = (info: any) => {
  if (!info.data || !info.data.status) return ""; // Only show for leaf nodes

  const logoImage = info.data.logoPath
    ? `<img class="h-8 w-8 object-contain" src="${info.data.logoPath}"/>`
    : "";

  const externalLink = info.data.link
    ? `
      <a href="${info.data.link}" target="${info.data.target}" class="mt-2 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
        <span>External Link</span>
      </a>`
    : "";

  const internalLink = info.data.blogTopic
    ? `<a class="mt-1 text-sm text-blue-400 hover:text-blue-300 underline decoration-wavy underline-offset-4 transition-colors" href="/blog?topic=${info.data.blogTopic}" target="_blank">Read Articles</a>`
    : "";

  return `
    <div class="bg-slate-900/90 p-4 rounded-lg border border-slate-700 shadow-xl backdrop-blur-md max-w-xs">
      <div class="flex items-center gap-3 mb-2">
        ${logoImage}
        <span class="font-bold text-lg text-white">${info.name}</span>
      </div>
      <div class="space-y-1 text-sm text-gray-300">
        <div class="flex justify-between gap-4">
          <span class="text-gray-400">Status:</span>
          <span class="font-medium text-white capitalize">${info.data.status}</span>
        </div>
        <div class="flex justify-between gap-4">
          <span class="text-gray-400">Score:</span>
          <span class="font-medium text-white">${info.data.evaluatedScore} / 4</span>
        </div>
      </div>
      <div class="mt-3 pt-3 border-t border-slate-700 flex flex-col">
        ${internalLink}
        ${externalLink}
      </div>
    </div>
  `;
};

const treemapOption = ref<EChartsOption>({
  backgroundColor: "transparent",
  tooltip: {
    show: true,
    enterable: true,
    padding: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
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
      data: chartData,
      universalTransition: true,
      label: {
        show: true,
        formatter: "{b}",
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
});

const sunburstOption = ref<EChartsOption>({
  backgroundColor: "transparent",
  tooltip: {
    show: true,
    enterable: true,
    padding: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    formatter: tooltipFormatter,
  },
  series: [
    {
      type: "sunburst",
      id: "radar",
      radius: ["15%", "90%"],
      animationDurationUpdate: 1000,
      nodeClick: "rootToNode",
      data: chartData,
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
          return param.name.length > 10
            ? param.name.slice(0, 10) + "..."
            : param.name;
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
});

type chartType = "sunburst" | "treemap";

const selectedView = ref<chartType>("treemap");

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
