<template>
  <div
    class="relative flex min-h-screen flex-col justify-between overflow-x-hidden"
  >
    <!-- Top Ambient Glow Orbs (gives TopNav rich glass refraction on all pages) -->
    <div
      class="pointer-events-none fixed left-1/2 top-0 -z-10 h-[400px] w-full max-w-7xl -translate-x-1/2 overflow-hidden opacity-90"
    >
      <div
        class="absolute -top-24 left-1/4 h-72 w-96 rounded-full bg-blue-600/25 blur-[120px]"
      ></div>
      <div
        class="absolute -top-20 right-1/4 h-80 w-96 rounded-full bg-purple-600/25 blur-[130px]"
      ></div>
      <div
        class="absolute left-1/2 top-2 h-36 w-[500px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[100px]"
      ></div>
    </div>

    <header class="relative z-50">
      <TopNav />
    </header>

    <div class="flex-1">
      <slot />
    </div>

    <MFooter />
  </div>
</template>
