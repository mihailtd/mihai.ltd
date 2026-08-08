<template>
  <main id="main">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-yellow-100 focus:px-3 focus:py-2 focus:text-black"
      >Skip to content</a
    >
    <section
      class="grid px-12 py-12 text-yellow-100 md:px-16 lg:grid-cols-3 lg:px-48 xl:px-72"
    >
      <div class="col-span-2">
        <h1 class="text-4xl md:text-5xl">
          I'm Mihai Farcas<br />
          — <br />
          Software Architect
        </h1>
        <h2 class="py-12 text-6xl md:text-[8rem] lg:text-[9rem]">
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
        </h2>
      </div>
    </section>

    <section
      class="bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] py-12"
    >
      <div class="mx-auto max-w-7xl px-5 md:px-12 lg:px-24">
        <h2 class="pb-2 text-4xl text-yellow-100 md:text-5xl lg:text-6xl">
          About Me
        </h2>
      </div>

      <div
        class="mx-auto flex max-w-7xl flex-col-reverse items-center justify-center gap-12 px-5 md:flex-row md:px-12 lg:px-24"
      >
        <p class="flex-1 text-lg text-gray-300 md:text-xl lg:text-2xl">
          Experienced
          <span class="font-extrabold text-yellow-100">
            software architect
          </span>
          specializing in
          <span class="font-extrabold text-yellow-100">Agentic AI</span>
          and
          <span class="font-extrabold text-yellow-100">AI automations</span>.
          Skilled in NodeJS, VueJS, PostgreSQL, MongoDB, SQL Server, Kubernetes,
          Docker, LangGraph, and
          <span class="font-extrabold text-yellow-100">n8n</span>. As a
          <span class="font-extrabold text-yellow-100"
            >YouTube content creator</span
          >
          at Let's Talk Dev, I share knowledge about software engineering and
          architecture.
        </p>

        <div class="group relative flex-shrink-0">
          <div
            class="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-100 to-blue-600 opacity-25 blur-xl transition duration-1000 group-hover:opacity-50 group-hover:duration-200"
          ></div>
          <img
            src="/mihai_farcas.webp"
            alt="Mihai Farcas - Software Architect"
            class="relative size-48 rounded-full border-2 border-white/10 object-cover object-[center_30%] p-2 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-yellow-100/30 group-hover:shadow-yellow-500/20 md:size-64 lg:size-80"
          />
        </div>
      </div>
    </section>

    <section class="px-5 pb-12">
      <h2
        class="px-5 py-12 text-4xl text-yellow-100 md:text-5xl lg:px-24 lg:text-6xl xl:px-36"
      >
        My Work & Featured Projects
      </h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="project in featuredProjects"
          :key="project.title"
          class="group flex items-center justify-center rounded-xl border border-white/5 bg-black/30 p-3 transition-all duration-300 hover:-translate-y-1 hover:bg-white/5 hover:shadow-xl hover:shadow-blue-900/20"
        >
          <NuxtImg
            :src="project.logo"
            :class="[
              'h-12 w-20 object-contain transition-transform duration-500',
              project.logoClass || 'group-hover:scale-110',
            ]"
            :alt="`${project.title} logo`"
          />
          <div class="flex-1 pl-6">
            <h3 class="pb-2 text-2xl text-yellow-100">
              {{ project.title }}
            </h3>
            <p class="text-pretty pb-2 text-sm text-gray-300">
              {{ project.description }}
            </p>
            <p class="text-xs text-gray-500">
              {{ project.tech }}
            </p>
            <div class="flex gap-2 pt-2">
              <a
                v-for="link in project.links"
                :key="link.text"
                :href="link.url"
                target="_blank"
                class="text-sm text-blue-300 underline decoration-wavy underline-offset-4 transition-colors duration-300 hover:text-blue-500"
              >
                {{ link.text }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Companies & Clients Section -->
    <section class="px-5 pb-12">
      <h2
        class="px-5 py-12 text-4xl text-yellow-100 md:text-5xl lg:px-24 lg:text-6xl xl:px-36"
      >
        Companies &amp; Clients
      </h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="client in clients"
          :key="client.title"
          class="group flex items-center justify-center rounded-xl border border-white/5 bg-black/30 p-3 transition-all duration-300 hover:-translate-y-1 hover:bg-white/5 hover:shadow-xl hover:shadow-blue-900/20"
        >
          <NuxtImg
            :src="client.logo"
            class="h-12 w-20 object-contain transition-transform duration-500 group-hover:scale-110"
            :alt="`${client.title} logo`"
          />
          <div class="flex-1 pl-6">
            <h3 class="pb-2 text-2xl text-yellow-100">
              {{ client.title }}
            </h3>
            <p class="pb-2 text-sm text-gray-300">
              {{ client.subtitle }}
            </p>
            <p class="text-xs text-gray-500">
              {{ client.tech }}
            </p>
            <div class="flex gap-2 pt-2">
              <a
                v-for="link in client.links"
                :key="link.text"
                :href="link.url"
                target="_blank"
                class="text-sm text-blue-300 underline decoration-wavy underline-offset-4 transition-colors duration-300 hover:text-blue-500"
              >
                {{ link.text }}
              </a>
            </div>
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
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="group in skillGroups"
          :key="group.title"
          class="rounded-xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-yellow-100/30 hover:bg-white/10 hover:shadow-lg hover:shadow-yellow-900/10"
        >
          <div class="flex h-fit flex-row items-center pb-6">
            <NuxtImg
              class="w-8"
              :src="group.icon"
              :alt="`${group.title} icon`"
              width="32"
              height="32"
            />
            <h3
              class="text-balance pl-6 text-xl font-extrabold text-yellow-100"
            >
              {{ group.title }}
            </h3>
          </div>
          <div class="flex flex-wrap justify-center gap-x-2 gap-y-4">
            <div
              v-for="skill in group.skills"
              :key="skill.name"
              class="group/icon flex w-20 flex-col items-center gap-1 text-white"
            >
              <NuxtImg
                class="w-12 transition-transform duration-300 group-hover/icon:scale-110"
                :class="skill.plate ? 'bg-gray-50 p-1' : ''"
                :src="skill.logo"
                :alt="`${skill.name} Logo`"
                width="48"
                height="48"
              />
              <span class="text-balance text-center text-sm">{{
                skill.name
              }}</span>
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
          :key="book.slug"
          class="group flex items-center justify-center rounded-xl border border-white/5 bg-black/30 p-3 transition-all duration-300 hover:-translate-y-1 hover:bg-white/5 hover:shadow-xl hover:shadow-blue-900/20"
        >
          <NuxtImg
            class="w-36 transition-transform duration-500 group-hover:rotate-2 group-hover:scale-105"
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
              :to="`/blog/${book.slug}`"
              class="inline-block pt-2 text-lg text-blue-300 underline decoration-wavy underline-offset-4 transition-all duration-300 hover:text-blue-500 hover:decoration-blue-500"
            >
              Summary
            </NuxtLink>
          </div>
        </div>
        <div
          class="group flex min-h-52 items-center justify-center rounded-xl border border-white/5 bg-black/30 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/5 hover:shadow-xl hover:shadow-blue-900/20"
        >
          <NuxtLink
            to="/blog?type=book_summary"
            class="text-3xl text-yellow-100 underline decoration-wavy underline-offset-4 transition-all duration-300 hover:text-blue-500 hover:decoration-blue-500"
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

// Enhanced SEO metadata for homepage
useSeoMeta({
  title:
    "Mihai Farcas - Software Architect, Agentic AI Expert & Content Creator",
  description:
    "Mihai Farcas is an experienced Software Architect specializing in Agentic AI, AI automations, and n8n consulting. YouTube content creator at Let's Talk Dev with expertise in enterprise architecture, software engineering, and AI-driven automation solutions.",
  ogTitle:
    "Mihai Farcas - Software Architect, Agentic AI Expert & Content Creator",
  ogDescription:
    "Expert Software Architect specializing in Agentic AI, AI automations, n8n consulting. Content creator helping developers build scalable enterprise systems.",
  ogImage: "https://mihai.ltd/og-cover.jpg",
  ogUrl: "https://mihai.ltd/",
  twitterTitle: "Mihai Farcas - Software Architect & Agentic AI Expert",
  twitterDescription:
    "Software Architect specializing in Agentic AI, AI automations, n8n consulting. YouTube content creator at Let's Talk Dev.",
  twitterImage: "https://mihai.ltd/og-cover.jpg",
  twitterCard: "summary_large_image",
});

// Schema.org structured data for SEO
useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Mihai Farcas - Software Architect & Content Creator",
          url: "https://mihai.ltd",
          description:
            "Portfolio and professional website of Mihai Farcas, Software Architect specializing in Agentic AI and AI automations",
          author: {
            "@type": "Person",
            name: "Mihai Farcas",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Mihai Farcas",
          alternateName: "Mihai Farcaș",
          url: "https://mihai.ltd",
          image: "https://mihai.ltd/mihai_farcas.webp",
          jobTitle: "Software Architect",
          worksFor: {
            "@type": "Organization",
            name: "MARSH",
            url: "https://www.corporate.marsh.com/global/home.html",
          },
          knowsAbout: [
            "Software Architecture",
            "Agentic AI",
            "AI Automations",
            "n8n",
            "Enterprise Architecture",
            "LangGraph",
            "Microservices",
            "Kubernetes",
            "Node.js",
            "Vue.js",
            "Content Creation",
            "Technical Consulting",
          ],
          sameAs: [
            "https://github.com/mihailtd",
            "https://www.linkedin.com/in/mihai-farcas-ltd/",
            "https://youtube.com/@letstalkdev",
            "https://dev.to/mihailtd",
            "https://blog.n8n.io/author/mihai/",
          ],
          alumniOf: {
            "@type": "Organization",
            name: "Software Engineering",
          },
          description:
            "Experienced Software Architect specializing in Agentic AI, AI automations, and enterprise-grade architecture. YouTube content creator at Let's Talk Dev.",
        },
        {
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "INNOVI PRO",
          url: "https://innovi.pro",
          description:
            "Specialized consulting in Enterprise-Grade Architecture and Autonomous AI Agents",
          provider: {
            "@type": "Person",
            name: "Mihai Farcas",
          },
          serviceType: [
            "Software Architecture Consulting",
            "AI Automation Solutions",
            "n8n Partner Services",
          ],
          areaServed: "Worldwide",
        },
      ]),
    },
  ],
});

// Data-driven so a new logo is just one more entry in the right group,
// instead of copy-pasting markup — the icon grid itself wraps and balances
// regardless of how many are in a given group.
type Skill = { name: string; logo: string; plate?: boolean };
type SkillGroup = { title: string; icon: string; skills: Skill[] };

const skillGroups: SkillGroup[] = [
  {
    title: "Languages and Frameworks",
    icon: "/images/programming-monitor-svgrepo-com.svg",
    skills: [
      { name: "JavaScript", logo: "/images/javascript-svgrepo-com.svg" },
      {
        name: "TypeScript",
        logo: "/images/typescript-official-svgrepo-com.svg",
      },
      { name: "Python", logo: "/images/python-svgrepo-com.svg" },
      { name: "NodeJS", logo: "/images/nodejs-icon-svgrepo-com.svg" },
      { name: "Bun", logo: "/images/bun-logo.svg" },
      { name: "VueJS", logo: "/images/vue-9-logo-svgrepo-com.svg" },
      { name: "Nuxt", logo: "/images/nuxt-svgrepo-com.svg" },
      { name: "FastAPI", logo: "/images/fastapi.svg" },
      { name: "GraphQL", logo: "/images/graphql-svgrepo-com.svg" },
      { name: "OpenAPI", logo: "/images/swagger-svgrepo-com.svg" },
    ],
  },
  {
    title: "Databases and Analytics",
    icon: "/images/database-svgrepo-com.svg",
    skills: [
      { name: "PostgreSQL", logo: "/images/postgresql-svgrepo-com.svg" },
      { name: "DuckDB", logo: "/images/DuckDB_icon-darkmode.svg" },
      {
        name: "SQL Server",
        logo: "/images/microsoft-sql-server-logo-svgrepo-com.svg",
        plate: true,
      },
      { name: "MongoDB", logo: "/images/mongo-svgrepo-com.svg" },
      { name: "Redis", logo: "/images/redis-logo-svgrepo-com.svg" },
      { name: "RabbitMQ", logo: "/images/rabbitmq-icon-svgrepo-com.svg" },
    ],
  },
  {
    title: "Cloud and DevOps",
    icon: "/images/infinity-svgrepo-com.svg",
    skills: [
      { name: "Kubernetes", logo: "/images/kubernetes-svgrepo-com.svg" },
      { name: "Docker", logo: "/images/docker-svgrepo-com.svg" },
      { name: "ArgoCD", logo: "/images/argo-cd.svg" },
      { name: "GitLab CI/CD", logo: "/images/gitlab-svgrepo-com.svg" },
      { name: "Google Cloud", logo: "/images/google-cloud.svg" },
      { name: "AWS", logo: "/images/aws-light.svg" },
      { name: "Azure", logo: "/images/azure.svg" },
    ],
  },
  {
    title: "AI & Agentic Tooling",
    icon: "/images/Claude_AI_symbol.svg.webp",
    skills: [
      { name: "Claude", logo: "/images/Claude_AI_symbol.svg.webp" },
      { name: "OpenAI", logo: "/images/openai-light.svg" },
      { name: "MCP", logo: "/images/mcp.png" },
    ],
  },
  {
    title: "Tools and Software",
    icon: "/images/toolbox-svgrepo-com.svg",
    skills: [
      {
        name: "Cypress",
        logo: "/images/cypress-svgrepo-com.svg",
        plate: true,
      },
      { name: "Grafana", logo: "/images/grafana-svgrepo-com.svg" },
      { name: "Nextgen Connect", logo: "/images/NXGN.svg", plate: true },
    ],
  },
];

const featuredProjects = [
  {
    title: "YouTube Content Creator",
    description:
      "I firmly believe that knowledge grows when shared. On my YouTube channel 'Let's Talk Dev', I produce in-depth tutorials covering Software Development, Architecture, HomeLab, Self-Hosting, DevOps, and Platform Engineering. I take deep dives into the latest technologies and frameworks to help you build robust, scalable systems.",
    logo: "/images/logo.png",
    logoClass: "group-hover:rotate-12",
    tech: "Software architecture, tutorials, development best practices",
    links: [{ text: "Visit Channel", url: "https://youtube.com/@letstalkdev" }],
  },
  {
    title: "INNOVI PRO",
    description:
      "Through INNOVI PRO, I offer specialized consulting in Enterprise-Grade Architecture and the development of Autonomous AI Agents. I help organizations navigate the complexities of modern software design, ensuring their systems are secure, scalable, and ready for the future of AI-driven automation.",
    logo: "/innovi_pro_logo.png",
    logoClass: "group-hover:scale-110",
    tech: "Software Architecture, AI & Automation Solutions, n8n Partner",
    links: [{ text: "View Services", url: "https://innovi.pro/" }],
  },
  {
    title: "n8n",
    description:
      "I actively contribute to the n8n ecosystem as a Technical Writer and creator of Agentic AI templates. My work focuses on making advanced AI automation accessible, providing the community with production-ready workflows that leverage the full potential of low-code orchestration.",
    logo: "/images/logos/N8n.io_idWtnk-fDo_1.png",
    logoClass: "group-hover:scale-110",
    tech: "Technical Writing, Automation, Agentic AI, Low-Code",
    links: [
      { text: "Read Articles", url: "https://blog.n8n.io/author/mihai/" },
      {
        text: "n8n Automation templates",
        url: "https://n8n.io/creators/mihailtd/",
      },
    ],
  },
];

const clients = [
  {
    title: "Marsh McLennan",
    subtitle: "Software Architect (current) — Agentic AI apps and automations",
    logo: "/images/logos/mmc.png",
    tech: "Microservices, Python, LangGraph, SQL Server, PostgreSQL, MongoDB, RAG, Graph RAG, Azure OpenAI, Kubernetes",
  },
  {
    title: "n8n",
    subtitle: "Technical Writer",
    logo: "/images/logos/N8n.io_idWtnk-fDo_1.png",
    links: [
      { text: "Check Out My Work", url: "https://blog.n8n.io/author/mihai/" },
    ],
    tech: "Technical Writing, Developer Documentation, Automation",
  },
  {
    title: "Kaiser Permanente",
    subtitle: "Patient portals, directories, patient resources (via Cognizant)",
    logo: "/images/logos/Kaiser Permanente_idiIJ5r2lQ_1.png",
    tech: "Node.js, MongoDB, SQL Server, REST, OAuth, OpenAPI, GitLab CI/CD, Docker, Kubernetes, Splunk",
  },
  {
    title: "Cognizant",
    subtitle: "Technical interviews, workshops, presentations",
    logo: "/images/logos/Cognizant_id6O9Djecd_1.png",
    tech: "Consulting, Technical Leadership, Architecture",
  },
  {
    title: "Lyfegen",
    subtitle: "AI Engineer, freelancer — Agentic AI for pharma",
    logo: "/images/logos/lyfegen.png",
    tech: "Azure, Azure OpenAI, Google Gemini, Python, LangGraph, RAG, Agentic RAG, PostgreSQL",
  },
  {
    title: "medQ",
    subtitle: "Healthcare application for radiologists (US)",
    logo: "/images/logos/medQ-Tagline-180px.png",
    tech: "FHIR, HL7, DICOM, SQL Server, JavaScript",
    links: [],
  },
];

// Hardcoded rather than pulled from queryCollection at request time: Nuxt
// Content's runtime database sync is flaky enough (in dev, and worse on
// Cloudflare Workers without a D1 binding) that it's not worth the homepage
// depending on it. `slug` still points at the real content/books/<slug>.md
// report for "Summary" — only the card's display copy is duplicated here.
// If a book's blurb changes, update it in both places.
const topBooks = [
  {
    slug: "verb-your-enthusiasm",
    title: "Verb Your Enthusiasm",
    cover: "/images/book_covers/verb-your-enthusiasm-cover.jpg",
    author: "Sarah L. Kaufman",
    summary:
      "Sarah L. Kaufman's guide to writing with sharper, more intentional verbs — and why they're the real engine of good prose.",
  },
  {
    slug: "becoming-a-technical-leader",
    title: "Becoming a Technical Leader",
    cover: "/images/book_covers/becoming-a-technical-leader.webp",
    author: "Gerald M. Weinberg",
    summary:
      "This book is a must-read for anyone who wants to become a technical leader. It's full of practical advice and real-world examples that will help you become a better leader.",
  },
  {
    slug: "barking-up-the-wrong-tree",
    title: "Barking Up the Wrong Tree",
    cover: "/images/book_covers/barking-up-the-wrong-tree.webp",
    author: "Eric Barker",
    summary:
      "A thought-provoking book that challenges conventional wisdom about success. Rather than offering cookie-cutter advice, Barker delves into the surprising science behind achievement.",
  },
  {
    slug: "building-evolutionary-architectures",
    title: "Building Evolutionary Architectures",
    cover: "/images/book_covers/building-evolutionary-architectures.webp",
    author: "Neal Ford, Rebecca Parsons, Patrick Kua",
    summary:
      "This book provides a fresh perspective on software architecture. It's a must-read for anyone who wants to build systems that can evolve and adapt to changing requirements.",
  },
  {
    slug: "the-psychology-of-money",
    title: "Psychology of Money",
    cover: "/images/book_covers/the-psychology-of-money.webp",
    author: "Morgan Housel",
    summary:
      "A fascinating exploration of the complex relationship between money and human behavior. Housel's insights will change the way you think about wealth and financial decision-making.",
  },
];
</script>
