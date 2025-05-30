import type { APIRoute } from 'astro';

interface SiteMapItem {
    loc: string;
    lastmod?: string;
    changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
    priority?: number;
}

export const GET: APIRoute = ({ site }) => {
    const sitemapItems: SiteMapItem[] = [
        { loc: "https://tools.typinks.com/", changefreq: "daily" },
        { loc: "https://tools.typinks.com/blog/", changefreq: "daily" },
        {
            loc: "https://tools.typinks.com/blog/comment-tester-sse-en-ligne/",
            changefreq: "daily",
        },
        {
            loc: "https://tools.typinks.com/blog/how-to-test-sse-online/",
            changefreq: "daily",
        },
        { loc: "https://tools.typinks.com/blog/how-to-test-redis-lua-script-online", changefreq: "daily" },
        { loc: "https://tools.typinks.com/blog/comment-utiliser-le-testeur-en-ligne-de-script-lua-redis", changefreq: "daily" },
        {
            loc: "https://tools.typinks.com/kroenger-poster-generator/",
            changefreq: "daily",
        },
        {
            loc: "https://tools.typinks.com/life-time-calculator/",
            changefreq: "daily",
        },
        { loc: "https://tools.typinks.com/redis-lua/", changefreq: "daily" },
        { loc: "https://tools.typinks.com/slide-puzzle/", changefreq: "daily" },
        { loc: "https://tools.typinks.com/sse/", changefreq: "daily" },
        { loc: "https://tools.typinks.com/sudoku/", changefreq: "daily" },
        {
            loc: "https://tools.typinks.com/typinks-poster-generator/",
            changefreq: "daily",
        },
    ];

    const now = new Date().toISOString();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemapItems
            .map(
                (item) => `
        <url>
          <loc>${item.loc}</loc>
          ${item.lastmod ? `<lastmod>${now}</lastmod>` : ""}
          ${item.changefreq ? `<changefreq>${item.changefreq}</changefreq>` : ""}
          ${item.priority ? `<priority>${item.priority}</priority>` : ""}
        </url>
      `
            )
            .join("")}
    </urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
};