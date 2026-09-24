<template>
  <div
    class="my-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl backdrop-blur-xl sm:p-6"
  >
    <div class="mb-5 border-b border-white/10 pb-4">
      <div class="flex items-center gap-2">
        <span class="flex h-2 w-2 rounded-full bg-purple-400"></span>
        <h4 class="text-base font-bold text-white sm:text-lg">
          The Astral Toolchain Consolidation
        </h4>
      </div>
      <p class="mt-0.5 text-xs text-gray-400">
        How 6 disjointed Python tools and virtual environment overhead collapse
        into a single Rust binary
      </p>
    </div>

    <!-- Consolidation Matrix Grid -->
    <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      <!-- Tool 1: Black -->
      <div
        class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:border-fuchsia-500/40 hover:bg-white/10"
      >
        <div class="flex items-center justify-between pb-2">
          <div class="flex items-center gap-2">
            <span
              class="text-xs font-bold text-amber-300 line-through opacity-70"
              >Black</span
            >
            <span class="text-xs text-gray-500">→</span>
            <span class="text-xs font-bold text-fuchsia-300">ruff format</span>
          </div>
          <span
            class="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400"
            >99.9% Parity</span
          >
        </div>
        <p class="text-xs leading-relaxed text-gray-400">
          Drop-in replacement for Black's opinionated formatting. Runs 30-100x
          faster, respects PEP 8, and removes git pre-commit friction.
        </p>
        <div class="mt-2 font-mono text-[10px] text-gray-500">
          Rule: <span class="text-fuchsia-400">ruff format .</span>
        </div>
      </div>

      <!-- Tool 2: isort -->
      <div
        class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:border-fuchsia-500/40 hover:bg-white/10"
      >
        <div class="flex items-center justify-between pb-2">
          <div class="flex items-center gap-2">
            <span
              class="text-xs font-bold text-amber-300 line-through opacity-70"
              >isort</span
            >
            <span class="text-xs text-gray-500">→</span>
            <span class="text-xs font-bold text-fuchsia-300"
              >ruff check --select I</span
            >
          </div>
          <span
            class="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-400"
            >Built-in</span
          >
        </div>
        <p class="text-xs leading-relaxed text-gray-400">
          Deterministic import sorting directly integrated into AST traversal.
          Eliminates configuration drift between formatter and isort.
        </p>
        <div class="mt-2 font-mono text-[10px] text-gray-500">
          Rule: <span class="text-fuchsia-400">select = ["I"]</span>
        </div>
      </div>

      <!-- Tool 3: Flake8 + 50 Plugins -->
      <div
        class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:border-fuchsia-500/40 hover:bg-white/10"
      >
        <div class="flex items-center justify-between pb-2">
          <div class="flex items-center gap-2">
            <span
              class="text-xs font-bold text-amber-300 line-through opacity-70"
              >Flake8 + Plugins</span
            >
            <span class="text-xs text-gray-500">→</span>
            <span class="text-xs font-bold text-fuchsia-300">ruff check</span>
          </div>
          <span
            class="rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-400"
            >800+ Rules</span
          >
        </div>
        <p class="text-xs leading-relaxed text-gray-400">
          Replaces flake8-bugbear, flake8-comprehensions, flake8-simplify, and
          pycodestyle with instant native Rust equivalents.
        </p>
        <div class="mt-2 font-mono text-[10px] text-gray-500">
          Rule:
          <span class="text-fuchsia-400">select = ["E", "F", "B", "SIM"]</span>
        </div>
      </div>

      <!-- Tool 4: pyupgrade -->
      <div
        class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:border-fuchsia-500/40 hover:bg-white/10"
      >
        <div class="flex items-center justify-between pb-2">
          <div class="flex items-center gap-2">
            <span
              class="text-xs font-bold text-amber-300 line-through opacity-70"
              >pyupgrade</span
            >
            <span class="text-xs text-gray-500">→</span>
            <span class="text-xs font-bold text-fuchsia-300"
              >ruff check --select UP</span
            >
          </div>
          <span
            class="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400"
            >Auto-Modernizer</span
          >
        </div>
        <p class="text-xs leading-relaxed text-gray-400">
          Automatically modernizes legacy syntax to target Python (e.g.
          <code class="text-gray-300">typing.List</code> →
          <code class="text-emerald-400">list</code>, f-strings, pipe unions).
        </p>
        <div class="mt-2 font-mono text-[10px] text-gray-500">
          Rule: <span class="text-fuchsia-400">select = ["UP"]</span>
        </div>
      </div>

      <!-- Tool 5: autoflake -->
      <div
        class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:border-fuchsia-500/40 hover:bg-white/10"
      >
        <div class="flex items-center justify-between pb-2">
          <div class="flex items-center gap-2">
            <span
              class="text-xs font-bold text-amber-300 line-through opacity-70"
              >autoflake</span
            >
            <span class="text-xs text-gray-500">→</span>
            <span class="text-xs font-bold text-fuchsia-300"
              >ruff check --fix</span
            >
          </div>
          <span
            class="rounded bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-sky-400"
            >Zero Dead Code</span
          >
        </div>
        <p class="text-xs leading-relaxed text-gray-400">
          Strips unused imports, removes dead variables, and safely trims
          unreferenced definitions in a single pass.
        </p>
        <div class="mt-2 font-mono text-[10px] text-gray-500">
          Rule: <span class="text-fuchsia-400">select = ["F401", "F841"]</span>
        </div>
      </div>

      <!-- Tool 6: pydocstyle -->
      <div
        class="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:border-fuchsia-500/40 hover:bg-white/10"
      >
        <div class="flex items-center justify-between pb-2">
          <div class="flex items-center gap-2">
            <span
              class="text-xs font-bold text-amber-300 line-through opacity-70"
              >pydocstyle</span
            >
            <span class="text-xs text-gray-500">→</span>
            <span class="text-xs font-bold text-fuchsia-300"
              >ruff check --select D</span
            >
          </div>
          <span
            class="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400"
            >PEP 257</span
          >
        </div>
        <p class="text-xs leading-relaxed text-gray-400">
          Enforces standard docstring conventions (Google, NumPy, Sphinx)
          without requiring heavyweight external AST parsers.
        </p>
        <div class="mt-2 font-mono text-[10px] text-gray-500">
          Rule: <span class="text-fuchsia-400">select = ["D"]</span>
        </div>
      </div>
    </div>

    <!-- The Astral Trilogy Banner -->
    <div
      class="mt-4 rounded-2xl border border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-950/40 via-purple-950/30 to-blue-950/40 p-4 backdrop-blur-md"
    >
      <div
        class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"
      >
        <div>
          <div
            class="text-xs font-bold uppercase tracking-wider text-fuchsia-300"
          >
            The Complete Astral Ecosystem
          </div>
          <div class="mt-0.5 text-xs text-gray-300">
            A unified Rust architecture transforming the Python developer
            experience:
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <NuxtLink
            to="/blog/uv"
            class="inline-flex items-center gap-1.5 rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/10 px-2.5 py-1 font-semibold text-fuchsia-200 transition-colors hover:bg-fuchsia-500/20"
          >
            <span>📦</span> <span>uv (Packaging)</span>
          </NuxtLink>
          <NuxtLink
            to="/blog/ruff"
            class="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 font-semibold text-purple-200 transition-colors hover:bg-purple-500/20"
          >
            <span>⚡</span> <span>Ruff (Quality)</span>
          </NuxtLink>
          <NuxtLink
            to="/blog/ty"
            class="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 font-semibold text-blue-200 transition-colors hover:bg-blue-500/20"
          >
            <span>🎯</span> <span>ty (Typecheck)</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
