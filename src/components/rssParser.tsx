export interface FeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  author?: string;
  guid?: string;
  categories?: string[];
  content?: string;
}

export interface ParsedFeed {
  title: string;
  description: string;
  link: string;
  lastBuildDate?: Date;
  items: FeedItem[];
  language?: string;
  feedType: 'rss' | 'atom';
}

export class RssParserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RssParserError';
  }
}

/**
 * Parses an RSS or Atom feed from a URL
 * @param url The URL of the feed to parse
 * @returns Promise<ParsedFeed> A parsed feed object
 * @throws {RssParserError} When the feed cannot be fetched or parsed
 * @example
 * ```typescript
 * try {
 *   const feed = await parseFeed('https://example.com/feed.xml');
 *   console.log(feed.title);
 *   feed.items.forEach(item => console.log(item.title));
 * } catch (error) {
 *   if (error instanceof RssParserError) {
 *     console.error('Feed parsing error:', error.message);
 *   }
 * }
 * ```
 */
export async function parseFeed(url: string): Promise<ParsedFeed> {
  try {
    console.log('downloading feed:', url);
    const response = await fetch(url, {
      mode: 'cors',
      method: 'GET',
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    if (!response.ok) {
      console.log('ERROR:', response, url);
      throw new RssParserError(`Failed to fetch feed: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    if (xmlDoc.querySelector('parsererror')) {
      throw new RssParserError('Invalid XML format');
    }

    const isAtom = Boolean(xmlDoc.querySelector('feed'));
    return isAtom ? parseAtomFeed(xmlDoc) : parseRssFeed(xmlDoc);
  } catch (error) {
    if (error instanceof RssParserError) {
      throw error;
    }
    throw new RssParserError(`Failed to parse feed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function parseRssFeed(xmlDoc: Document): ParsedFeed {
  const channel = xmlDoc.querySelector('channel');
  if (!channel) {
    throw new RssParserError('Invalid RSS feed: No channel element found');
  }

  const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
    title: getElementText(item, 'title'),
    link: getElementText(item, 'link'),
    description: getElementText(item, 'description'),
    pubDate: new Date(getElementText(item, 'pubDate')),
    author: getElementText(item, 'author') || undefined,
    guid: getElementText(item, 'guid') || undefined,
    categories: Array.from(item.querySelectorAll('category')).map(cat => cat.textContent || ''),
    content: getElementText(item, 'content:encoded') || undefined,
  }));

  return {
    title: getElementText(channel, 'title'),
    description: getElementText(channel, 'description'),
    link: getElementText(channel, 'link'),
    lastBuildDate: parseDate(getElementText(channel, 'lastBuildDate')),
    language: getElementText(channel, 'language') || undefined,
    items,
    feedType: 'rss',
  };
}

function parseAtomFeed(xmlDoc: Document): ParsedFeed {
  const feed = xmlDoc.querySelector('feed');
  if (!feed) {
    throw new RssParserError('Invalid Atom feed: No feed element found');
  }

  const items = Array.from(xmlDoc.querySelectorAll('entry')).map(entry => ({
    title: getElementText(entry, 'title'),
    link: entry.querySelector('link[rel="alternate"]')?.getAttribute('href') || '',
    description: getElementText(entry, 'summary') || getElementText(entry, 'content'),
    pubDate: new Date(getElementText(entry, 'published') || getElementText(entry, 'updated')),
    author: getElementText(entry, 'author name') || undefined,
    guid: getElementText(entry, 'id') || undefined,
    categories: Array.from(entry.querySelectorAll('category')).map(cat => cat.getAttribute('term') || ''),
    content: getElementText(entry, 'content') || undefined,
  }));

  return {
    title: getElementText(feed, 'title'),
    description: getElementText(feed, 'subtitle') || '',
    link: feed.querySelector('link[rel="alternate"]')?.getAttribute('href') || '',
    lastBuildDate: parseDate(getElementText(feed, 'updated')),
    items,
    feedType: 'atom',
  };
}

function getElementText(parent: Element, tagName: string): string {
  const element = parent.querySelector(tagName);
  return element?.textContent?.trim() || '';
}

function parseDate(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? undefined : date;
}

/**
 * Validates a feed URL
 * @param url The URL to validate
 * @throws {RssParserError} When the URL is invalid
 */
export function validateFeedUrl(url: string): void {
  try {
    new URL(url);
  } catch {
    throw new RssParserError('Invalid feed URL');
  }
}
