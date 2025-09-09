<template>
  <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-yellow-100 focus:px-3 focus:py-2 focus:text-black">Skip to content</a>
  <main id="main">
    <section
      class="grid px-12 py-12 text-yellow-100 md:px-16 lg:grid-cols-3 lg:px-48 xl:px-72"
    >
      <div class="col-span-2">
        <h1 class="text-4xl md:text-5xl">
          I'm Mihai <br />
          — <br />
          Sr. Software Developer
        </h1>
        <p class="py-12 text-6xl md:text-[8rem] lg:text-[9rem]">
          Crafting
          <span
            class="bg-gradient-to-r from-yellow-100 to-blue-900 bg-clip-text font-extrabold tracking-wide text-transparent"
          >
            digital
          </span>
          experiences that help
          <span
            class="bg-gradient-to-r from-blue-900 to-yellow-100 bg-clip-text font-extrabold tracking-wide text-transparent"
            >people.</span
          >
        </p>
      </div>
    </section>

    <section
      class="bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] py-12"
    >
      <h2
        class="pb-6 text-center text-4xl text-yellow-100 md:text-5xl lg:text-6xl"
      >
        About Me
      </h2>
      <p
        class="px-5 text-lg text-gray-300 md:px-24 md:text-xl lg:px-48 lg:text-2xl xl:px-96"
      >
        Experienced
        <span class="font-extrabold text-yellow-100">
          full-stack web developer
        </span>
        with a demonstrated history of working in health-tech, skilled in
        NodeJS, VueJS, PostgreSQL, MongoDB, SQL Server, Kubernetes and many
        others. Passionate about software engineering and architecture, with a
        focus on creating secure, scalable, and user-friendly solutions for the
        <span class="font-extrabold text-yellow-100">healthcare industry.</span>
      </p>
    </section>

    <section class="px-5">
      <h2
        class="px-5 py-12 text-4xl text-yellow-100 md:text-5xl lg:px-24 lg:text-6xl xl:px-36"
      >
        My work
      </h2>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="i in 3"
          :key="i"
          class="flex items-center justify-center bg-black/30 p-3 duration-500 hover:bg-black/50"
        >
          <NuxtImg src="/images/logo.png" class="w-24" alt="Let's Talk Dev logo" width="96" height="96" />
          <div class="pl-6">
            <h3 class="pb-4 text-3xl text-yellow-100">
              Let's Talk Dev YouTube Channel
            </h3>
            <p class="text-gray-400">
              I share my knowledge and experience in software development and
              architecture through videos on my
              <a
                class="text-blue-500 underline"
                target="_blank"
                href="https://youtube.com/@letstalkdev"
              >
                YouTube channel</a
              >.
            </p>
            <a
              href="https://youtube.com/@letstalkdev"
              target="_blank"
              rel="noopener"
              class="pt-2 text-lg text-blue-300 underline decoration-wavy underline-offset-4 transition-colors duration-300 hover:text-blue-500"
            >
              More Info
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="px-5 pb-12">
      <h2
        class="py-12 text-4xl text-yellow-100 md:text-5xl lg:px-24 lg:text-6xl xl:px-36"
      >
        Technical skills
      </h2>
      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <div
          class="rounded-lg border-2 border-dashed border-yellow-100 p-2 px-6"
        >
          <div class="flex h-fit flex-row pb-6">
            <NuxtImg
              class="w-8"
              src="/images/programming-monitor-svgrepo-com.svg"
              alt="Programming monitor icon"
              width="32"
              height="32"
            />
            <h3
              class="text-balance pl-6 text-xl font-extrabold text-yellow-100"
            >
              Languages and Frameworks
            </h3>
          </div>
          <div class="grid grid-cols-4 gap-2">
            <div class="flex flex-col items-center px-3 text-white">
              <NuxtImg
                class="w-12"
                src="/images/javascript-svgrepo-com.svg"
                alt="JavaScript Logo"
                width="48"
                height="48"
              />
              <span>JavaScript</span>
            </div>
            <div class="flex flex-col items-center px-3 text-white">
              <NuxtImg
                class="w-12"
                src="/images/typescript-official-svgrepo-com.svg"
                alt="TypeScript Logo"
                width="48"
                height="48"
              />
              <span>TypeScript</span>
            </div>
            <div class="flex flex-col items-center px-3 text-white">
              <NuxtImg
                class="w-12"
                src="/images/nodejs-icon-svgrepo-com.svg"
                alt="NodeJS Logo"
                width="48"
                height="48"
              />
              <span>NodeJS</span>
            </div>
            <div class="flex flex-col items-center px-3 text-white">
              <NuxtImg class="w-12" src="/images/bun-logo.svg" alt="Bun Logo" width="48" height="48" />
              <span>Bun</span>
            </div>
            <div class="flex flex-col items-center px-3 text-white">
              <NuxtImg
                class="w-12"
                src="/images/vue-9-logo-svgrepo-com.svg"
                alt="VueJS Logo"
                width="48"
                height="48"
              />
              <span>VueJS</span>
            </div>
            <div class="flex flex-col items-center px-3 text-white">
              <NuxtImg
                class="w-12"
                src="/images/nuxt-svgrepo-com.svg"
                alt="Nuxt Logo"
                width="48"
                height="48"
              />
              <span>Nuxt</span>
            </div>
            <div class="flex flex-col items-center px-3 text-white">
              <NuxtImg
                class="w-12"
                src="/images/graphql-svgrepo-com.svg"
                alt="GraphQL Logo"
                width="48"
                height="48"
              />
              <span>GraphQL</span>
            </div>
            <div class="flex flex-col items-center px-3 text-white">
              <NuxtImg
                class="w-12"
                src="/images/swagger-svgrepo-com.svg"
                alt="OpenAPI Logo"
                width="48"
                height="48"
              />
              <span>OpenAPI</span>
            </div>
          </div>
        </div>

        <div
          class="rounded-lg border-2 border-dashed border-yellow-100 p-2 px-6"
        >
          <div class="flex h-fit flex-row pb-6">
            <NuxtImg
              class="w-8"
              src="/images/database-svgrepo-com.svg"
              alt="Database icon"
              width="32"
              height="32"
            />
            <h3
              class="text-balance pl-6 text-xl font-extrabold text-yellow-100"
            >
              Databases and Analytics
            </h3>
          </div>
          <div class="flex flex-row flex-wrap justify-around">
            <div class="flex flex-col items-center px-3 text-white">
              <NuxtImg
                class="w-12"
                src="/images/postgresql-svgrepo-com.svg"
                alt="PostgreSQL Logo"
                width="48"
                height="48"
              />
              <span>PostgreSQL</span>
            </div>
            <div class="flex flex-col items-center px-3 text-white">
              <NuxtImg
                class="w-12 bg-gray-50 p-1"
                src="/images/microsoft-sql-server-logo-svgrepo-com.svg"
                alt="SQL Server Logo"
                width="48"
                height="48"
              />
              <span>SQL Server</span>
            </div>
            <div class="flex flex-col items-center px-3 text-white">
              <NuxtImg
                class="w-12"
                src="/images/rabbitmq-icon-svgrepo-com.svg"
                alt="RabbitMQ Logo"
                width="48"
                height="48"
              />
              <span>RabbitMQ</span>
            </div>
            <div class="flex flex-col items-center px-3 text-white">
              <NuxtImg
                class="w-12"
                src="/images/mongo-svgrepo-com.svg"
                alt="MongoDB Logo"
                width="48"
                height="48"
              />
              <span>MongoDB</span>
            </div>
          </div>
        </div>
        <div
          class="rounded-lg border-2 border-dashed border-yellow-100 p-2 px-6"
        >
          <div class="flex h-fit flex-row pb-6">
            <NuxtImg
              class="w-8"
              src="/images/infinity-svgrepo-com.svg"
              alt="DevOps logo"
              width="32"
              height="32"
            />
            <h3
              class="text-balance pl-6 text-xl font-extrabold text-yellow-100"
            >
              Cloud and DevOps
            </h3>
          </div>
          <div class="flex flex-row flex-wrap justify-around">
            <div class="flex flex-col items-center px-3 text-white">
              <NuxtImg
                class="w-12"
                src="/images/kubernetes-svgrepo-com.svg"
                alt="Kubernetes Logo"
                width="48"
                height="48"
              />
              <span>Kubernetes</span>
            </div>
            <div class="flex flex-col items-center px-3 text-white">
              <NuxtImg
                class="w-12"
                src="/images/docker-svgrepo-com.svg"
                alt="Docker Logo"
                width="48"
                height="48"
              />
              <span>Docker</span>
            </div>
            <div class="flex max-w-24 flex-col items-center px-3 text-white">
              <NuxtImg
                class="w-12"
                src="/images/gitlab-svgrepo-com.svg"
                alt="GitLab Logo"
                width="48"
                height="48"
              />
              <span class="text-balance text-center">GitLab CI/CD</span>
            </div>
          </div>
        </div>

        <div
          class="rounded-lg border-2 border-dashed border-yellow-100 p-2 px-6"
        >
          <div class="flex h-fit flex-row pb-6">
            <NuxtImg
              class="w-8"
              src="/images/toolbox-svgrepo-com.svg"
              alt="Toolbox icon"
              width="32"
              height="32"
            />
            <h3
              class="text-balance pl-6 text-xl font-extrabold text-yellow-100"
            >
              Tools and Software
            </h3>
          </div>
          <div class="flex flex-row flex-wrap justify-around">
            <div class="flex max-w-24 flex-col items-center px-3 text-white">
              <NuxtImg
                class="w-12 bg-gray-50 p-1"
                src="/images/cypress-svgrepo-com.svg"
                alt="Cypress Logo"
                width="48"
                height="48"
              />
              <span>Cypress</span>
            </div>
            <div class="flex max-w-24 flex-col items-center px-3 text-white">
              <NuxtImg
                class="w-12"
                src="/images/grafana-svgrepo-com.svg"
                alt="Grafana Logo"
                width="48"
                height="48"
              />
              <span>Grafana</span>
            </div>

            <div class="flex max-w-24 flex-col items-center px-3 text-white">
              <NuxtImg
                class="h-12 w-12 bg-gray-50 p-1"
                src="/images/NXGN.svg"
                alt="Nextgen Connect Logo"
                width="48"
                height="48"
              />
              <span class="text-balance text-center">Nextgen Connect</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] px-5 pb-12 lg:px-8 xl:px-12"
    >
      <h2
        class="py-12 text-4xl text-yellow-100 md:text-5xl lg:px-24 lg:text-6xl xl:px-36"
      >
        Books that inspired me
      </h2>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="book in topBooks"
          :key="book.title"
          class="flex items-center justify-center bg-black/30 p-3 duration-500 hover:bg-black/50"
        >
          <NuxtImg
            class="w-36"
            :src="book.cover"
            :alt="`${book.title} by ${book.author} cover image`"
            width="144"
            height="216"
          />
          <div class="pl-6">
            <h3 class="text-3xl text-yellow-100">
              {{ book.title }}
            </h3>

            <p class="pt-4 text-gray-400">{{ book.author }}</p>

            <p class="line-clamp-5 text-balance pt-4 text-yellow-100">
              {{ book.summary }}
            </p>

            <NuxtLink
              to="/books"
              class="pt-2 text-lg text-blue-300 underline decoration-wavy underline-offset-4 transition-colors duration-300 hover:text-blue-500"
            >
              Summary
            </NuxtLink>
          </div>
        </div>
        <div
          class="flex min-h-52 items-center justify-center bg-black/30 p-6 duration-500 hover:bg-black/50"
        >
          <NuxtLink
            to="/books"
            class="text-3xl text-yellow-100 underline decoration-wavy underline-offset-4 transition-colors duration-300 hover:text-blue-500"
          >
            Check out more books...
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="pb-12">
      <h2
        class="px-5 py-12 text-center text-4xl text-yellow-100 md:text-5xl lg:px-24 lg:text-6xl xl:px-36"
      >
        Links
      </h2>
      <div
        class="mx-auto grid w-fit justify-center gap-x-24 gap-y-8 px-5 md:grid-cols-2 lg:grid-cols-3"
      >
        <a target="_blank" href="https://youtube.com/@letstalkdev"
          ><img
            class="h-14 w-48"
            src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white"
            alt="YouTube logo"
        /></a>
        <a target="_blank" href="https://dev.to/mihailtd"
          ><img
            class="h-14 w-48"
            src="https://img.shields.io/badge/dev.to-0A0A0A?style=for-the-badge&logo=devdotto&logoColor=white"
            alt="Dev.to logo"
        /></a>
        <a target="_blank" href="https://www.linkedin.com/in/mihai-farcas-ltd/"
          ><img
            class="h-14 w-48"
            src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"
            alt="LinkedIn logo"
        /></a>
        <a target="_blank" href="https://github.com/mihailtd"
          ><img
            class="h-14 w-48"
            src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white"
            alt="GitHub logo"
        /></a>
        <a
          target="_blank"
          class="flex h-14 w-48 flex-row items-center justify-center bg-gray-950 text-2xl font-bold uppercase tracking-widest"
          href="https://drive.google.com/file/d/1DoBEPMMXbafSET8aX67J-enLyofGhxjo/view?usp=sharing"
          ><NuxtImg
            class="mr-4 w-8"
            src="/images/pdf-file-svgrepo-com.svg"
            alt="PDF logo"
            width="32"
            height="32"
          />
          <span>Resume</span>
        </a>
        <a target="_blank" href="https://www.buymeacoffee.com/letstalkdev"
          ><img
            class="h-14 w-48"
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy me a coffee logo"
        /></a>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "home",
});

// Schema.org structured data for SEO
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: "Mihai @ Let's Talk Dev",
          url: 'https://mihai.ltd'
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Mihai Farcaș',
          url: 'https://mihai.ltd',
          jobTitle: 'Senior Software Developer',
          sameAs: [
            'https://github.com/mihailtd',
            'https://www.linkedin.com/in/mihai-farcas-ltd/',
            'https://youtube.com/@letstalkdev',
          ],
        }
      ])
    }
  ]
})

const topBooks = [
  {
    title: "Becoming a Technical Leader",
    cover: "/images/becoming-a-technical-leader.webp",
    author: "Gerald M. Weinberg",
    summary:
      "This book is a must-read for anyone who wants to become a technical leader. It's full of practical advice and real-world examples that will help you become a better leader.",
  },
  {
    title: "Barking Up the Wrong Tree",
    cover: "/images/barking-up-the-wrong-tree.webp",
    author: "Eric Barker",
    summary:
      "A thought-provoking book that challenges conventional wisdom about success. Rather than offering cookie-cutter advice, Barker delves into the surprising science behind achievement.",
  },
  {
    title: "Building Evolutionary Architectures",
    cover: "/images/building-evolutionary-architectures.webp",
    author: "Neal Ford, Rebecca Parsons, Patrick Kua",
    summary:
      "This book provides a fresh perspective on software architecture. It's a must-read for anyone who wants to build systems that can evolve and adapt to changing requirements.",
  },
  {
    title: "Psychology of Money",
    cover: "/images/the-psychology-of-money.webp",
    author: "Morgan Housel",
    summary:
      "A fascinating exploration of the complex relationship between money and human behavior. Housel's insights will change the way you think about wealth and financial decision-making.",
  },
];
</script>
