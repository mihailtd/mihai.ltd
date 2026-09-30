<template>
  <main class="relative min-h-screen">
    <!-- Hero Section -->
    <section
      class="hero-bg min-h-[30vh] bg-cover bg-top pb-8 pt-28 md:min-h-[35vh] lg:bg-center"
    >
      <h1
        class="mx-auto text-center text-7xl font-bold tracking-wide text-yellow-100 md:text-8xl lg:max-w-[60%] lg:text-9xl"
      >
        How can I help?
      </h1>
    </section>

    <div class="mx-auto max-w-2xl px-6 pb-24 pt-8 text-center">
      <p class="mb-12 text-xl text-gray-300">
        Choose the option that best fits your needs so I can route you to the
        right place.
      </p>

      <div class="space-y-8">
        <!-- 1. Business & Technical Consulting (Hero Block) -->
        <div
          class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:border-yellow-100/30 hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-900/20"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          ></div>
          <div class="relative z-10">
            <h2 class="mb-4 text-2xl font-bold text-yellow-100">
              I need a Software Architect or Automation Partner.
            </h2>
            <p class="mb-8 text-gray-300">
              If you are a founder or company looking for Fractional CTO
              services, Agentic AI implementation, or n8n workflow design,
              please visit my agency.
            </p>
            <a
              href="https://innovi.pro"
              target="_blank"
              rel="me"
              class="inline-block rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50"
            >
              Work with INNOVI PRO
            </a>
          </div>
        </div>

        <!-- 2. Media & Content Collaboration -->
        <div
          class="rounded-2xl border border-white/5 bg-black/20 p-8 transition-all duration-300 hover:bg-black/40"
        >
          <h2 class="mb-4 text-xl font-bold text-white">
            I want to sponsor Let's Talk Dev or commission an article.
          </h2>
          <p class="mb-6 text-gray-400">
            For YouTube sponsorships, newsletter features, or technical writing
            requests (dev.to / n8n blog).
          </p>
          <a
            href="mailto:contact@mihai.ltd"
            class="text-lg font-medium text-blue-400 transition-colors hover:text-blue-300 hover:underline"
          >
            contact@mihai.ltd
          </a>

          <div class="my-8 h-px w-full bg-white/10"></div>

          <h3 class="mb-6 text-lg font-bold text-white">
            Or send me a message directly:
          </h3>

          <div
            v-if="submitted"
            class="flex flex-col items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10 p-8 text-center"
          >
            <div
              class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-3xl"
            >
              ✅
            </div>
            <h3 class="mb-2 text-xl font-bold text-white">Message Sent!</h3>
            <p class="text-gray-300">
              Thanks for reaching out. I'll get back to you as soon as possible.
            </p>
            <button
              class="mt-6 text-blue-400 hover:text-blue-300 hover:underline"
              @click="submitted = false"
            >
              Send another message
            </button>
          </div>

          <form
            v-else
            ref="contactForm"
            class="mx-auto flex w-full max-w-md flex-col items-center"
            @submit.prevent="submit"
          >
            <div
              v-if="error"
              class="mb-4 w-full rounded-md border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-200"
            >
              {{ error }}
            </div>

            <label class="flex w-full flex-col py-2 text-left"
              ><span class="pb-1 text-sm text-gray-400">name *</span>
              <input
                v-model="name"
                required
                class="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Your name"
                type="text"
            /></label>
            <label class="flex w-full flex-col py-2 text-left"
              ><span class="pb-1 text-sm text-gray-400">email address *</span>
              <input
                v-model="email"
                required
                class="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="your@email.com"
                type="email"
            /></label>
            <label class="flex w-full flex-col py-2 text-left"
              ><span class="pb-1 text-sm text-gray-400">message *</span
              ><textarea
                v-model="message"
                required
                class="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows="4"
                minlength="3"
                maxlength="500"
                placeholder="How can I help you?"
              />
            </label>
            <div class="py-2"></div>
            <NuxtTurnstile ref="turnstile" v-model="token" class="pb-4" />
            <button
              type="submit"
              :disabled="pending"
              class="rounded-full bg-orange-500 px-6 py-2 text-lg font-bold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send message
            </button>
          </form>
        </div>

        <!-- 3. General Connection -->
        <div class="py-4">
          <h2 class="mb-4 text-xl font-bold text-white">
            I just want to say hi.
          </h2>
          <p class="mb-6 text-gray-400">
            The best way to engage with me casually or discuss my videos is via
            social media.
          </p>
          <div class="flex justify-center gap-6">
            <a
              href="https://www.linkedin.com/in/mihai-farcas-ltd/"
              target="_blank"
              class="transition-transform duration-300 hover:scale-110"
              aria-label="LinkedIn"
            >
              <img
                src="/images/linkedin-svgrepo-com.svg"
                alt="LinkedIn"
                class="h-10 w-10"
              />
            </a>
            <a
              href="https://github.com/mihailtd"
              target="_blank"
              class="transition-transform duration-300 hover:scale-110"
              aria-label="GitHub"
            >
              <img
                src="/images/github-142-svgrepo-com.svg"
                alt="GitHub"
                class="h-10 w-10 p-1 invert"
              />
            </a>
            <a
              href="https://youtube.com/@letstalkdev"
              target="_blank"
              class="transition-transform duration-300 hover:scale-110"
              aria-label="YouTube"
            >
              <img
                src="/images/youtube-168-svgrepo-com.svg"
                alt="YouTube"
                class="h-10 w-10"
              />
            </a>
          </div>
        </div>

        <!-- 4. The "No-Go" Note -->
        <div class="border-t border-white/5 pt-8">
          <p class="text-sm text-gray-500">
            Please note: Due to volume, I cannot offer free code debugging via
            email. Please leave a comment on the relevant YouTube video or
            article.
          </p>
        </div>
      </div>

      <!-- Engagement models: what each type of work looks like -->
      <section
        aria-labelledby="engagements-heading"
        class="mt-20 border-t border-white/10 pt-12 text-left"
      >
        <h2
          id="engagements-heading"
          class="text-2xl font-bold text-yellow-100 md:text-3xl"
        >
          Services &amp; engagement models
        </h2>
        <p class="mt-4 text-gray-300">
          I help companies design and ship production Agentic AI systems, n8n
          automations and MCP servers, and I review or own the architecture
          around them. Consulting engagements run through my company,
          <a
            href="https://innovi.pro/"
            target="_blank"
            rel="noopener"
            class="text-blue-300 underline underline-offset-4 hover:text-blue-400"
            >INNOVI PRO</a
          >.
        </p>
        <div class="mt-6 overflow-x-auto rounded-2xl border border-white/10">
          <table class="w-full text-left text-sm">
            <caption class="sr-only">
              Engagement models offered by Mihai Farcas
            </caption>
            <thead
              class="bg-white/5 text-xs uppercase tracking-wider text-gray-400"
            >
              <tr>
                <th scope="col" class="px-4 py-3">Engagement</th>
                <th scope="col" class="px-4 py-3">What you get</th>
                <th scope="col" class="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-gray-300">
              <tr v-for="e in engagements" :key="e.name">
                <th scope="row" class="px-4 py-3 font-semibold text-white">
                  {{ e.name }}
                </th>
                <td class="px-4 py-3">{{ e.deliverables }}</td>
                <td class="px-4 py-3 text-gray-400">{{ e.bestFor }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- FAQ: direct answers to typical procurement questions -->
      <section aria-labelledby="faq-heading" class="mt-16 text-left">
        <h2
          id="faq-heading"
          class="text-2xl font-bold text-yellow-100 md:text-3xl"
        >
          Frequently asked questions
        </h2>
        <div class="mt-6 space-y-3">
          <details
            v-for="(f, i) in faqs"
            :key="f.q"
            class="group rounded-2xl border border-white/10 bg-white/5 p-5 open:bg-white/[0.07]"
            :open="i === 0"
          >
            <summary
              class="cursor-pointer list-none font-semibold text-white marker:hidden"
            >
              <h3 class="inline text-base">{{ f.q }}</h3>
            </summary>
            <p class="mt-3 text-sm leading-relaxed text-gray-300">
              {{ f.a }}
            </p>
          </details>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
const contactTitle =
  "Hire Mihai Farcas — Agentic AI, n8n & Software Architecture Consulting";
const contactDescription =
  "Work with Mihai Farcas, Software Architect: Agentic AI system design, n8n workflow automation, MCP server development and fractional architecture reviews. Engagement models, supported stacks and FAQ.";

useSeoMeta({
  title: contactTitle,
  description: contactDescription,
  ogTitle: contactTitle,
  ogDescription: contactDescription,
  twitterTitle: contactTitle,
  twitterDescription: contactDescription,
});

const engagements = [
  {
    name: "Fractional architect / CTO",
    deliverables:
      "Ongoing architecture ownership: technology choices, system design, reviews, and hands-on guidance for your engineers.",
    bestFor:
      "Founders and teams without a senior architect, or scaling a product into AI.",
  },
  {
    name: "AI system design review",
    deliverables:
      "A review of your agentic AI / RAG design — orchestration, data flow, evaluation, cost, security — with a written list of prioritized recommendations.",
    bestFor:
      "Teams about to build, or struggling to productionize, an AI feature.",
  },
  {
    name: "Agentic AI implementation",
    deliverables:
      "Design and delivery of production AI agents with LangGraph, RAG / Graph RAG, tool calling and guardrails on Azure OpenAI, OpenAI, Claude or Gemini.",
    bestFor:
      "Companies that want a working, maintainable AI system — not a demo.",
  },
  {
    name: "n8n automation & MCP servers",
    deliverables:
      "Custom n8n workflows and AI agents, self-hosted n8n on Docker or Kubernetes, and MCP servers that connect your internal tools to Claude, ChatGPT and Copilot.",
    bestFor:
      "Operations and engineering teams automating manual processes or replacing Zapier / Make.",
  },
];

const faqs = [
  {
    q: "What does Mihai Farcas help companies with?",
    a: "Mihai Farcas is a Software Architect who designs and ships production Agentic AI systems, n8n workflow automations and MCP servers, and provides fractional architecture and AI design reviews. Consulting engagements are delivered through his company, INNOVI PRO.",
  },
  {
    q: "Which tech stacks do you work with?",
    a: "TypeScript and Node.js, Python and FastAPI, Vue.js and Nuxt on the application side; PostgreSQL, MongoDB, SQL Server, Redis and RabbitMQ for data and messaging; Docker, Kubernetes, ArgoCD and GitLab CI/CD on GCP, Azure or AWS. For AI: LangGraph, RAG and Graph RAG, MCP, and models from Azure OpenAI, OpenAI, Anthropic Claude and Google Gemini — plus n8n for workflow automation.",
  },
  {
    q: "Do you work remotely, and in which time zone?",
    a: "Yes — all engagements are remote. I'm based in Cluj-Napoca, Romania (UTC+2, UTC+3 in summer), which overlaps with European business hours and US East Coast mornings, and I have delivered projects for US healthcare organizations.",
  },
  {
    q: "How long does a typical engagement take?",
    a: "It depends on scope. A design review or a single n8n automation is a short, fixed-scope engagement; an agentic AI build or a fractional architect role usually runs over several weeks or months. Scope, timeline and deliverables are agreed up front after an introductory call.",
  },
  {
    q: "Can you work with sensitive or regulated data?",
    a: "Yes. I have built healthcare systems using FHIR, HL7 and DICOM (including patient-facing portals for Kaiser Permanente via Cognizant) and work on insurance systems at Marsh. For sensitive data I design self-hosted deployments — for example self-hosted n8n and private model endpoints such as Azure OpenAI — so data stays inside your infrastructure.",
  },
  {
    q: "Should we self-host n8n or use n8n Cloud?",
    a: "Self-host n8n when you need data sovereignty, custom nodes, high execution volumes or deployment inside your own VPC or Kubernetes cluster; choose n8n Cloud when you want zero infrastructure maintenance and fast onboarding. My n8n tech report on this site covers the trade-offs and a production Docker Compose setup.",
  },
  {
    q: "Do you take on sponsorships or technical writing?",
    a: "Yes. For Let's Talk Dev YouTube sponsorships or technical writing (I write for the official n8n blog and Dev.to), email contact@mihai.ltd.",
  },
  {
    q: "Can you help debug my code for free?",
    a: "Due to volume I can't offer free debugging over email. The best place for questions about a video or article is the comment section of that YouTube video or article.",
  },
];

useJsonLd("contact", [
  {
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contact#webpage`,
    url: `${SITE_URL}/contact`,
    name: contactTitle,
    description: contactDescription,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    mainEntity: { "@id": PERSON_ID },
    inLanguage: "en",
  },
  {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/contact#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
]);

const contactForm = ref<HTMLFormElement | null>(null);

const name = ref<string>("");
const email = ref<string>("");
const message = ref<string>("");
const token = ref("");
const turnstile = ref();
const submitted = ref(false);
const error = ref("");
const pending = ref(false);

const submit = async () => {
  if (contactForm.value?.checkValidity()) {
    pending.value = true;
    error.value = "";

    try {
      await $fetch("/api/send-message", {
        method: "POST",
        body: {
          name: name.value,
          email: email.value,
          message: message.value,
          source: window.location.origin,
        },
      });

      name.value = "";
      email.value = "";
      message.value = "";
      submitted.value = true;
    } catch (e) {
      console.error(e);
      error.value = "Failed to send message. Please try again later.";
    } finally {
      pending.value = false;
      turnstile.value?.reset();
    }
  }
};
</script>

<style scoped>
.hero-bg {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0) 10%, rgba(9, 0, 37, 1) 80%),
    url("/images/hero.webp");
}
</style>
