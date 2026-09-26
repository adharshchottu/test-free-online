import type { APIRoute } from 'astro';

// Every .astro page is listed automatically, so new tools and blog posts can't be forgotten
const pageFiles = Object.keys(import.meta.glob('./**/*.astro'));
const excludedPages = ['./404.astro'];

const toPath = (file: string) =>
    file
        .replace(/^\./, '')
        .replace(/\.astro$/, '')
        .replace(/(^|\/)index$/, '$1')
        .replace(/([^/])$/, '$1/');

export const GET: APIRoute = ({ site }) => {
    const urls = pageFiles
        .filter((file) => !excludedPages.includes(file))
        .map((file) => new URL(toPath(file), site).href)
        .sort();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
};
