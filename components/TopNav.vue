<template>
  <nav
    class="fixed left-1/2 top-5 z-50 mx-auto w-[94%] max-w-5xl -translate-x-1/2 rounded-full border border-white/20 bg-slate-950/60 px-3 py-2 shadow-2xl shadow-purple-950/40 ring-1 ring-white/10 backdrop-blur-2xl transition-all duration-300 hover:border-white/30 hover:bg-slate-950/70 sm:px-6 sm:py-2.5"
  >
    <ul class="flex items-center justify-between">
      <li>
        <NuxtLink
          class="relative rounded-full px-2.5 py-1 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white sm:px-3 sm:py-1.5 sm:text-base"
          to="/"
          active-class="!text-yellow-300 !font-semibold bg-white/10 shadow-inner"
        >
          Home
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          class="relative rounded-full px-2.5 py-1 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white sm:px-3 sm:py-1.5 sm:text-base"
          to="/radar"
          active-class="!text-yellow-300 !font-semibold bg-white/10 shadow-inner"
        >
          Radar
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          class="relative rounded-full px-2.5 py-1 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white sm:px-3 sm:py-1.5 sm:text-base"
          to="/blog"
          active-class="!text-yellow-300 !font-semibold bg-white/10 shadow-inner"
        >
          Blog
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          class="relative rounded-full px-2.5 py-1 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white sm:px-3 sm:py-1.5 sm:text-base"
          to="/stack"
          active-class="!text-yellow-300 !font-semibold bg-white/10 shadow-inner"
        >
          Stack
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          class="rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/40 active:scale-95 sm:px-5 sm:py-2 sm:text-sm"
          to="/contact"
          active-class="ring-2 ring-white/80 ring-offset-2 ring-offset-slate-950"
        >
          Contact
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
