<template>
  <nav
    class="mx-auto h-10 w-full rounded-2xl bg-primary bg-opacity-30 p-8 shadow-md shadow-blue-600 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500 md:w-4/5"
  >
    <ul class="flex h-full items-center justify-around font-bold">
      <li>
        <NuxtLink
          class="cursor-pointer duration-500 hover:text-yellow-300"
          to="/"
          active-class="text-yellow-300"
          >Home</NuxtLink
        >
      </li>
      <span class="h-8 border-2 border-yellow-100"></span>
      <li>
        <NuxtLink
          class="cursor-pointer duration-500 hover:text-yellow-300"
          to="/radar"
          active-class="text-yellow-300"
          >Radar</NuxtLink
        >
      </li>
      <span class="h-8 border-2 border-yellow-100"></span>
      <li>
        <NuxtLink
          class="cursor-pointer duration-500 hover:text-yellow-300"
          to="/blog"
          active-class="text-yellow-300"
          >Blog</NuxtLink
        >
      </li>
      <span class="h-8 border-2 border-yellow-100"></span>
      <li>
        <NuxtLink
          class="cursor-pointer rounded-full bg-orange-200 px-3 py-2 font-extrabold text-gray-900 duration-500 hover:bg-opacity-75"
          to="/contact"
          active-class="bg-orange-500"
          >Contact</NuxtLink
        >
      </li>
    </ul>
  </nav>
</template>
