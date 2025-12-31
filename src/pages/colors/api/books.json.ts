
import fs from 'node:fs/promises';
import path from 'node:path';

export async function GET() {
  const booksDir = path.join(process.cwd(), 'src/color-books');
  try {
    const files = await fs.readdir(booksDir);
    // Filter out hidden files and special files starting with _
    const books = files
      .filter(f => f.endsWith('.json') && !f.startsWith('_'))
      .map(f => f.replace('.json', '')); // just the name

    return new Response(JSON.stringify(books), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to list books' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
