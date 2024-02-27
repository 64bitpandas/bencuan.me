import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import AutoImport from 'astro-auto-import';
import { defineConfig } from 'astro/config';
import wikiLinkPlugin from 'remark-wiki-link';

// https://astro.build/config
const SITE = 'https://bencuan.me';
export default defineConfig({
  site: SITE,
  integrations: [
    react(),
    AutoImport({
      imports: [
        {
          './src/components/blog.tsx': [
            ['Footnote', 'Footnote'],
            ['FootnoteRef', 'FootnoteRef'],
          ],
        },
      ],
    }),
    sitemap(),
    mdx(),
  ],
  output: 'server',
  adapter: netlify(),
  markdown: {
    remarkPlugins: [
      [
        wikiLinkPlugin,
        {
          hrefTemplate: link => `${SITE}/${link}`,
          wikiLinkClassName: 'internal-link',
          aliasDivider: '|',
        },
      ],
    ],
    gfm: true,
  },
});
