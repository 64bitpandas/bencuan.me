import { defineCollection, z } from 'astro:content';

const recipes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    time: z.number(),
    difficulty: z.number(),
    rating: z.number(),
    price: z.string(),
    spicy: z.number(),
    veg: z.number(),
    asian: z.boolean(),
  }),
});
const root = defineCollection({
  type: 'content',
});
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
  }),
});
const library = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string(),
    place: z.string(),
    image: z.string(),
    rating: z.number(),
    description: z.string(),
    genres: z.array(z.string()),
    placeUrl: z.optional(z.string()),
  }),
});
// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  recipes,
  root,
  blog,
  library,
};