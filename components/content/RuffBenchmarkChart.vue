<template>
  <figure
    class="my-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl backdrop-blur-xl sm:p-6"
  >
    <!-- Header with metric selector -->
    <div
      class="mb-4 flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center"
    >
      <div>
        <div class="flex items-center gap-2">
          <span
            class="flex h-2 w-2 animate-pulse rounded-full bg-fuchsia-400"
          ></span>
          <p class="text-base font-bold text-white sm:text-lg">
            Python Code Quality Performance & Consolidation
          </p>
        </div>
        <p class="mt-0.5 text-xs text-gray-400">
          Comparing Astral Ruff against the legacy Python linting & formatting
          stack on a 150k LOC codebase
        </p>
      </div>

      <!-- Mode Selector Pills -->
      <div
        class="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-xs"
      >
        <button
          type="button"
          class="rounded-full px-3 py-1 font-semibold transition-all duration-200"
          :class="
            activeView === 'latency'
              ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white'
          "
          @click="activeView = 'latency'"
        >
          ⚡ Execution Time (Cold vs Warm)
        </button>
        <button
          type="button"
          class="rounded-full px-3 py-1 font-semibold transition-all duration-200"
          :class="
            activeView === 'ci'
              ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white'
          "
          @click="activeView = 'ci'"
        >
          ⏱️ CI Pipeline Time
        </button>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="rounded-2xl border border-white/5 bg-white/5 p-3">
        <div class="text-[11px] font-medium text-gray-400">
          Ruff Lint + Format
        </div>
        <div class="text-lg font-extrabold text-fuchsia-400 sm:text-xl">
          ~48 ms
        </div>
        <div class="text-[10px] text-gray-500">Sub-100ms local pre-commit</div>
      </div>
      <div class="rounded-2xl border border-white/5 bg-white/5 p-3">
        <div class="text-[11px] font-medium text-gray-400">
          Legacy Toolchain
        </div>
        <div class="text-lg font-extrabold text-amber-400 sm:text-xl">
          4,280 ms
        </div>
        <div class="text-[10px] text-gray-500">Black + Flake8 + isort</div>
      </div>
      <div class="rounded-2xl border border-white/5 bg-white/5 p-3">
        <div class="text-[11px] font-medium text-gray-400">
          Speed Multiplier
        </div>
        <div class="text-lg font-extrabold text-emerald-400 sm:text-xl">
          89x Faster
        </div>
        <div class="text-[10px] text-gray-500">Zero GIL, pure Rust AST</div>
      </div>
      <div class="rounded-2xl border border-white/5 bg-white/5 p-3">
        <div class="text-[11px] font-medium text-gray-400">
          Tools Consolidated
        </div>
        <div class="text-lg font-extrabold text-blue-400 sm:text-xl">
          6 → 1 Binary
        </div>
        <div class="text-[10px] text-gray-500">
          Replaces isort, flake8, black
        </div>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="relative h-[320px] w-full sm:h-[360px]">
      <client-only>
        <VChart class="benchmark-chart" :option="chartOption" autoresize />
        <template #fallback>
          <div
            class="flex h-full w-full items-center justify-center rounded-2xl bg-white/5 text-xs text-gray-500"
          >
            Loading performance benchmark chart...
          </div>
        </template>
      </client-only>
    </div>

    <!-- Footer tip -->
    <div
      class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3 text-[11px] text-gray-500"
    >
      <span>
        💡 Benchmarked across 150,000 lines of Python on an 8-core Apple Silicon
        / Linux CI runner.
      </span>
      <span class="font-mono text-gray-600"
        >Astral Ruff &bull; Apache ECharts</span
      >
    </div>

    <!-- The chart is a client-only canvas; the same numbers as plain text
         for crawlers, screen readers and AI search. -->
    <figcaption
      class="mt-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-sm leading-relaxed text-gray-300"
    >
      <p>
        <strong class="text-white">Summary:</strong> on a 150,000-line Python
        codebase, Ruff lints and formats in about 48 ms (cold cache) versus
        4,280 ms for the legacy Black + Flake8 + isort suite — roughly 89×
        faster — and cuts a CI lint job from 28.4 s to 0.6 s.
      </p>
      <table class="mt-3 w-full text-left text-xs">
        <caption class="pb-1 text-left font-semibold text-white">
          Local execution time (lower is better)
        </caption>
        <thead class="text-gray-400">
          <tr>
            <th scope="col" class="py-1 pr-4">Tool</th>
            <th scope="col" class="py-1 pr-4">Cold cache</th>
            <th scope="col" class="py-1">Warm cache</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" class="py-1 pr-4 font-medium text-gray-200">
              Ruff check + format
            </th>
            <td class="py-1 pr-4 font-mono">48 ms</td>
            <td class="py-1 font-mono">12 ms</td>
          </tr>
          <tr>
            <th scope="row" class="py-1 pr-4 font-medium text-gray-200">
              Ruff format (standalone)
            </th>
            <td class="py-1 pr-4 font-mono">29 ms</td>
            <td class="py-1 font-mono">8 ms</td>
          </tr>
          <tr>
            <th scope="row" class="py-1 pr-4 font-medium text-gray-200">
              isort (standalone)
            </th>
            <td class="py-1 pr-4 font-mono">780 ms</td>
            <td class="py-1 font-mono">420 ms</td>
          </tr>
          <tr>
            <th scope="row" class="py-1 pr-4 font-medium text-gray-200">
              Flake8 (standalone)
            </th>
            <td class="py-1 pr-4 font-mono">1250 ms</td>
            <td class="py-1 font-mono">850 ms</td>
          </tr>
          <tr>
            <th scope="row" class="py-1 pr-4 font-medium text-gray-200">
              Black (standalone)
            </th>
            <td class="py-1 pr-4 font-mono">2250 ms</td>
            <td class="py-1 font-mono">1100 ms</td>
          </tr>
          <tr>
            <th scope="row" class="py-1 pr-4 font-medium text-gray-200">
              Legacy suite: Black + Flake8 + isort
            </th>
            <td class="py-1 pr-4 font-mono">4280 ms</td>
            <td class="py-1 font-mono">2370 ms</td>
          </tr>
        </tbody>
      </table>
      <table class="mt-3 w-full text-left text-xs">
        <caption class="pb-1 text-left font-semibold text-white">
          CI lint-job wall-clock time
        </caption>
        <tbody>
          <tr>
            <th scope="row" class="py-1 pr-4 font-medium text-gray-200">
              Legacy pipeline (pip install + 4 tools)
            </th>
            <td class="py-1 font-mono">28.4 s</td>
          </tr>
          <tr>
            <th scope="row" class="py-1 pr-4 font-medium text-gray-200">
              Pre-cached Python (Black + Flake8 + isort)
            </th>
            <td class="py-1 font-mono">14.2 s</td>
          </tr>
          <tr>
            <th scope="row" class="py-1 pr-4 font-medium text-gray-200">
              uv pip + Ruff (install + lint + format)
            </th>
            <td class="py-1 font-mono">1.8 s</td>
          </tr>
          <tr>
            <th scope="row" class="py-1 pr-4 font-medium text-gray-200">
              uvx ruff check & format (zero-install cache)
            </th>
            <td class="py-1 font-mono">0.6 s</td>
          </tr>
        </tbody>
      </table>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { EChartsOption } from "echarts";
import { use as useECharts } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart from "vue-echarts";

useECharts([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

const activeView = ref<"latency" | "ci">("latency");

const chartOption = computed<EChartsOption>(() => {
  if (activeView.value === "latency") {
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        borderColor: "rgba(255, 255, 255, 0.15)",
        textStyle: { color: "#F8FAFC", fontSize: 12 },
        formatter: (params: unknown) => {
          const items = (Array.isArray(params) ? params : [params]) as Array<{
            name: string;
            seriesName: string;
            value: number;
            color: string;
          }>;
          if (!items.length || !items[0]) return "";
          let res = `<div class="font-bold border-b border-white/10 pb-1 mb-1.5 text-white">${items[0].name}</div>`;
          items.forEach((item) => {
            res += `<div class="flex items-center justify-between gap-4 py-0.5 text-xs">
              <span class="flex items-center gap-1.5">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${item.color};"></span>
                <span class="text-gray-300">${item.seriesName}</span>
              </span>
              <span class="font-mono font-bold text-white">${item.value} ms</span>
            </div>`;
          });
          return res;
        },
      },
      legend: {
        data: ["Cold Cache", "Warm Cache (Incremental)"],
        textStyle: { color: "#94A3B8", fontSize: 11 },
        top: 0,
        right: 10,
      },
      grid: {
        top: 40,
        left: "3%",
        right: "4%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        name: "Milliseconds (lower is better)",
        nameLocation: "middle",
        nameGap: 30,
        nameTextStyle: { color: "#64748B", fontSize: 11 },
        axisLabel: { color: "#94A3B8", fontSize: 11 },
        splitLine: { lineStyle: { color: "rgba(255, 255, 255, 0.06)" } },
      },
      yAxis: {
        type: "category",
        data: [
          "Ruff check + format",
          "Ruff format standalone",
          "isort standalone",
          "Flake8 standalone",
          "Black standalone",
          "Legacy Multi-tool Suite",
        ],
        axisLabel: {
          color: "#E2E8F0",
          fontSize: 11,
          fontWeight: 600,
        },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "rgba(255, 255, 255, 0.1)" } },
      },
      series: [
        {
          name: "Cold Cache",
          type: "bar",
          data: [
            {
              value: 48,
              itemStyle: {
                color: "#DE5FE9",
                borderRadius: [0, 4, 4, 0],
              },
            },
            {
              value: 29,
              itemStyle: {
                color: "#C084FC",
                borderRadius: [0, 4, 4, 0],
              },
            },
            {
              value: 780,
              itemStyle: {
                color: "#38BDF8",
                borderRadius: [0, 4, 4, 0],
              },
            },
            {
              value: 1250,
              itemStyle: {
                color: "#FACC15",
                borderRadius: [0, 4, 4, 0],
              },
            },
            {
              value: 2250,
              itemStyle: {
                color: "#FB923C",
                borderRadius: [0, 4, 4, 0],
              },
            },
            {
              value: 4280,
              itemStyle: {
                color: "#EF4444",
                borderRadius: [0, 4, 4, 0],
              },
            },
          ],
        },
        {
          name: "Warm Cache (Incremental)",
          type: "bar",
          data: [
            {
              value: 12,
              itemStyle: {
                color: "#A21CAF",
                borderRadius: [0, 4, 4, 0],
              },
            },
            {
              value: 8,
              itemStyle: {
                color: "#7E22CE",
                borderRadius: [0, 4, 4, 0],
              },
            },
            {
              value: 420,
              itemStyle: {
                color: "#0284C7",
                borderRadius: [0, 4, 4, 0],
              },
            },
            {
              value: 850,
              itemStyle: {
                color: "#CA8A04",
                borderRadius: [0, 4, 4, 0],
              },
            },
            {
              value: 1100,
              itemStyle: {
                color: "#C2410C",
                borderRadius: [0, 4, 4, 0],
              },
            },
            {
              value: 2370,
              itemStyle: {
                color: "#B91C1C",
                borderRadius: [0, 4, 4, 0],
              },
            },
          ],
        },
      ],
    };
  }

  // CI Pipeline View
  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "rgba(15, 23, 42, 0.95)",
      borderColor: "rgba(255, 255, 255, 0.15)",
      textStyle: { color: "#F8FAFC", fontSize: 12 },
      formatter: (params: unknown) => {
        const items = (Array.isArray(params) ? params : [params]) as Array<{
          name: string;
          seriesName: string;
          value: number;
          color: string;
        }>;
        if (!items.length || !items[0]) return "";
        let res = `<div class="font-bold border-b border-white/10 pb-1 mb-1.5 text-white">${items[0].name}</div>`;
        items.forEach((item) => {
          res += `<div class="flex items-center justify-between gap-4 py-0.5 text-xs">
            <span class="flex items-center gap-1.5">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${item.color};"></span>
              <span class="text-gray-300">${item.seriesName}</span>
            </span>
            <span class="font-mono font-bold text-white">${item.value} s</span>
          </div>`;
        });
        return res;
      },
    },
    grid: {
      top: 40,
      left: "3%",
      right: "4%",
      bottom: "5%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: [
        "Legacy Pipeline\n(pip install + 4 tools)",
        "Pre-cached Python\n(Black + Flake8 + isort)",
        "uv pip + Ruff\n(install + lint + fmt)",
        "uvx ruff check & format\n(zero-install cache)",
      ],
      axisLabel: { color: "#E2E8F0", fontSize: 11, interval: 0 },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: "rgba(255, 255, 255, 0.1)" } },
    },
    yAxis: {
      type: "value",
      name: "Total Job Wall Clock (Seconds)",
      nameTextStyle: { color: "#64748B", fontSize: 11 },
      axisLabel: { color: "#94A3B8", fontSize: 11 },
      splitLine: { lineStyle: { color: "rgba(255, 255, 255, 0.06)" } },
    },
    series: [
      {
        name: "CI Job Duration",
        type: "bar",
        barWidth: "40%",
        data: [
          {
            value: 28.4,
            itemStyle: {
              color: "#EF4444",
              borderRadius: [6, 6, 0, 0],
            },
          },
          {
            value: 14.2,
            itemStyle: {
              color: "#F59E0B",
              borderRadius: [6, 6, 0, 0],
            },
          },
          {
            value: 1.8,
            itemStyle: {
              color: "#8B5CF6",
              borderRadius: [6, 6, 0, 0],
            },
          },
          {
            value: 0.6,
            itemStyle: {
              color: "#DE5FE9",
              borderRadius: [6, 6, 0, 0],
            },
          },
        ],
      },
    ],
  };
});
</script>

<style scoped>
.benchmark-chart {
  display: block;
  width: 100%;
  height: 320px;
}

@media (min-width: 640px) {
  .benchmark-chart {
    height: 360px;
  }
}
</style>
