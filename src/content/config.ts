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
  }),
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  root,
  blog,
};
