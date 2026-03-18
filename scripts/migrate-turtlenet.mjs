#!/usr/bin/env node
/**
 * Migration script for TurtleNet content from devlog repo.
 * Downloads markdown files, images, transforms content.
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, extname } from 'path';

const BASE_URL = 'https://raw.githubusercontent.com/64bitpandas/devlog/main';
const IMG_DIR = 'public/img/turtlenet';
const CONTENT_DIR = 'src/content/turtlenet';

// Content map: source filename -> output config
const CONTENT_MAP = [
  { src: 'clcsr3dzc000208jshr1s9w83.md', out: '0-welcome-to-turtlenet.md', slug: 'welcome-to-turtlenet', order: 0, title: 'Welcome to TurtleNet!', date: '2023-01-10' },
  { src: 'cld8i1khi000g09l51w9bbz1z.md', out: '1-setup.md', slug: '1-setup', order: 1, title: 'TurtleNet 1: Setup, and The Big Picture', date: '2023-01-23' },
  { src: 'cld8i2ix3000h09l5g0vn1go6.md', out: '1.5-pc-part-picking.md', slug: '15-pc-part-picking', order: 1.5, title: 'TurtleNet 1.5: PC Part Picking for small homelabs', date: '2023-01-23' },
  { src: 'clftak0qs001209micbxf6dbp.md', out: '2-proxmox.md', slug: '2-proxmox', order: 2, title: 'TurtleNet 2: Getting Started with Proxmox', date: '2023-03-29' },
  { src: 'clftbpvfh00010ajt3gkt536n.md', out: '2.5-gpu-passthrough.md', slug: '25-gpu-passthrough', order: 2.5, title: 'TurtleNet 2.5: GPU Passthrough with Proxmox', date: '2023-03-29' },
  { src: 'clg9zrtb1000009l3ayva8l1a.md', out: '3-zerotier.md', slug: '3-zerotier', order: 3, title: 'TurtleNet 3: ZeroTier and Private Networking', date: '2023-04-09' },
  { src: 'clip5vrxd000309k2gyz2fuds.md', out: '4-reverse-proxying.md', slug: 'turtlenet-4-reverse-proxying-your-first-service', order: 4, title: 'TurtleNet 4: Reverse Proxying Your First Service', date: '2023-06-09' },
  { src: 'cliqawqbf000409mm89tn5yk0.md', out: '5-public-networking.md', slug: '5-public-networking', order: 5, title: 'TurtleNet 5: Public Networking', date: '2023-06-10' },
  { src: 'cliwn6k1u000j09mk6c45a4gq.md', out: '6-nas.md', slug: '6-nas', order: 6, title: 'TurtleNet 6: Network Attached Storage (NAS)', date: '2023-06-15' },
  { src: 'cliwv5pa4001k09mi3pv16hvz.md', out: '7-backups.md', slug: 'turtlenet-7-backups', order: 7, title: 'TurtleNet 7: Backups', date: '2023-06-15' },
  { src: 'cliww1xdj000o09mf4u5o2q15.md', out: '8-end-of-season-1.md', slug: 'turtlenet-end-of-season-1', order: 8, title: 'TurtleNet: End of Season 1', date: '2023-06-15' },
];

// Slug mapping for internal link transformation
const SLUG_MAP = {
  'welcome-to-turtlenet': 'welcome-to-turtlenet',
  '1-setup': '1-setup',
  '15-pc-part-picking': '15-pc-part-picking',
  '2-proxmox': '2-proxmox',
  '25-gpu-passthrough': '25-gpu-passthrough',
  '3-zerotier': '3-zerotier',
  'turtlenet-4-reverse-proxying-your-first-service': 'turtlenet-4-reverse-proxying-your-first-service',
  '5-public-networking': '5-public-networking',
  '6-nas': '6-nas',
  'turtlenet-7-backups': 'turtlenet-7-backups',
  'turtlenet-end-of-season-1': 'turtlenet-end-of-season-1',
};

mkdirSync(IMG_DIR, { recursive: true });
mkdirSync(CONTENT_DIR, { recursive: true });

let imageCounter = 0;
const downloadedImages = new Map(); // url -> local path

async function downloadImage(url, prefix) {
  if (downloadedImages.has(url)) return downloadedImages.get(url);

  try {
    const res = await fetch(url);
    if (!res.ok) { console.error(`  Failed to download ${url}: ${res.status}`); return url; }
    const buffer = Buffer.from(await res.arrayBuffer());

    // Determine extension from URL or content-type
    let ext = extname(new URL(url).pathname) || '.png';
    if (ext.includes('?')) ext = ext.split('?')[0];
    if (!ext || ext === '.') ext = '.png';

    imageCounter++;
    const filename = `${prefix}-${imageCounter}${ext}`;
    const localPath = join(IMG_DIR, filename);
    writeFileSync(localPath, buffer);
    const webPath = `/img/turtlenet/${filename}`;
    downloadedImages.set(url, webPath);
    console.log(`  Downloaded: ${filename}`);
    return webPath;
  } catch (e) {
    console.error(`  Error downloading ${url}: ${e.message}`);
    return url;
  }
}

function stripHashnodeFrontmatter(content) {
  if (content.startsWith('---')) {
    const endIdx = content.indexOf('---', 3);
    if (endIdx !== -1) {
      return content.slice(endIdx + 3).trim();
    }
  }
  return content.trim();
}

async function transformContent(content, prefix) {
  let result = content;

  // 1. Download and replace cdn.hashnode.com images
  const hashnodeRegex = /https:\/\/cdn\.hashnode\.com\/res\/hashnode\/image\/upload\/[^\s)"\]]+/g;
  const hashnodeUrls = [...new Set(result.match(hashnodeRegex) || [])];

  for (const url of hashnodeUrls) {
    const localPath = await downloadImage(url, prefix);
    // Replace all occurrences of this URL
    result = result.split(url).join(localPath);
  }

  // 2. Remove align="center" and align="left" from image markdown
  result = result.replace(/ align="center"/g, '');
  result = result.replace(/ align="left"/g, '');

  // 3. Convert %[https://youtube.com/...] or %[https://www.youtube.com/...] to markdown links
  result = result.replace(/%\[(https:\/\/(?:www\.)?youtube\.com\/[^\]]+)\]/g, (_, url) => {
    // Extract video ID for embed
    const match = url.match(/(?:watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (match) {
      return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${match[1]}" frameborder="0" allowfullscreen></iframe>`;
    }
    return `[YouTube Video](${url})`;
  });

  // Also handle youtu.be short links
  result = result.replace(/%\[(https:\/\/youtu\.be\/[^\]]+)\]/g, (_, url) => {
    const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${match[1]}" frameborder="0" allowfullscreen></iframe>`;
    }
    return `[YouTube Video](${url})`;
  });

  // 4. Transform internal links: https://devlog.bencuan.me/{slug} -> /turtlenet/{slug}
  result = result.replace(/https:\/\/devlog\.bencuan\.me\/([a-zA-Z0-9_-]+)/g, (match, slug) => {
    if (SLUG_MAP[slug]) {
      return `/turtlenet/${SLUG_MAP[slug]}`;
    }
    // If not in map, still transform
    return `/turtlenet/${slug}`;
  });

  // 5. Remove Hashnode-specific iframes (Figma embeds etc)
  result = result.replace(/<iframe[^>]*figma\.com\/embed[^>]*><\/iframe>/g, '');

  // 6. Clean up any remaining Hashnode HTML artifacts
  // Remove empty lines left by removed elements (collapse multiple blank lines to max 2)
  result = result.replace(/\n{3,}/g, '\n\n');

  return result;
}

async function processFile(entry) {
  console.log(`\nProcessing: ${entry.src} -> ${entry.out}`);

  const res = await fetch(`${BASE_URL}/${entry.src}`);
  if (!res.ok) { console.error(`Failed to fetch ${entry.src}: ${res.status}`); return; }
  let content = await res.text();

  // Strip existing frontmatter
  content = stripHashnodeFrontmatter(content);

  // Strip leading H1 title (it's in frontmatter now)
  content = content.replace(/^# .+\n+/, '');

  // Get prefix for image naming from output filename
  const prefix = entry.out.replace('.md', '');

  // Transform content
  content = await transformContent(content, prefix);

  // Determine cover image
  let coverLine = '';
  // Check if original had a cover in frontmatter
  const origRes = await fetch(`${BASE_URL}/${entry.src}`);
  const origContent = await origRes.text();
  const coverMatch = origContent.match(/cover:\s*(https:\/\/cdn\.hashnode\.com\/[^\s]+)/);
  if (coverMatch) {
    const coverPath = await downloadImage(coverMatch[1], `${prefix}-cover`);
    coverLine = `cover: "${coverPath}"`;
  }

  // Build new frontmatter
  const frontmatter = [
    '---',
    `title: "${entry.title}"`,
    `datePublished: ${entry.date}`,
    `slug: "${entry.slug}"`,
    coverLine ? coverLine : null,
    `order: ${entry.order}`,
    '---',
  ].filter(Boolean).join('\n');

  const finalContent = `${frontmatter}\n\n${content.trim()}\n`;

  writeFileSync(join(CONTENT_DIR, entry.out), finalContent);
  console.log(`  Written: ${entry.out}`);
}

async function main() {
  console.log('Starting TurtleNet content migration...\n');

  for (const entry of CONTENT_MAP) {
    await processFile(entry);
  }

  console.log('\n\nMigration complete!');
  console.log(`Total images downloaded: ${imageCounter}`);
  console.log(`Files created: ${CONTENT_MAP.length}`);
}

main().catch(console.error);

