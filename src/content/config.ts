import { z, defineCollection } from "astro:content"
const recipes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    time: z.string(),
    difficulty: z.number(),
    rating: z.number(),
    price: z.string(),
    spicy: z.number(),
    veg: z.number(),
    asian: z.boolean(),
  }),
})
const root = defineCollection({
  type: "content",
})
// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  recipes,
  root,
}
