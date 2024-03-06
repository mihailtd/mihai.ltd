<template>
  <div class="h-full">
    <header class="hero min-h-1/4 bg-cover bg-top lg:bg-center xl:bg-bottom">
      <div class="pt-0 md:pt-2"></div>
      <TopNav />
    </header>

    <main><slot /></main>

    <MFooter />
  </div>
</template>
