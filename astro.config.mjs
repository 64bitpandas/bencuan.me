import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://bencuan.me',
  integrations: [react(), sitemap(), mdx()],
  output: "server",
  adapter: netlify()
});
