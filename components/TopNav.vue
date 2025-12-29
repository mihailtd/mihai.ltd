<template>
  <nav
    class="fixed left-1/2 top-6 z-50 mx-auto w-[95%] max-w-5xl -translate-x-1/2 rounded-full border border-white/10 bg-primary/60 p-4 shadow-lg shadow-purple-900/20 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:shadow-purple-900/40"
  >
    <ul class="flex items-center justify-between px-6 sm:px-10">
      <li>
        <NuxtLink
          class="group relative px-2 py-1 text-base font-medium text-gray-300 transition-colors duration-300 hover:text-white sm:text-lg"
          to="/"
          active-class="!text-yellow-300"
        >
          Home
          <span
            class="absolute -bottom-1 left-0 h-0.5 w-0 bg-yellow-300 transition-all duration-300 group-hover:w-full"
          ></span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          class="group relative px-2 py-1 text-base font-medium text-gray-300 transition-colors duration-300 hover:text-white sm:text-lg"
          to="/radar"
          active-class="!text-yellow-300"
        >
          Radar
          <span
            class="absolute -bottom-1 left-0 h-0.5 w-0 bg-yellow-300 transition-all duration-300 group-hover:w-full"
          ></span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          class="group relative px-2 py-1 text-base font-medium text-gray-300 transition-colors duration-300 hover:text-white sm:text-lg"
          to="/blog"
          active-class="!text-yellow-300"
        >
          Blog
          <span
            class="absolute -bottom-1 left-0 h-0.5 w-0 bg-yellow-300 transition-all duration-300 group-hover:w-full"
          ></span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          class="rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-6 py-2.5 text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 active:scale-95 sm:text-lg"
          to="/contact"
          active-class="ring-2 ring-white ring-offset-2 ring-offset-transparent"
        >
          Contact
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
