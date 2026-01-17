import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        date: z.string(),
        tags: z.array(z.string()).default([]),
        type: z.string().default('blog_post'),
        cover_image: z.string().optional()
      })
    }),
    books: defineCollection({
      type: 'page',
      source: 'books/*.md',
      schema: z.object({
        date: z.string().optional(),
        tags: z.array(z.string()).default([]),
        type: z.string().default('book_summary'),
        cover_image: z.string().optional()
      })
    })
  }
})
