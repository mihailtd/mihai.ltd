<template>
  <div v-if="article" class="mx-auto max-w-4xl px-6 pt-16">
    <div>
      <button
        class="flex items-center py-8 text-gray-200 hover:text-gray-400"
        @click="$router.go(-1)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span class="pl-2 text-2xl">Back</span>
      </button>
    </div>
    <div class="flex flex-col lg:flex-row">
      <h1
        class="prose dark:prose-invert max-w-xl text-balance text-6xl font-bold tracking-tight"
      >
        {{ article.title }}
      </h1>
      <div class="py-8"></div>
      <div class="flex flex-row items-center justify-center pl-8 lg:flex-col">
        <NuxtImg
          provider="directus"
          :src="article.cover_image?.id"
          :alt="article.cover_image?.title || 'Cover image'"
          class="h-48 w-48 object-cover object-top"
        />
        <div class="flex flex-col items-center justify-center">
          <a :href="article.affiliate_link" target="_blank" class="py-4">
            <img
              src="@/public/amazon_logo.png"
              alt="Amazon logo"
              class="h-20 w-36 rounded-2xl bg-gray-200 px-6 py-4"
            />
          </a>
          <p class="w-48 text-balance text-center text-xs text-gray-500">
            {{ article.disclaimer }}
          </p>
        </div>
      </div>
      <div class="py-4"></div>
    </div>
    <article
      class="prose prose-2xl dark:prose-invert prose-h2:text-3xl prose-a:text-blue-500 prose-a:underline pb-24 pt-6"
      v-html="article.content"
    ></article>
    <div class="flex flex-row items-center justify-center pb-16">
      <NuxtImg
        provider="directus"
        :src="article.cover_image?.id"
        :alt="article.cover_image?.title || 'Cover image'"
        class="w-48 object-cover"
      />
      <div class="flex flex-col items-center justify-center">
        <a :href="article.affiliate_link" target="_blank" class="py-4">
          <img
            src="@/public/amazon_logo.png"
            alt="Amazon logo"
            class="h-20 w-36 rounded-2xl bg-gray-200 px-6 py-4"
          />
        </a>
        <p class="w-48 text-balance text-center text-xs text-gray-500">
          {{ article.disclaimer }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const slug = route.params.slug;

const articleQuery = gql`
  query getArticleBySlug($slug: String!) {
    mihai_ltd_articles(filter: { slug: { _eq: $slug } }) {
      id
      slug
      title
      description
      status
      date_updated
      cover_image {
        id
        title
      }
      type
      is_featured
      canonical_url
      content
      affiliate_link
      disclaimer
    }
  }
`;

const { result, error, loading } = useQuery(articleQuery, {
  slug,
});

const article = computed(() => result?.value?.mihai_ltd_articles[0]);

const author = ref("Mihai Farcas");
useSeoMeta({
  title: article.value?.title,
  author: "Mihai Farcas",
  description: article.value?.description,
  articleModifiedTime: article.value?.date_updated,
  articlePublishedTime: article.value?.date_updated,
  ogImage: article.value?.cover_image,
  ogType: "article",
  ogDescription: article.value?.description,
});
</script>
