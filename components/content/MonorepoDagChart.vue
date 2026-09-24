<template>
  <div
    class="my-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl backdrop-blur-xl sm:p-6"
  >
    <!-- Header -->
    <div
      class="mb-4 flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center"
    >
      <div>
        <div class="flex items-center gap-2">
          <span
            class="flex h-2 w-2 animate-pulse rounded-full bg-blue-400"
          ></span>
          <h4 class="text-base font-bold text-white sm:text-lg">
            Interactive Cross-Language Dependency Graph (DAG)
          </h4>
        </div>
        <p class="mt-0.5 text-xs text-gray-400">
          Visualizing topological task execution across Rust, Python, and
          TypeScript
        </p>
      </div>

      <!-- Quick Legend Badges -->
      <div class="flex flex-wrap items-center gap-2 text-[11px]">
        <span
          class="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 font-medium text-orange-300"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-orange-400"></span> Rust
          (cargo)
        </span>
        <span
          class="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 font-medium text-yellow-300"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-yellow-400"></span> Python
          (uv)
        </span>
        <span
          class="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 font-medium text-blue-300"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-blue-400"></span> TS (pnpm)
        </span>
        <span
          class="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-medium text-emerald-300"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Artifact
        </span>
      </div>
    </div>

    <!-- Chart Container with ClientOnly -->
    <div class="relative h-[360px] w-full sm:h-[400px]">
      <client-only>
        <VChart class="dag-chart" :option="chartOption" autoresize />
        <template #fallback>
          <div
            class="flex h-full w-full items-center justify-center rounded-2xl bg-white/5 text-xs text-gray-500"
          >
            Loading interactive DAG chart...
          </div>
        </template>
      </client-only>
    </div>

    <!-- Footer tip -->
    <div
      class="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-gray-500"
    >
      <span
        >💡 Tip: Hover over nodes to trace dependency chains. Nodes can be
        dragged.</span
      >
      <span class="font-mono text-gray-600">Powered by Apache ECharts</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { GraphChart } from "echarts/charts";
import {
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import { use as useECharts } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";

useECharts([
  CanvasRenderer,
  GraphChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

const categories = [
  { name: "Rust", itemStyle: { color: "#F97316" } },
  { name: "Python", itemStyle: { color: "#EAB308" } },
  { name: "TypeScript", itemStyle: { color: "#3B82F6" } },
  { name: "Artifact", itemStyle: { color: "#10B981" } },
  { name: "Release", itemStyle: { color: "#EC4899" } },
];

const nodes = [
  {
    name: "Rust Core Engine",
    category: 0,
    x: 60,
    y: 70,
    symbolSize: 64,
    itemStyle: {
      color: "#EA580C",
      borderColor: "#FDBA74",
      borderWidth: 2,
      shadowBlur: 16,
      shadowColor: "rgba(234, 88, 12, 0.4)",
    },
    label: {
      show: true,
      formatter: "Rust Core\n(Engine)",
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "bold" as const,
    },
    details: {
      toolchain: "Rust 1.80 (managed via proto)",
      command: "cargo build --target wasm32",
      outputs: "crates/core/pkg/*.wasm",
      cacheStatus: "Cached (Inputs: src/**/*.rs, Cargo.lock)",
    },
  },
  {
    name: "WASM Binary",
    category: 3,
    x: 270,
    y: 70,
    symbolSize: 56,
    itemStyle: {
      color: "#0D9488",
      borderColor: "#5EEAD4",
      borderWidth: 2,
      shadowBlur: 12,
      shadowColor: "rgba(13, 148, 136, 0.3)",
    },
    label: {
      show: true,
      formatter: "WASM\nModule",
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "bold" as const,
    },
    details: {
      toolchain: "WebAssembly target",
      command: "wasm-pack / wasm-bindgen",
      outputs: "dist/engine.wasm",
      cacheStatus: "Artifact cached across CI",
    },
  },
  {
    name: "Python API Service",
    category: 1,
    x: 60,
    y: 230,
    symbolSize: 64,
    itemStyle: {
      color: "#CA8A04",
      borderColor: "#FDE047",
      borderWidth: 2,
      shadowBlur: 16,
      shadowColor: "rgba(202, 138, 4, 0.4)",
    },
    label: {
      show: true,
      formatter: "Python API\n(FastAPI)",
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "bold" as const,
    },
    details: {
      toolchain: "Python 3.12 (uv workspace)",
      command: "uv run python -m app.openapi",
      outputs: "contracts/openapi.json",
      cacheStatus: "Cached (Inputs: app/**/*.py, uv.lock)",
    },
  },
  {
    name: "OpenAPI Spec",
    category: 3,
    x: 270,
    y: 230,
    symbolSize: 56,
    itemStyle: {
      color: "#059669",
      borderColor: "#6EE7B7",
      borderWidth: 2,
      shadowBlur: 12,
      shadowColor: "rgba(5, 150, 105, 0.3)",
    },
    label: {
      show: true,
      formatter: "OpenAPI\nSchema",
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "bold" as const,
    },
    details: {
      toolchain: "JSON Schema Contract",
      command: "Generated schema contract",
      outputs: "contracts/openapi.json",
      cacheStatus: "Strict single source of truth",
    },
  },
  {
    name: "TS Client SDK",
    category: 2,
    x: 480,
    y: 230,
    symbolSize: 58,
    itemStyle: {
      color: "#2563EB",
      borderColor: "#93C5FD",
      borderWidth: 2,
      shadowBlur: 14,
      shadowColor: "rgba(37, 99, 235, 0.35)",
    },
    label: {
      show: true,
      formatter: "TS Client\nSDK",
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "bold" as const,
    },
    details: {
      toolchain: "Node 20 (pnpm workspace)",
      command: "pnpm --filter @org/api-client build",
      outputs: "packages/api-client/dist/*",
      cacheStatus: "Cached & shared via workspace:*",
    },
  },
  {
    name: "Web Client Application",
    category: 2,
    x: 680,
    y: 150,
    symbolSize: 66,
    itemStyle: {
      color: "#7C3AED",
      borderColor: "#C4B5FD",
      borderWidth: 2,
      shadowBlur: 18,
      shadowColor: "rgba(124, 58, 237, 0.4)",
    },
    label: {
      show: true,
      formatter: "Nuxt / Web\nFrontend",
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "bold" as const,
    },
    details: {
      toolchain: "Vue 3 / Nuxt (pnpm workspace)",
      command: "pnpm --filter web build",
      outputs: "apps/web/.output/*",
      cacheStatus: "Depends on WASM & TS SDK",
    },
  },
  {
    name: "Production Release Bundle",
    category: 4,
    x: 880,
    y: 150,
    symbolSize: 62,
    itemStyle: {
      color: "#DB2777",
      borderColor: "#F472B6",
      borderWidth: 2,
      shadowBlur: 18,
      shadowColor: "rgba(219, 39, 119, 0.4)",
    },
    label: {
      show: true,
      formatter: "Deployable\nRelease",
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "bold" as const,
    },
    details: {
      toolchain: "Docker / Cloudflare Worker",
      command: "moon run web:deploy",
      outputs: "Production edge release",
      cacheStatus: "Fully verified artifact",
    },
  },
];

const links = [
  {
    source: "Rust Core Engine",
    target: "WASM Binary",
    label: {
      show: true,
      formatter: "cargo build",
      fontSize: 10,
      color: "#FDBA74",
    },
  },
  {
    source: "WASM Binary",
    target: "Web Client Application",
    label: {
      show: true,
      formatter: "import .wasm",
      fontSize: 10,
      color: "#5EEAD4",
    },
  },
  {
    source: "Python API Service",
    target: "OpenAPI Spec",
    label: {
      show: true,
      formatter: "export spec",
      fontSize: 10,
      color: "#FDE047",
    },
  },
  {
    source: "OpenAPI Spec",
    target: "TS Client SDK",
    label: {
      show: true,
      formatter: "generate sdk",
      fontSize: 10,
      color: "#6EE7B7",
    },
  },
  {
    source: "TS Client SDK",
    target: "Web Client Application",
    label: {
      show: true,
      formatter: "workspace:*",
      fontSize: 10,
      color: "#93C5FD",
    },
  },
  {
    source: "Web Client Application",
    target: "Production Release Bundle",
    label: {
      show: true,
      formatter: "pnpm build",
      fontSize: 10,
      color: "#C4B5FD",
    },
  },
];

const chartOption = computed<EChartsOption>(() => ({
  backgroundColor: "transparent",
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    padding: [10, 14],
    textStyle: { color: "#F8FAFC" },
    formatter: (params: unknown) => {
      const p = params as {
        dataType?: string;
        data?: { name: string; details?: Record<string, string> };
      };
      if (p.dataType === "node" && p.data?.details) {
        const d = p.data.details;
        return `
          <div style="font-family: inherit; font-size: 12px; line-height: 1.6;">
            <div style="font-weight: bold; color: #60A5FA; margin-bottom: 4px; font-size: 13px;">
              ${p.data.name}
            </div>
            <div><span style="color: #94A3B8;">Toolchain:</span> <strong style="color: #F8FAFC;">${d.toolchain}</strong></div>
            <div><span style="color: #94A3B8;">Task Command:</span> <code style="background: rgba(255,255,255,0.1); padding: 1px 4px; border-radius: 4px;">${d.command}</code></div>
            <div><span style="color: #94A3B8;">Artifact Output:</span> ${d.outputs}</div>
            <div style="margin-top: 4px; color: #34D399; font-size: 11px;">⚡ ${d.cacheStatus}</div>
          </div>
        `;
      }
      return "";
    },
  },
  series: [
    {
      type: "graph",
      layout: "none",
      roam: true,
      categories,
      nodes,
      links,
      edgeSymbol: ["none", "arrow"],
      edgeSymbolSize: 8,
      edgeLabel: {
        fontSize: 10,
      },
      lineStyle: {
        color: "rgba(148, 163, 184, 0.6)",
        width: 2,
        curveness: 0.12,
      },
      emphasis: {
        focus: "adjacency",
        lineStyle: {
          width: 3.5,
          color: "#60A5FA",
        },
      },
    },
  ],
}));
</script>

<style scoped>
.dag-chart {
  display: block;
  width: 100%;
  height: 360px;
}

@media (min-width: 640px) {
  .dag-chart {
    height: 400px;
  }
}
</style>
