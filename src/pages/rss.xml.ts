import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

// https://docs.astro.build/en/guides/rss/#using-content-collections
export async function GET(context: { site: any }) {
  // this feed only includes blog posts for now
  const blog = await getCollection('blog');
  return rss({
    title: 'bencuan',
    description: 'I build things and write about them sometimes.',
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#contextsite
    site: context.site,
    items: blog.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: post.slug,
    })),
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
}
