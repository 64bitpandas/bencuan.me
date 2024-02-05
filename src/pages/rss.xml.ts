import rss from '@astrojs/rss';

export function GET(context: { site: any; }) {
    return rss({
        // `<title>` field in output xml
        title: 'bencuan',
        // `<description>` field in output xml
        description: 'I build things and write about them sometimes.',
        // Pull in your project "site" from the endpoint context
        // https://docs.astro.build/en/reference/api-reference/#contextsite
        site: context.site,
        // Array of `<item>`s in output xml
        // See "Generating items" section for examples using content collections and glob imports
        items: [],
        // (optional) inject custom xml
        customData: `<language>en-us</language>`,
    });
}
