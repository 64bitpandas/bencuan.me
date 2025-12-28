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
    sitemap({
      lastmod: new Date(),
      serialize(item) {
        item.lastmod = undefined;
        return item;
      },
    }),
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
    '/friends': 'https://garden.bencuan.me/personal/friendnet',
    '/bookshelf': 'https://garden.bencuan.me/personal/bookshelf',
    '/about': '/',
    '/contact': 'https://garden.bencuan.me/Contact-Me',
    '/blog/sfstreets/route1': 'https://garden.bencuan.me/community/sfstreets-route-v1',
    '/blog/flights': 'https://garden.bencuan.me/guides/long-haul-flights',
    '/caltrain-trmnl': 'https://github.com/64bitpandas/trmnl-caltrain',
  },
});
