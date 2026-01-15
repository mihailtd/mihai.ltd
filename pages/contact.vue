<template>
  <NuxtLayout name="home" message="How can I help?">
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
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

// SEO metadata for contact page
useSeoMeta({
  title: "Contact Mihai Farcas - Software Architect & Agentic AI Consultant",
  description:
    "Get in touch with Mihai Farcas for Software Architecture consulting, Agentic AI solutions, n8n automation services, YouTube sponsorships, or technical writing opportunities.",
  ogTitle: "Contact Mihai Farcas - Software Architect & Agentic AI Consultant",
  ogDescription:
    "Contact Mihai Farcas for consulting services, content collaboration, and technical expertise in AI automations and enterprise architecture.",
  ogUrl: "https://mihai.ltd/contact",
  twitterTitle: "Contact Mihai Farcas - Software Architect",
  twitterDescription:
    "Get in touch for consulting services, AI automation solutions, and content collaboration.",
});

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
