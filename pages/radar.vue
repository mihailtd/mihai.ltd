<template>
  <main
    class="relative min-h-screen overflow-hidden pb-16 pt-24 text-yellow-100"
  >
    <!-- Ambient Background Glow -->
    <div
      class="pointer-events-none absolute left-0 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-blue-600/15 blur-[140px]"
    ></div>
    <div
      class="pointer-events-none absolute right-0 top-36 -z-10 h-[500px] w-[500px] translate-x-1/3 rounded-full bg-purple-600/15 blur-[140px]"
    ></div>
    <div
      class="pointer-events-none absolute bottom-20 left-1/3 -z-10 h-[400px] w-[400px] rounded-full bg-emerald-600/10 blur-[130px]"
    ></div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div
        class="mb-10 flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end"
      >
        <div>
          <div
            class="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300"
          >
            <span class="h-2 w-2 animate-pulse rounded-full bg-blue-400"></span>
            Tech Strategy & Evaluation
          </div>
          <h1
            class="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Interactive
            <span
              class="bg-gradient-to-r from-blue-400 via-purple-300 to-amber-300 bg-clip-text text-transparent"
              >Tech Radar</span
            >
          </h1>
          <p class="mt-3 max-w-2xl text-base text-gray-400 sm:text-lg">
            Hands-on evaluations, architectural adoption decisions, and
            engineering tools tracked across enterprise systems and agentic AI
            workflows.
          </p>
        </div>

        <!-- View Switcher Tabs -->
        <div
          class="flex items-center self-start rounded-full border border-white/10 bg-white/5 p-1.5 shadow-lg backdrop-blur-md md:self-end"
        >
          <button
            class="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 sm:text-sm"
            :class="
              selectedView === 'treemap'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'text-gray-400 hover:text-white'
            "
            title="Treemap view"
            @click="selectedView = 'treemap'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-4 w-4"
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
            class="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 sm:text-sm"
            :class="
              selectedView === 'sunburst'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'text-gray-400 hover:text-white'
            "
            title="Concentric Radar view"
            @click="selectedView = 'sunburst'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-4 w-4"
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
          <button
            class="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 sm:text-sm"
            :class="
              selectedView === 'cards'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'text-gray-400 hover:text-white'
            "
            title="Card Directory view"
            @click="selectedView = 'cards'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-4 w-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 17.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            Directory
          </button>
        </div>
      </div>

      <!-- Adoption Progress Bar & Quick Stats -->
      <div
        class="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-md sm:p-6"
      >
        <div
          class="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center"
        >
          <span
            class="text-xs font-semibold uppercase tracking-wider text-gray-400"
          >
            Adoption Lifecycle Distribution
          </span>
          <span class="text-xs text-gray-400">
            <span class="font-bold text-white">{{ allItems.length }}</span>
            technologies monitored
          </span>
        </div>

        <!-- Progress bar segments -->
        <div
          class="flex h-3 w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-white/5"
        >
          <div
            v-for="segment in progressSegments"
            :key="segment.status"
            class="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
            :style="{
              width: segment.percent + '%',
              backgroundColor: segment.color,
            }"
            :title="`${segment.label}: ${segment.count} (${Math.round(segment.percent)}%)`"
          />
        </div>

        <!-- Status filter pill buttons -->
        <div class="mt-4 flex flex-wrap items-center gap-2 pt-1">
          <button
            class="rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200"
            :class="
              selectedStatus === 'all'
                ? 'border-white/40 bg-white/15 text-white shadow-sm'
                : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
            "
            @click="selectedStatus = 'all'"
          >
            All
            <span
              class="ml-1 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-white"
              >{{ allItems.length }}</span
            >
          </button>

          <button
            v-for="segment in progressSegments"
            :key="`filter-${segment.status}`"
            class="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200"
            :class="
              selectedStatus === segment.status
                ? 'text-white shadow-sm'
                : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
            "
            :style="
              selectedStatus === segment.status
                ? {
                    backgroundColor: segment.color + '26',
                    borderColor: segment.color,
                  }
                : {}
            "
            @click="
              selectedStatus =
                selectedStatus === segment.status ? 'all' : segment.status
            "
          >
            <span
              class="h-2 w-2 shrink-0 rounded-full"
              :style="{ backgroundColor: segment.color }"
            />
            {{ segment.label }}
            <span
              class="py-0.2 ml-0.5 rounded-full px-1.5 text-[10px] font-semibold"
              :style="{
                backgroundColor: segment.color + '33',
                color:
                  selectedStatus === segment.status ? '#ffffff' : segment.color,
              }"
            >
              {{ segment.count }}
            </span>
          </button>
        </div>
      </div>

      <!-- Search & Quadrant Filter Bar -->
      <div
        class="mb-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between"
      >
        <!-- Live Search -->
        <div class="relative flex-1">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-400"
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
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search technologies (e.g. Kubernetes, Vue, Python, DuckDB)..."
            class="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-9 text-sm text-white placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            v-if="searchQuery"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
            title="Clear search"
            @click="searchQuery = ''"
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
        </div>

        <!-- Category Quadrants Filter -->
        <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            class="rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-200"
            :class="
              selectedCategory === 'all'
                ? 'border-blue-500/50 bg-blue-500/20 text-blue-200'
                : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
            "
            @click="selectedCategory = 'all'"
          >
            All Quadrants
          </button>

          <button
            v-for="catKey in categoryOrder"
            :key="catKey"
            class="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-200"
            :class="
              selectedCategory === catKey
                ? 'text-white'
                : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
            "
            :style="
              selectedCategory === catKey
                ? {
                    borderColor: categoryMeta[catKey].color,
                    backgroundColor: categoryMeta[catKey].color + '25',
                  }
                : {}
            "
            @click="
              selectedCategory = selectedCategory === catKey ? 'all' : catKey
            "
          >
            <span
              class="h-2 w-2 rounded-full"
              :style="{ backgroundColor: categoryMeta[catKey].color }"
            />
            {{ categoryMeta[catKey].label }}
          </button>
        </div>
      </div>

      <!-- Filter Results Summary Banner -->
      <div
        v-if="
          searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
        "
        class="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-xs text-blue-200"
      >
        <div class="flex items-center gap-2">
          <span
            >Showing
            <strong class="text-white">{{ filteredItems.length }}</strong> of
            {{ allItems.length }} technologies</span
          >
          <span v-if="searchQuery"
            >matching &ldquo;{{ searchQuery }}&rdquo;</span
          >
          <span v-if="selectedCategory !== 'all'"
            >in
            <strong>{{
              categoryMeta[selectedCategory as CategoryKey]?.label
            }}</strong></span
          >
          <span v-if="selectedStatus !== 'all'"
            >with status
            <strong class="capitalize">{{ selectedStatus }}</strong></span
          >
        </div>
        <button
          class="font-semibold text-blue-300 underline hover:text-white"
          @click="resetAllFilters"
        >
          Reset all filters
        </button>
      </div>

      <!-- Chart View (Treemap or Sunburst) -->
      <div
        v-if="selectedView !== 'cards'"
        class="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 shadow-2xl backdrop-blur-md"
      >
        <!-- Interactive Chart Hints -->
        <div
          class="flex items-center justify-between border-b border-white/5 bg-white/5 px-6 py-2.5 text-xs text-gray-400"
        >
          <div class="flex items-center gap-2">
            <span class="text-amber-400">💡</span>
            <span v-if="selectedView === 'treemap'">
              Click a quadrant or group to zoom in. Use the top breadcrumb to
              zoom out. Click any technology for full details.
            </span>
            <span v-else>
              Concentric rings: Category → Subcategory → Technology. Click an
              arc to drill down. Click any technology for full details.
            </span>
          </div>
          <span class="hidden text-gray-500 sm:inline">Interactive Chart</span>
        </div>

        <!-- ECharts Canvas Container -->
        <div v-if="filteredItems.length > 0" class="relative">
          <client-only>
            <VChart
              class="chart"
              :option="options"
              autoresize
              @click="handleChartClick"
            />
          </client-only>
        </div>

        <!-- Empty State for Chart -->
        <div
          v-else
          class="flex flex-col items-center justify-center py-24 text-center"
        >
          <div
            class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-2xl"
          >
            🔍
          </div>
          <h3 class="text-lg font-bold text-white">No technologies found</h3>
          <p class="mt-1 text-sm text-gray-400">
            Try adjusting your search query or clearing status/quadrant filters.
          </p>
          <button
            class="mt-6 rounded-full border border-blue-500/40 bg-blue-600/20 px-5 py-2 text-xs font-semibold text-blue-300 transition-all hover:bg-blue-600/40"
            @click="resetAllFilters"
          >
            Clear all filters
          </button>
        </div>
      </div>

      <!-- Directory (Cards Grid) View -->
      <div v-else>
        <div
          v-if="filteredItems.length > 0"
          class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <div
            v-for="item in filteredItems"
            :key="item.slug"
            class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-slate-800/60 hover:shadow-xl hover:shadow-blue-900/20"
          >
            <!-- Card Header -->
            <div>
              <div class="mb-3 flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <!-- Logo or Monogram -->
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 p-1.5 shadow-inner"
                  >
                    <img
                      v-if="resolveTechLogo(item)"
                      :src="resolveTechLogo(item)"
                      :alt="item.name"
                      class="h-full w-full object-contain"
                    />
                    <span v-else class="text-xs font-bold uppercase text-white">
                      {{ item.name.slice(0, 2) }}
                    </span>
                  </div>

                  <div>
                    <h3
                      class="text-base font-bold text-white transition-colors group-hover:text-blue-300"
                    >
                      {{ item.name }}
                    </h3>
                    <p class="text-[11px] text-gray-400">
                      {{ formatPlacements(item.placements) }}
                    </p>
                  </div>
                </div>

                <!-- Status Pill -->
                <span
                  class="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset"
                  :class="[
                    getRadarStatusMeta(
                      getEffectiveStatus(item.stage, item.decision),
                    ).bg,
                    getRadarStatusMeta(
                      getEffectiveStatus(item.stage, item.decision),
                    ).text,
                    getRadarStatusMeta(
                      getEffectiveStatus(item.stage, item.decision),
                    ).ring,
                  ]"
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full"
                    :style="{
                      backgroundColor: getRadarStatusMeta(
                        getEffectiveStatus(item.stage, item.decision),
                      ).color,
                    }"
                  />
                  {{
                    getRadarStatusMeta(
                      getEffectiveStatus(item.stage, item.decision),
                    ).label
                  }}
                </span>
              </div>

              <!-- Description -->
              <p
                v-if="item.description"
                class="line-clamp-2 text-xs leading-relaxed text-gray-300"
              >
                {{ item.description }}
              </p>

              <!-- Progress & Satisfaction Meters -->
              <div class="mt-4 space-y-2 border-t border-white/5 pt-3 text-xs">
                <div class="flex items-center justify-between text-gray-400">
                  <span>Confidence:</span>
                  <div class="flex items-center gap-2">
                    <div class="flex w-16 items-center gap-1">
                      <span
                        v-for="step in 4"
                        :key="step"
                        class="h-1.5 flex-1 rounded-full"
                        :class="
                          step <= item.evaluatedScore ? '' : 'bg-white/10'
                        "
                        :style="
                          step <= item.evaluatedScore
                            ? {
                                backgroundColor: getRadarStatusMeta(
                                  getEffectiveStatus(item.stage, item.decision),
                                ).color,
                              }
                            : {}
                        "
                      />
                    </div>
                    <span class="font-medium text-white"
                      >{{ item.evaluatedScore }}/4</span
                    >
                  </div>
                </div>

                <div
                  v-if="item.satisfaction != null"
                  class="flex items-center justify-between text-gray-400"
                >
                  <span>Satisfaction:</span>
                  <div class="flex items-center gap-1">
                    <span class="text-amber-400">
                      {{ "★".repeat(Math.round(item.satisfaction)) }}
                    </span>
                    <span class="text-slate-600">
                      {{ "☆".repeat(5 - Math.round(item.satisfaction)) }}
                    </span>
                    <span class="ml-1 text-[11px] font-medium text-white"
                      >{{ item.satisfaction }}/5</span
                    >
                  </div>
                </div>

                <!-- Revisit or In Favor Of note -->
                <div
                  v-if="item.decisionInFavorOf"
                  class="text-[11px] text-gray-400"
                >
                  In favor of:
                  <span class="font-semibold text-blue-300">{{
                    getFavorOfName(item.decisionInFavorOf)
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Card Actions -->
            <div
              class="mt-5 flex items-center justify-between border-t border-white/5 pt-3"
            >
              <NuxtLink
                :to="`/blog/${item.slug}`"
                class="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 transition-colors hover:text-blue-300"
              >
                <span>Read Report</span>
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
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </NuxtLink>

              <button
                class="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-gray-300 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                @click="openModal(item)"
              >
                Quick View
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State for Directory -->
        <div
          v-else
          class="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-black/30 py-24 text-center"
        >
          <div
            class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-2xl"
          >
            🔍
          </div>
          <h3 class="text-lg font-bold text-white">No technologies found</h3>
          <p class="mt-1 text-sm text-gray-400">
            No results match your active search and filter combinations.
          </p>
          <button
            class="mt-6 rounded-full border border-blue-500/40 bg-blue-600/20 px-5 py-2 text-xs font-semibold text-blue-300 transition-all hover:bg-blue-600/40"
            @click="resetAllFilters"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </div>

    <!-- Quick View Detail Modal / Slide-Over -->
    <Teleport to="body">
      <div
        v-if="selectedTech"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md transition-opacity"
        @click.self="selectedTech = null"
      >
        <div
          class="relative w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          role="dialog"
          aria-modal="true"
        >
          <!-- Close button -->
          <button
            class="absolute right-5 top-5 rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            title="Close modal"
            @click="selectedTech = null"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Modal Header -->
          <div class="flex items-center gap-4 border-b border-white/10 pb-5">
            <div
              class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-2 shadow-inner"
            >
              <img
                v-if="resolveTechLogo(selectedTech)"
                :src="resolveTechLogo(selectedTech)"
                :alt="selectedTech.name"
                class="h-full w-full object-contain"
              />
              <span v-else class="text-base font-bold uppercase text-white">
                {{ selectedTech.name.slice(0, 2) }}
              </span>
            </div>

            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-2xl font-bold text-white">
                  {{ selectedTech.name }}
                </h2>
                <span
                  class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset"
                  :class="[
                    getRadarStatusMeta(
                      getEffectiveStatus(
                        selectedTech.stage,
                        selectedTech.decision,
                      ),
                    ).bg,
                    getRadarStatusMeta(
                      getEffectiveStatus(
                        selectedTech.stage,
                        selectedTech.decision,
                      ),
                    ).text,
                    getRadarStatusMeta(
                      getEffectiveStatus(
                        selectedTech.stage,
                        selectedTech.decision,
                      ),
                    ).ring,
                  ]"
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full"
                    :style="{
                      backgroundColor: getRadarStatusMeta(
                        getEffectiveStatus(
                          selectedTech.stage,
                          selectedTech.decision,
                        ),
                      ).color,
                    }"
                  />
                  {{
                    getRadarStatusMeta(
                      getEffectiveStatus(
                        selectedTech.stage,
                        selectedTech.decision,
                      ),
                    ).label
                  }}
                </span>
              </div>
              <p class="mt-1 text-xs text-gray-400">
                {{ formatPlacements(selectedTech.placements) }}
              </p>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="my-6 space-y-4 text-sm text-gray-300">
            <p
              v-if="selectedTech.description"
              class="text-sm leading-relaxed text-gray-200"
            >
              {{ selectedTech.description }}
            </p>

            <div
              class="space-y-3 rounded-2xl border border-white/5 bg-white/5 p-4"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">Evaluation Stage</span>
                <span
                  class="text-xs font-semibold uppercase tracking-wider text-white"
                >
                  {{ getRadarStatusMeta(selectedTech.stage).label }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">Confidence Score</span>
                <div class="flex items-center gap-2">
                  <div class="flex w-20 items-center gap-1">
                    <span
                      v-for="step in 4"
                      :key="step"
                      class="h-1.5 flex-1 rounded-full"
                      :class="
                        step <= selectedTech.evaluatedScore ? '' : 'bg-white/10'
                      "
                      :style="
                        step <= selectedTech.evaluatedScore
                          ? {
                              backgroundColor: getRadarStatusMeta(
                                getEffectiveStatus(
                                  selectedTech.stage,
                                  selectedTech.decision,
                                ),
                              ).color,
                            }
                          : {}
                      "
                    />
                  </div>
                  <span class="text-xs font-medium text-white"
                    >{{ selectedTech.evaluatedScore }}/4</span
                  >
                </div>
              </div>

              <div
                v-if="selectedTech.satisfaction != null"
                class="flex items-center justify-between"
              >
                <span class="text-xs text-gray-400">Team Satisfaction</span>
                <div class="flex items-center gap-1.5">
                  <span class="text-amber-400">
                    {{ "★".repeat(Math.round(selectedTech.satisfaction)) }}
                  </span>
                  <span class="text-slate-600">
                    {{ "☆".repeat(5 - Math.round(selectedTech.satisfaction)) }}
                  </span>
                  <span class="text-xs font-medium text-white"
                    >{{ selectedTech.satisfaction }}/5</span
                  >
                </div>
              </div>
            </div>

            <!-- Decision Quote -->
            <div
              v-if="selectedTech.decisionReason"
              class="rounded-xl border border-white/10 bg-slate-800/50 p-3.5 text-xs italic text-gray-300"
            >
              &ldquo;{{ selectedTech.decisionReason }}&rdquo;
            </div>

            <!-- Revisit trigger -->
            <div
              v-if="selectedTech.reviewTrigger"
              class="flex items-start gap-2 rounded-xl border border-orange-500/20 bg-orange-500/10 p-3 text-xs text-orange-200"
            >
              <span class="font-bold">Revisit trigger:</span>
              <span>{{ selectedTech.reviewTrigger }}</span>
            </div>

            <!-- In Favor Of Target -->
            <div
              v-if="selectedTech.decisionInFavorOf"
              class="flex items-center justify-between rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs"
            >
              <span class="text-gray-300">Decision made in favor of:</span>
              <NuxtLink
                :to="`/blog/${selectedTech.decisionInFavorOf}`"
                class="font-semibold text-blue-400 underline hover:text-blue-300"
                @click="selectedTech = null"
              >
                {{ getFavorOfName(selectedTech.decisionInFavorOf) }} →
              </NuxtLink>
            </div>
          </div>

          <!-- Modal Actions -->
          <div
            class="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-end"
          >
            <a
              v-if="selectedTech.link"
              :href="selectedTech.link"
              :target="selectedTech.target ?? '_blank'"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <span>Official Website</span>
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>

            <NuxtLink
              :to="`/blog/${selectedTech.slug}`"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500"
              @click="selectedTech = null"
            >
              <span>Read Full Tech Report</span>
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
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { useHead, useSeoMeta } from "#app";
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
import { computed, onMounted, onUnmounted, ref } from "vue";
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

// Known tech logo mappings to public assets
const techLogoMap: Record<string, string> = {
  kubernetes: "/images/kubernetes-svgrepo-com.svg",
  "docker-compose": "/images/docker-svgrepo-com.svg",
  "docker-desktop": "/images/docker-svgrepo-com.svg",
  "docker-swarm": "/images/docker-svgrepo-com.svg",
  nodejs: "/images/nodejs-icon-svgrepo-com.svg",
  python: "/images/python-svgrepo-com.svg",
  javascript: "/images/javascript-svgrepo-com.svg",
  typescript: "/images/typescript-official-svgrepo-com.svg",
  vuejs: "/images/vue-9-logo-svgrepo-com.svg",
  nuxtjs: "/images/nuxt-svgrepo-com.svg",
  argocd: "/images/argo-cd.svg",
  aws: "/images/aws-light.svg",
  azure: "/images/azure.svg",
  gcp: "/images/google-cloud.svg",
  cypress: "/images/cypress-svgrepo-com.svg",
  gitlab: "/images/gitlab-svgrepo-com.svg",
  github: "/images/github-142-svgrepo-com.svg",
  duckdb: "/images/DuckDB_icon-darkmode.svg",
  "claude-code": "/images/Claude_AI_symbol.svg.webp",
  fastapi: "/images/fastapi.svg",
  bun: "/images/bun-logo.svg",
  redis: "/images/redis-logo-svgrepo-com.svg",
  postgresql: "/images/postgresql-svgrepo-com.svg",
  mongodb: "/images/mongo-svgrepo-com.svg",
  graphql: "/images/graphql-svgrepo-com.svg",
  "google-antigravity": "/images/mcp.png",
};

const resolveTechLogo = (
  item?: RadarItem | Partial<RadarLeaf> | null,
): string | undefined => {
  if (!item) return undefined;
  if (item.logoPath) return item.logoPath;
  if (item.slug && techLogoMap[item.slug]) return techLogoMap[item.slug];
  return undefined;
};

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

const asRadarLeaf = (data: unknown): Partial<RadarLeaf> | undefined =>
  data && typeof data === "object" ? (data as Partial<RadarLeaf>) : undefined;

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

const getFavorOfName = (slug?: string) => {
  if (!slug) return "";
  return itemsBySlug.value.get(slug)?.name ?? slug;
};

const formatPlacements = (placements?: RadarPlacement[]) => {
  if (!placements || placements.length === 0) return "";
  return placements
    .map(
      (p) =>
        `${categoryMeta[p.category as CategoryKey]?.label ?? p.category} / ${p.subCategory}`,
    )
    .join(" · ");
};

type CategoryKey =
  "languages_and_frameworks" | "platforms" | "tools" | "techniques";

const categoryMeta: Record<CategoryKey, { label: string; color: string }> = {
  languages_and_frameworks: {
    label: "Languages & Frameworks",
    color: "#3b82f6", // blue-500
  },
  platforms: { label: "Platforms", color: "#a855f7" }, // purple-500
  tools: { label: "Tools", color: "#f59e0b" }, // amber-500
  techniques: { label: "Techniques", color: "#10b981" }, // emerald-500
};

const categoryOrder = Object.keys(categoryMeta) as CategoryKey[];

// Filter States
const selectedStatus = ref<StatusKey | "all">("all");
const selectedCategory = ref<CategoryKey | "all">("all");
const searchQuery = ref("");
type ChartType = "sunburst" | "treemap" | "cards";
const selectedView = ref<ChartType>("treemap");

const resetAllFilters = () => {
  selectedStatus.value = "all";
  selectedCategory.value = "all";
  searchQuery.value = "";
};

// Modal Detail State
const selectedTech = ref<RadarItem | null>(null);

const openModal = (item: RadarItem) => {
  selectedTech.value = item;
};

// Handle ESC key to close modal
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && selectedTech.value) {
    selectedTech.value = null;
  }
};

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeydown);
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", handleKeydown);
  }
});

const handleChartClick = (param: { data?: unknown }) => {
  const leaf = asRadarLeaf(param?.data);
  if (leaf?.slug) {
    const fullItem = itemsBySlug.value.get(leaf.slug);
    if (fullItem) {
      selectedTech.value = fullItem;
    }
  }
};

const filteredItems = computed(() => {
  let items = allItems.value;

  // Status Filter
  if (selectedStatus.value !== "all") {
    items = items.filter(
      (item) =>
        getEffectiveStatus(item.stage, item.decision) === selectedStatus.value,
    );
  }

  // Category Filter
  if (selectedCategory.value !== "all") {
    items = items.filter((item) =>
      item.placements.some((p) => p.category === selectedCategory.value),
    );
  }

  // Search Filter
  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    items = items.filter((item) => {
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q) ?? false;
      const matchSub = item.placements.some((p) =>
        p.subCategory.toLowerCase().includes(q),
      );
      return matchName || matchDesc || matchSub;
    });
  }

  return items;
});

const toLeaf = (item: RadarItem): RadarLeaf => ({
  ...item,
  value: 1,
  itemStyle: {
    borderColor: getRadarStatusMeta(
      getEffectiveStatus(item.stage, item.decision),
    ).color,
    borderWidth: 3,
    opacity: item.decision === "reject" ? 0.5 : 1,
  },
});

const chartData = computed(() => {
  const byCategory = new Map<string, Map<string, RadarLeaf[]>>();

  for (const item of filteredItems.value) {
    for (const placement of item.placements) {
      if (
        selectedCategory.value !== "all" &&
        placement.category !== selectedCategory.value
      ) {
        continue;
      }
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

const tooltipFormatter = (rawParams: unknown): string => {
  const params = Array.isArray(rawParams) ? rawParams[0] : rawParams;
  const name = (params as { name?: string } | undefined)?.name;
  const leaf = asRadarLeaf((params as { data?: unknown } | undefined)?.data);

  if (!leaf?.stage) return "";

  const effectiveStatus = getEffectiveStatus(leaf.stage, leaf.decision);
  const meta = getRadarStatusMeta(effectiveStatus);
  const stageLabel = getRadarStatusMeta(leaf.stage).label;
  const score = Number(leaf.evaluatedScore) || 0;
  const slug = leaf.slug;

  const logoSrc = resolveTechLogo(leaf);
  const logoImage = logoSrc
    ? `<img class="h-8 w-8 object-contain rounded-md p-0.5 bg-white/5 border border-white/10" src="${logoSrc}"/>`
    : `<div class="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center text-xs font-bold text-white">${(name ?? "").slice(0, 2)}</div>`;

  const externalLink = leaf.link
    ? `
      <a href="${leaf.link}" target="${leaf.target ?? "_blank"}" rel="noopener noreferrer" class="mt-2 flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
        <span>Official Documentation</span>
      </a>`
    : "";

  const internalLink = slug
    ? `<a class="mt-1 text-xs font-medium text-blue-400 hover:text-blue-300 underline decoration-wavy underline-offset-4 transition-colors" href="/blog/${slug}">Read Tech Report →</a>`
    : "";

  const favorOfTarget = leaf.decisionInFavorOf
    ? itemsBySlug.value.get(leaf.decisionInFavorOf)
    : undefined;

  const favorOfRow = favorOfTarget
    ? `
      <div class="flex items-center justify-between gap-4">
        <span class="text-gray-400">In favor of:</span>
        <a href="/blog/${favorOfTarget.slug}" class="font-medium text-blue-400 hover:text-blue-300">${favorOfTarget.name} →</a>
      </div>`
    : "";

  const reviewTriggerRow =
    leaf.decision === "hold" && leaf.reviewTrigger
      ? `
      <div>
        <span class="text-gray-400">Revisit when:</span>
        <p class="mt-0.5 line-clamp-2 font-medium text-white">${leaf.reviewTrigger}</p>
      </div>`
      : "";

  const satisfactionRow =
    leaf.satisfaction != null
      ? `
      <div class="flex items-center justify-between gap-4">
        <span class="text-gray-400">Satisfaction:</span>
        <div class="flex items-center gap-2">
          ${satisfactionStarsHtml(leaf.satisfaction)}
          <span class="text-xs font-medium text-white">${leaf.satisfaction}/5</span>
        </div>
      </div>`
      : "";

  const decisionReasonParagraph = leaf.decisionReason
    ? `<p class="line-clamp-3 text-xs italic leading-relaxed text-gray-400 border-t border-slate-700/60 pt-2">&ldquo;${leaf.decisionReason}&rdquo;</p>`
    : "";

  const decidedCaption =
    leaf.decision && leaf.decidedDate
      ? `<span class="ml-1.5 text-[10px] font-normal normal-case text-gray-500">· ${formatDecidedDate(leaf.decidedDate)}</span>`
      : "";

  return `
    <div class="bg-slate-900/95 p-4 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-xl w-80 max-w-full break-words">
      <div class="flex items-center gap-3 mb-3">
        ${logoImage}
        <div class="flex-1 min-w-0">
          <div class="font-bold text-base text-white truncate">${name}</div>
          <div class="text-[10px] text-gray-400 uppercase tracking-wider">${stageLabel}</div>
        </div>
      </div>
      <div class="space-y-2 text-xs text-gray-300">
        <div class="flex items-center justify-between gap-4">
          <span class="text-gray-400">Status:</span>
          <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${meta.bg} ${meta.text} ${meta.ring}">${meta.label}${decidedCaption}</span>
        </div>
        <div class="flex items-center justify-between gap-4">
          <span class="text-gray-400">Confidence:</span>
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
      <div class="mt-3 pt-3 border-t border-slate-700 flex flex-col gap-1">
        ${internalLink}
        ${externalLink}
        <div class="mt-1 text-[10px] text-gray-500 italic">Click node for full details modal</div>
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
    confine: true,
    transitionDuration: 0.2,
    extraCssText:
      "width: 320px; max-width: 85vw; white-space: normal; overflow: hidden; z-index: 40;",
    formatter: tooltipFormatter,
  },
  series: [
    {
      type: "treemap",
      id: "radar",
      animationDuration: 800,
      animationDurationUpdate: 600,
      roam: false,
      nodeClick: "zoomToNode",
      leafDepth: 2,
      visibleMin: 300,
      data: chartData.value,
      universalTransition: true,
      label: {
        show: true,
        formatter: (param) => {
          const isRejected = asRadarLeaf(param.data)?.decision === "reject";
          return `${isRejected ? "⊘ " : ""}${param.name}`;
        },
        color: "#fff",
        fontSize: 13,
        fontWeight: "bold",
      },
      upperLabel: {
        show: true,
        height: 28,
        color: "#fff",
        backgroundColor: "rgba(0,0,0,0.3)",
      },
      itemStyle: {
        borderColor: "#0f172a",
        borderWidth: 2,
        gapWidth: 2,
      },
      breadcrumb: {
        show: true,
        top: 12,
        left: 12,
        height: 28,
        emptyItemWidth: 28,
        itemStyle: {
          color: "rgba(15, 23, 42, 0.8)",
          borderColor: "rgba(255, 255, 255, 0.2)",
          borderWidth: 1,
          shadowBlur: 0,
          textStyle: {
            color: "#fff",
            fontSize: 12,
          },
        },
      },
      levels: [
        {
          itemStyle: {
            borderColor: "#090025",
            borderWidth: 0,
            gapWidth: 4,
          },
          upperLabel: {
            show: false,
          },
        },
        {
          itemStyle: {
            borderColor: "#1e293b",
            borderWidth: 2,
            gapWidth: 2,
          },
          emphasis: {
            itemStyle: {
              borderColor: "#60a5fa",
            },
          },
        },
        {
          colorSaturation: [0.35, 0.55],
          itemStyle: {
            borderWidth: 1.5,
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
    confine: true,
    transitionDuration: 0.2,
    extraCssText:
      "width: 320px; max-width: 85vw; white-space: normal; overflow: hidden; z-index: 40;",
    formatter: tooltipFormatter,
  },
  series: [
    {
      type: "sunburst",
      id: "radar",
      radius: ["14%", "90%"],
      animationDurationUpdate: 800,
      nodeClick: "rootToNode",
      data: chartData.value,
      universalTransition: true,
      itemStyle: {
        borderWidth: 1.5,
        borderColor: "#0f172a",
        borderRadius: 4,
      },
      label: {
        show: true,
        rotate: "radial",
        color: "#fff",
        fontSize: 11,
        formatter: (param) => {
          const leaf = asRadarLeaf(param.data);
          if (leaf?.stage == null) return param.name;
          const isRejected = leaf.decision === "reject";
          const label = `${isRejected ? "⊘ " : ""}${param.name}`;
          return label.length > 12 ? label.slice(0, 11) + "…" : label;
        },
      },
      levels: [
        {},
        {
          r0: "14%",
          r: "38%",
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
          r0: "38%",
          r: "68%",
          label: {
            align: "right",
            fontSize: 11,
          },
        },
        {
          r0: "68%",
          r: "90%",
          label: {
            position: "outside",
            padding: 3,
            silent: false,
            fontSize: 10,
          },
          itemStyle: {
            borderWidth: 2.5,
          },
        },
      ],
    },
  ],
}));

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
  height: 75vh;
  min-height: 550px;
  width: 100%;
}

@media (max-width: 640px) {
  .chart {
    height: 60vh;
    min-height: 440px;
  }
}
</style>
