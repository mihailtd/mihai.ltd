<template>
  <div class="h-full">
    <header
      class="hero min-h-[30%] bg-cover bg-top md:min-h-[35%] lg:bg-center"
    >
      <div class="pt-0 md:pt-2"></div>
      <TopNav />
      <h2
        class="pt-24 text-center text-9xl font-bold tracking-wide text-yellow-100 md:text-[12em] lg:pt-32"
      >
        Hello.
      </h2>
    </header>

    <main><slot /></main>

    <MFooter />
  </div>
</template>

<style scoped>
.hero {
  background-image: linear-gradient(rgba(0, 0, 0, 0) 10%, rgba(9, 0, 37, 1) 80%),
    url("/images/hero.webp");
}
</style>
