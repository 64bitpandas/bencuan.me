import { defineCollection, z } from 'astro:content';

const root = defineCollection({
  type: 'content',
});
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.string(),
    category: z.enum(['publications', 'play']),
    image: z.optional(z.string()),
    hideTitle: z.optional(z.boolean()),
    /** Path to a custom SCSS file for this blog post (relative to src/) */
    customStyles: z.optional(z.string()),
    /** Maximum heading level to include in TOC (1-6, default: 2 for h1+h2) */
    maxTocLevel: z.optional(z.number().min(1).max(6)),
  }),
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  root,
  blog,
};
