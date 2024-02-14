import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap";
import wikiLinkPlugin from "remark-wiki-link";

// https://astro.build/config
const SITE = 'https://bencuan.me'
export default defineConfig({
  site: SITE,
  integrations: [react(), sitemap(), mdx()],
  output: "server",
  adapter: netlify(),
  markdown: {
    remarkPlugins: [
      [wikiLinkPlugin, { 
        hrefTemplate: (link) => `${SITE}/${link}`,
        wikiLinkClassName: 'internal-link',
        aliasDivider: '|',
      }],
    ],
    gfm: true,
  }
});
