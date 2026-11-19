<template>
  <footer
    class="sticky top-full border-t border-white/10 bg-primary/30 px-5 py-8 text-gray-400 backdrop-blur-xs"
  >
    <div
      class="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center"
    >
      <div class="flex flex-row items-center">
        <img
          class="w-16 transition-transform duration-500 hover:rotate-12"
          src="/images/logo.png"
          alt="Let's Talk Dev YouTube channel logo"
        />
        <div class="pl-4 text-sm sm:pl-6">
          <p>
            © {{ new Date().getFullYear() }} Mihai Farcas —
            <a
              href="https://youtube.com/@letstalkdev"
              class="text-blue-400 underline underline-offset-2 transition-colors duration-300 hover:text-blue-300"
              target="_blank"
              >@letstalkdev</a
            >
          </p>
          <p class="text-xs text-gray-400">
            Based in Cluj-Napoca, Romania • Available worldwide
          </p>
        </div>
      </div>

      <nav
        aria-label="Mihai Farcas ecosystem"
        class="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-300 md:mr-6 md:ml-auto"
      >
        <a
          href="https://innovi.pro"
          target="_blank"
          rel="noopener noreferrer"
          class="underline decoration-white/20 underline-offset-4 transition-colors hover:text-yellow-100"
          >Innovi Pro (Consultancy)</a
        >
        <a
          href="https://retroagile.com"
          target="_blank"
          rel="noopener noreferrer"
          class="underline decoration-white/20 underline-offset-4 transition-colors hover:text-yellow-100"
          >RetroAgile</a
        >
        <a
          href="https://innovi.care"
          target="_blank"
          rel="noopener noreferrer"
          class="underline decoration-white/20 underline-offset-4 transition-colors hover:text-yellow-100"
          >Innovi Care</a
        >
        <a
          href="https://graphpg.com/"
          target="_blank"
          rel="noopener noreferrer"
          class="underline decoration-white/20 underline-offset-4 transition-colors hover:text-yellow-100"
          >GraphPG</a
        >
      </nav>

      <div class="flex items-center justify-start md:justify-end">
        <span class="inline-flex justify-center">
          <a
            class="my-auto text-gray-500 transition-transform duration-300 hover:scale-110"
            href="https://youtube.com/@letstalkdev"
            target="_blank"
          >
            <img
              class="w-8 p-1 text-white"
              src="/public/images/youtube-168-svgrepo-com.svg"
              alt="Let's Talk Dev YouTube channel"
            />
          </a>
          <a
            class="ml-3 text-gray-500 transition-transform duration-300 hover:scale-110"
            href="https://github.com/mihailtd"
            target="_blank"
          >
            <img
              class="w-8 p-1 text-white"
              src="/public/images/github-142-svgrepo-com.svg"
              alt="Mihai's GitHub profile"
            />
          </a>
          <a
            class="ml-3 text-gray-500 transition-transform duration-300 hover:scale-110"
            href="https://www.linkedin.com/in/mihai-farcas-ltd/"
            target="_blank"
          >
            <img
              class="w-8 p-1 text-white"
              src="/public/images/linkedin-svgrepo-com.svg"
              alt="Mihai's LinkedIn profile"
            />
          </a>
        </span>
      </div>
    </div>
  </footer>
</template>
