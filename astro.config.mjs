import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import AutoImport from 'astro-auto-import';
import { defineConfig } from 'astro/config';
import fs from 'fs';
import path from 'path';
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
        {
          './src/components/research-syllabus/index.ts': [
            ['ResearchBanner', 'ResearchBanner'],
            ['TopicBadge', 'TopicBadge'],
            ['BigQuestionsBox', 'BigQuestionsBox'],
            ['ReadingListBox', 'ReadingListBox'],
            ['SectionWrapper', 'SectionWrapper'],
          ],
        },
      ],
    }),
    sitemap({
      lastmod: new Date().toISOString(),
      serialize(item) {
        // Extract the path from the URL and find the corresponding built HTML file
        const filePathSequence = item.url.replace(SITE, '').split('/').filter(Boolean);
        const filePath = path.join(import.meta.dirname, 'dist', ...filePathSequence, 'index.html');

        try {
          const fileContent = fs.readFileSync(filePath).toString();
          const lastmodMatch = fileContent.match(/data-lastmod="(.+?)"/);

          if (lastmodMatch && lastmodMatch[1]) {
            item.lastmod = new Date(lastmodMatch[1]).toISOString();
          } else {
            // Default to current build date if no data-lastmod found
            item.lastmod = new Date().toISOString();
          }
        } catch {
          // If file can't be read, default to current build date
          item.lastmod = new Date().toISOString();
        }
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
    '/blog/vibe25': 'https://garden.bencuan.me/blog/vibecode',
  },
});
