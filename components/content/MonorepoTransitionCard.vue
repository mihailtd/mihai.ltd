<template>
  <div
    class="my-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-2xl backdrop-blur-xl sm:p-7"
  >
    <!-- Card Header with Toggle for View Mode -->
    <div
      class="mb-6 flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center"
    >
      <div>
        <div class="flex items-center gap-2">
          <span
            class="flex h-2 w-2 animate-pulse rounded-full bg-indigo-400"
          ></span>
          <h4 class="text-base font-bold text-white sm:text-xl">
            When to Transition: Workspaces vs. Monorepo Engines
          </h4>
        </div>
        <p class="mt-1 text-xs text-gray-400">
          Comparing threshold criteria and the impact of distributed computation
          caching
        </p>
      </div>

      <!-- View Mode Buttons -->
      <div class="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200"
          :class="
            activeView === 'all'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-gray-400 hover:text-white'
          "
          @click="activeView = 'all'"
        >
          All
        </button>
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200"
          :class="
            activeView === 'criteria'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-gray-400 hover:text-white'
          "
          @click="activeView = 'criteria'"
        >
          Decision Matrix
        </button>
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200"
          :class="
            activeView === 'benchmark'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-gray-400 hover:text-white'
          "
          @click="activeView = 'benchmark'"
        >
          📊 CI Benchmark
        </button>
      </div>
    </div>

    <!-- View 1: Decision Matrix Cards -->
    <div
      v-if="activeView === 'all' || activeView === 'criteria'"
      class="grid grid-cols-1 gap-6 lg:grid-cols-2"
      :class="activeView === 'all' ? 'mb-8' : ''"
    >
      <!-- Zone 1: Native Workspaces -->
      <div
        class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-slate-900/60 to-transparent p-6 shadow-lg"
      >
        <div>
          <div class="mb-4 flex items-center justify-between">
            <span
              class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300"
            >
              <span>🌱</span> Level 1: Native Workspaces
            </span>
            <span class="font-mono text-xs text-emerald-400/80">pnpm / uv</span>
          </div>

          <h5 class="mb-2 text-lg font-bold text-white">
            Native Workspaces Are Sufficient When:
          </h5>
          <p class="mb-5 text-xs text-gray-400">
            Keep your architecture lightweight. No extra build abstraction
            needed.
          </p>

          <ul class="space-y-3 text-xs text-gray-300">
            <li class="flex items-start gap-2.5">
              <span
                class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"
                >✓</span
              >
              <span
                ><strong>Small repository:</strong> Fewer than 5–8 packages or
                microservices.</span
              >
            </li>
            <li class="flex items-start gap-2.5">
              <span
                class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"
                >✓</span
              >
              <span
                ><strong>Homogeneous stack:</strong> All-TypeScript or
                all-Python code.</span
              >
            </li>
            <li class="flex items-start gap-2.5">
              <span
                class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"
                >✓</span
              >
              <span
                ><strong>Fast CI pipelines:</strong> Full test & build run takes
                under 3–5 minutes.</span
              >
            </li>
            <li class="flex items-start gap-2.5">
              <span
                class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"
                >✓</span
              >
              <span
                ><strong>Linear execution:</strong> Simple task chains without
                complex cross-dependencies.</span
              >
            </li>
          </ul>
        </div>

        <div class="mt-6 border-t border-emerald-500/20 pt-4">
          <p class="text-[11px] font-medium text-emerald-300/90">
            🎯 <strong>Verdict:</strong> Use standard
            <code>pnpm-workspace.yaml</code> or <code>uv</code> workspaces.
            Avoid premature build tooling.
          </p>
        </div>
      </div>

      <!-- Zone 2: Dedicated Monorepo Engines -->
      <div
        class="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/25 via-slate-900/60 to-purple-950/20 p-6 shadow-lg"
      >
        <div>
          <div class="mb-4 flex items-center justify-between">
            <span
              class="inline-flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300"
            >
              <span>🚀</span> Level 2: Monorepo Orchestration
            </span>
            <span class="font-mono text-xs text-blue-400/80"
              >Moon / Turbo / Nx</span
            >
          </div>

          <h5 class="mb-2 text-lg font-bold text-white">
            Graduate to Monorepo Engines When:
          </h5>
          <p class="mb-5 text-xs text-gray-400">
            Computation caching and affected analysis become business-critical.
          </p>

          <ul class="space-y-3 text-xs text-gray-300">
            <li class="flex items-start gap-2.5">
              <span
                class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400"
                >▲</span
              >
              <span
                ><strong>CI bottlenecks:</strong> Pipeline execution times
                exceed 10–15 minutes.</span
              >
            </li>
            <li class="flex items-start gap-2.5">
              <span
                class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400"
                >▲</span
              >
              <span
                ><strong>Redundant work:</strong> Commits re-test unchanged
                modules (needs Git diff affected analysis).</span
              >
            </li>
            <li class="flex items-start gap-2.5">
              <span
                class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400"
                >▲</span
              >
              <span
                ><strong>Distributed Remote Caching:</strong> Need CI and
                developer laptops to instantly reuse build artifacts.</span
              >
            </li>
            <li class="flex items-start gap-2.5">
              <span
                class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400"
                >▲</span
              >
              <span
                ><strong>Polyglot architectures:</strong> Coordinating Python
                backend, TS UI, and Rust/Go binaries.</span
              >
            </li>
          </ul>
        </div>

        <div class="mt-6 border-t border-blue-500/20 pt-4">
          <p class="text-[11px] font-medium text-blue-300/90">
            🎯 <strong>Verdict:</strong> Adopt <strong>Turborepo</strong> for
            pure TS, or <strong>Moon</strong> for polyglot multi-language
            pipelines.
          </p>
        </div>
      </div>
    </div>

    <!-- View 2: ECharts CI Speed Benchmark -->
    <div
      v-if="activeView === 'all' || activeView === 'benchmark'"
      class="space-y-3"
      :class="activeView === 'all' ? 'border-t border-white/10 pt-6' : ''"
    >
      <div class="flex items-center justify-between">
        <h5 class="text-sm font-bold text-white">
          CI Pipeline Run Time: Native Workspaces vs. Monorepo with Remote
          Caching
        </h5>
        <span class="text-xs text-gray-400"
          >Time in Seconds (Lower is better)</span
        >
      </div>

      <div class="relative h-[320px] w-full">
        <client-only>
          <VChart
            class="benchmark-chart"
            :option="benchmarkOption"
            autoresize
          />
          <template #fallback>
            <div
              class="flex h-full w-full items-center justify-center text-xs text-gray-500"
            >
              Loading benchmark chart...
            </div>
          </template>
        </client-only>
      </div>

      <p class="text-center text-xs text-gray-400">
        As the monorepo expands to 15+ packages, native package managers
        re-execute everything (taking 10–24 minutes), whereas smart engines with
        remote caching restore unaffected outputs in
        <strong>under 35 seconds</strong>.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import { use as useECharts } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";

useECharts([
  CanvasRenderer,
  BarChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

const activeView = ref<"all" | "criteria" | "benchmark">("all");

const benchmarkOption = computed<EChartsOption>(() => ({
  backgroundColor: "transparent",
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderColor: "rgba(255, 255, 255, 0.15)",
    textStyle: { color: "#F8FAFC" },
    formatter: (params: unknown) => {
      const items = params as Array<{
        seriesName: string;
        value: number;
        marker: string;
      }>;
      const formatTime = (sec: number) => {
        if (sec < 60) return `${sec}s`;
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}m ${s > 0 ? s + "s" : ""}`;
      };
      let html = `<div style="font-size: 12px; font-weight: bold; margin-bottom: 4px;">CI Pipeline Duration</div>`;
      for (const item of items) {
        html += `<div style="display: flex; justify-content: space-between; gap: 16px; font-size: 11px;">
          <span>${item.marker} ${item.seriesName}</span>
          <strong style="color: #FFFFFF;">${formatTime(item.value)}</strong>
        </div>`;
      }
      return html;
    },
  },
  legend: {
    top: 4,
    textStyle: { color: "#94A3B8", fontSize: 11 },
    data: [
      "Native Workspaces (No Cache)",
      "Moon / Turborepo (Remote Cache Hit)",
    ],
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "6%",
    top: "16%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: ["1 Package", "5 Packages", "15 Packages", "30 Packages"],
    axisLine: { lineStyle: { color: "rgba(255, 255, 255, 0.15)" } },
    axisLabel: { color: "#94A3B8", fontSize: 11 },
  },
  yAxis: {
    type: "value",
    name: "Seconds",
    nameTextStyle: { color: "#64748B", fontSize: 10 },
    axisLine: { lineStyle: { color: "rgba(255, 255, 255, 0.15)" } },
    splitLine: { lineStyle: { color: "rgba(255, 255, 255, 0.05)" } },
    axisLabel: { color: "#64748B", fontSize: 10 },
  },
  series: [
    {
      name: "Native Workspaces (No Cache)",
      type: "bar",
      barWidth: 26,
      itemStyle: {
        color: "#EF4444",
        borderRadius: [6, 6, 0, 0],
      },
      data: [15, 130, 580, 1440],
    },
    {
      name: "Moon / Turborepo (Remote Cache Hit)",
      type: "bar",
      barWidth: 26,
      itemStyle: {
        color: "#3B82F6",
        borderRadius: [6, 6, 0, 0],
      },
      data: [12, 16, 22, 32],
    },
  ],
}));
</script>

<style scoped>
.benchmark-chart {
  display: block;
  width: 100%;
  height: 320px;
}
</style>
