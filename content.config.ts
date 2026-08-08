import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/*.md",
      schema: z.object({
        date: z.string(),
        tags: z.array(z.string()).default([]),
        type: z.string().default("blog_post"),
        cover_image: z.string().optional(),
      }),
    }),
    books: defineCollection({
      type: "page",
      source: "books/*.md",
      schema: z.object({
        // Date read/added — distinct from publishedDate below.
        date: z.string().optional(),
        tags: z.array(z.string()).default([]),
        type: z.string().default("book_summary"),
        cover_image: z.string().optional(),
        author: z.string().optional(),
        // 0-5, matches Calibre's star rating. Omitted (not 0) when unrated.
        rating: z.number().min(0).max(5).optional(),
        isbn: z.string().optional(),
        goodreads: z.string().optional(),
        publisher: z.string().optional(),
        // The book's own publication date, as opposed to `date` (when read).
        publishedDate: z.string().optional(),
      }),
    }),
    radar: defineCollection({
      type: "page",
      source: "radar/*.md",
      schema: z.object({
        date: z.string().optional(),
        tags: z.array(z.string()).default([]),
        type: z.string().default("tech_report"),
        cover_image: z.string().optional(),
        // Radar-specific fields
        // Where this technology shows up on the radar. An array so the same
        // entry can appear in more than one place at once — e.g. TypeScript
        // under both front_end and back_end, or GitHub under both CI/CD and
        // project_management — without duplicating the underlying report.
        placements: z
          .array(
            z.object({
              category: z.enum([
                "languages_and_frameworks",
                "platforms",
                "tools",
                "techniques",
              ]),
              subCategory: z.string(),
            }),
          )
          .min(1),
        // How far the hands-on evaluation has gone. Independent of any decision below.
        stage: z.enum(["assess", "trial"]),
        // Confidence/progress within the current stage, 0-4 (ThoughtWorks-style radar score)
        evaluatedScore: z.number().min(0).max(4).default(0),
        // How happy we are having adopted/trialed it, 0-5. Independent of evaluatedScore.
        satisfaction: z.number().min(0).max(5).optional(),
        // The verdict, once one has been made. Absent = still actively evaluating.
        decision: z.enum(["adopt", "hold", "reject"]).optional(),
        // Why the decision was made
        decisionReason: z.string().optional(),
        // Slug of the technology this decision favors (content/radar/<slug>.md) — reject or hold
        decisionInFavorOf: z.string().optional(),
        // Free-text condition for revisiting a hold, e.g. "revisit if they ship native MCP support"
        reviewTrigger: z.string().optional(),
        // When the decision was made
        decidedDate: z.string().optional(),
        link: z.string().optional(),
        logoPath: z.string().optional(),
        target: z.string().optional(),
      }),
    }),
  },
});
