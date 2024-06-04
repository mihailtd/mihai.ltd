<template>
  <main class="pt-16 text-yellow-100">
    <h1>Radar</h1>
    <button @click="selectedView = 'treemap'">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="h-6 w-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
        />
      </svg>
    </button>
    <button @click="selectedView = 'sunburst'">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="h-6 w-6"
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
    </button>
    <client-only>
      <VChart class="chart" :option="options" />
    </client-only>
  </main>
</template>

<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { SunburstChart, TreemapChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { ref } from "vue";
import VChart from "vue-echarts";
use([
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
    blogTopic: "vuejs",
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

// languagesAndFrameworksBy Subcategory using the E Charts expected sysntax object with name prop
// return an array of form [{ name: SubCategoryName, children: [{ name: ItemName }] }]
const languagesAndFrameworksBySubcategory = languagesAndFrameworks.reduce(
  (acc, item) => {
    const subCategory = item.subCategory;
    const subCategoryIndex = acc.findIndex((item) => item.name === subCategory);
    if (subCategoryIndex === -1) {
      acc.push({
        name: subCategory,
        children: [{ ...item, value: 1 }],
      });
    } else {
      acc[subCategoryIndex].children.push({ ...item, value: 1 });
    }
    return acc;
  },
  [],
);

const platformsBySubcategory = platforms.reduce((acc, item) => {
  const subCategory = item.subCategory;
  const subCategoryIndex = acc.findIndex((item) => item.name === subCategory);
  if (subCategoryIndex === -1) {
    acc.push({
      name: subCategory,
      children: [{ name: item.name, value: 1 }],
    });
  } else {
    acc[subCategoryIndex].children.push({ name: item.name, value: 1 });
  }
  return acc;
}, []);

const toolsBySubcategory = tools.reduce((acc, item) => {
  const subCategory = item.subCategory;
  const subCategoryIndex = acc.findIndex((item) => item.name === subCategory);
  if (subCategoryIndex === -1) {
    acc.push({
      name: subCategory,
      children: [{ name: item.name, value: 1 }],
    });
  } else {
    acc[subCategoryIndex].children.push({ name: item.name, value: 1 });
  }
  return acc;
}, []);

const techniquesBySubcategory = techniques.reduce((acc, item) => {
  const subCategory = item.subCategory;
  const subCategoryIndex = acc.findIndex((item) => item.name === subCategory);
  if (subCategoryIndex === -1) {
    acc.push({
      name: subCategory,
      children: [{ name: item.name, value: 1 }],
    });
  } else {
    acc[subCategoryIndex].children.push({ name: item.name, value: 1 });
  }
  return acc;
}, []);

const treemapOption = ref<EChartsOption>({
  darkMode: true,
  animationDuration: 1000,
  animationDurationUpdate: 1000,
  tooltip: {
    show: true,
    enterable: true,
    position: "inside",
    verticalAlign: "bottom",
    alwaysShowContent: true,
    // valueFormatter: function (value) {
    //   console.log(value);
    //   return value;
    // },
    formatter: function (info) {
      const logoImage = `<img class="h-8" src="${info.data.logoPath}"/>`;
      const externalLink = `
        <a href="${info.data.link}" target="${info.data.target}">
          <div class="flex flex-row items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            <span class="pl-2">${info.name} (external)</span>
          </div>
        </a>`;
      const internalLink = `<a class="relative pt-2 pb-4 text-lg text-blue-300 underline decoration-wavy underline-offset-4 transition-colors duration-300 hover:text-blue-500" href="/blog?topic=${info.data.blogTopic}" target="_blank">${info.name} Articles</a>`;
      const detailsSection = `
        <div class="flex flex-col justify-center items-center">
          <div class="flex flex-row w-fit items-center justify-center">${info.data.logoPath ? logoImage : ""}<span class="pl-2 font-bold text-lg">${info.name}</span></div>
          ${info.data.link ? internalLink : ""}
          ${info.data.link ? externalLink : ""}
        </div>
      `;
      return `<div class="flex flex-row p-4">
            ${info.data.link ? detailsSection : info.name}
            </div>`;
    },
  },
  series: [
    {
      type: "treemap",
      id: "radar",
      animationDuration: 1000,
      animationDurationUpdate: 1000,
      roam: true,
      nodeClick: "zoomToNode",
      leafDepth: 2,
      visibleMin: 300,
      data: [
        {
          name: "languages_and_frameworks",
          children: languagesAndFrameworksBySubcategory,
        },
        {
          name: "platforms",
          children: platformsBySubcategory,
        },
      ],
      universalTransition: true,
      label: {
        show: true,
        rich: {
          title: {
            align: "center",
            color: "#fff",
            fontSize: 12,
            lineHeight: 20,
          },
          status: {
            align: "center",
            color: "#fff",
            fontSize: 12,
            lineHeight: 20,
          },
          score: {
            align: "center",
            color: "#fff",
            fontSize: 12,
            lineHeight: 20,
          },
        },
        formatter: [
          "{title| {b}}",
          "{status| {@status} }",
          "{score| {@evaluatedScore} / 4}",
        ].join("\n"),
        // formatter: (value) => {
        //   const confidenceScore = `Confidence: ${value.data.evaluatedScore} / 4`;
        //   const status = `Status: ${value.data.status}`;
        //   return `${value.name}  </n> ${value.data.status ? status : ""} </n> ${value.data.evaluatedScore ? confidenceScore : ""}`;
        // },
      },
      upperLabel: {
        show: true,
      },
      breadcrumb: {
        show: true,
        top: 0,
        emptyItemWidth: 30,
        itemStyle: {
          textStyle: {
            padding: [2, 5],
          },
          borderColor: "#fde047",
          borderWidth: 2,
          borderType: "solid",
        },
      },
      levels: [
        {
          itemStyle: {
            borderColor: "#777",
            borderWidth: 0,
            gapWidth: 1,
          },
          upperLabel: {
            show: false,
          },
        },
        {
          itemStyle: {
            borderColor: "#555",
            borderWidth: 5,
            gapWidth: 1,
          },
          emphasis: {
            itemStyle: {
              borderColor: "#ddd",
            },
          },
        },
        {
          colorSaturation: [0.35, 0.5],
          itemStyle: {
            borderWidth: 5,
            gapWidth: 1,
            borderColorSaturation: 0.6,
          },
        },
      ],
    },
  ],
});
const sunburstOption = ref<EChartsOption>({
  darkMode: true,
  animationDuration: 1000,
  animationDurationUpdate: 1000,
  series: [
    {
      type: "sunburst",
      id: "radar",
      radius: ["20%", "90%"],
      animationDurationUpdate: 1000,
      nodeClick: undefined,
      data: [
        {
          name: "languages_and_frameworks",
          children: languagesAndFrameworksBySubcategory,
        },
        {
          name: "platforms",
          children: platformsBySubcategory,
        },
      ],
      universalTransition: true,
      itemStyle: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,.5)",
      },
      label: {
        show: false,
      },
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

// const option = ref<EChartsOption>({
//   darkMode: true,
//   title: {
//     text: "Technology Radar",
//     left: "center",
//   },
//   series: {
//     label: {
//       show: true,
//     },
//     type: "sunburst",
//     radius: [0, "95%"],
//     data: [
//       {
//         name: "languages_and_frameworks",
//         children: languagesAndFrameworksBySubcategory,
//       },
//       {
//         name: "platforms",
//         children: platformsBySubcategory,
//       },
//       // {
//       //   name: "tools",
//       //   children: tools.map((item) => {
//       //     return { name: item.subCategory };
//       //   }),
//       // },
//       // {
//       //   name: "techniques",
//       //   children: techniques.map((item) => {
//       //     return { name: item.subCategory };
//       //   }),
//       // },
//     ],
//     sort: undefined,
//     emphasis: {
//       focus: "ancestor",
//     },
//     levels: [
//       {},
//       {
//         r0: "15%",
//         r: "35%",
//         itemStyle: {
//           borderWidth: 2,
//         },
//         label: {
//           rotate: "tangential",
//         },
//       },
//       {
//         r0: "35%",
//         r: "70%",
//         label: {
//           align: "right",
//         },
//       },
//       {
//         r0: "70%",
//         r: "72%",
//         label: {
//           position: "outside",
//           padding: 34,
//           silent: false,
//         },
//         itemStyle: {
//           borderWidth: 2,
//         },
//       },
//     ],
//   },
// });
</script>
<style scoped>
.chart {
  width: 100vw;
  min-height: 80vh;
}
</style>
