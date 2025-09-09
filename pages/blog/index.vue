<template>
  <div class="grid grid-cols-1 gap-4 px-12 py-6 lg:grid-cols-2 xl:grid-cols-3">
    <div v-for="article in articles" :key="article.slug">
      <NuxtLink :to="`/blog/${article.slug}`">
        <div
          class="h-full rounded-lg bg-black/30 p-3 px-12 py-6 shadow-lg duration-500 hover:bg-black/50"
        >
          <NuxtImg
            provider="directus"
            :src="article.cover_image?.id"
            :alt="article.cover_image?.title || 'Cover image'"
            class="h-48 w-full rounded-t-lg object-cover object-top"
          />
          <div class="p-4">
            <h2 class="line-clamp-3 text-xl font-bold">{{ article.title }}</h2>
            <div class="py-2"></div>
            <p class="line-clamp-3 text-gray-500">
              {{ article.description }}
            </p>
            <div class="py-1"></div>
            <!-- a tab of article type -->
            <div class="pt-2"></div>
            <div class="flex flex-row gap-2">
              <div
                class="inline-block rounded-lg bg-blue-500 px-2 py-2 text-xs font-semibold text-white"
              >
                {{ article.type }}
              </div>
              <div
                v-for="tag in article.tags"
                :key="tag"
                class="inline-block rounded-lg bg-gray-600 px-2 py-2 text-xs font-semibold text-white"
              >
                {{ tag }}
              </div>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const pageNumber = Number(route.query.page) || 1;

const articlesQuery = gql`
  query getArticles($pageNumber: Int!) {
    mihai_ltd_articles(limit: 10, page: $pageNumber, sort: "date_updated") {
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
      content
      tags
    }
  }
`;

const { result } = useQuery(articlesQuery, {
  pageNumber,
});

const articles = computed(() => {
  return result.value?.mihai_ltd_articles || [];
});

useSeoMeta({
  title: "Blog - Let's Talk Dev",
  description:
    "Read the latest articles from Mihai Farcas. Learn about web development, programming, and more. Mihai is a full-stack developer and content creator.",
  author: "Mihai Farcas",
});
</script>
