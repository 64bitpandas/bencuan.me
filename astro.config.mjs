import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import AutoImport from 'astro-auto-import';
import { defineConfig } from 'astro/config';
import emoji from 'remark-emoji';
import wikiLinkPlugin from 'remark-wiki-link';

// https://astro.build/config
const SITE = 'https://bencuan.me';
export default defineConfig({
  site: SITE,
  integrations: [
    react(),
    AutoImport({
      // Overriden markdown components can be found in the exports for blog.tsx
      imports: [
        {
          './src/components/blog.tsx': [
            ['Footnote', 'Footnote'],
            ['FootnoteRef', 'FootnoteRef'],
            ['Caption', 'Caption'],
            ['Endcard', 'Endcard'],
          ],
        },
      ],
    }),
    sitemap(),
    mdx(),
  ],
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
      [
        emoji,
        {
          accessible: true,
        },
      ],
    ],
    gfm: true,
  },
  redirects: {
    '/foreword': '/blog/foreword',
  },
});
