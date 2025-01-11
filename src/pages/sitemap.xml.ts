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
        { loc: "https://www.test-free.online/", changefreq: "daily" },
        { loc: "https://www.test-free.online/blog/", changefreq: "daily" },
        {
            loc: "https://www.test-free.online/blog/comment-tester-sse-en-ligne/",
            changefreq: "daily",
        },
        {
            loc: "https://www.test-free.online/blog/how-to-test-sse-online/",
            changefreq: "daily",
        },
        { loc: "https://www.test-free.online/blog/how-to-test-redis-lua-script-online", changefreq: "daily" },
        { loc: "https://www.test-free.online/blog/comment-utiliser-le-testeur-en-ligne-de-script-lua-redis", changefreq: "daily" },
        {
            loc: "https://www.test-free.online/kroenger-poster-generator/",
            changefreq: "daily",
        },
        {
            loc: "https://www.test-free.online/life-time-calculator/",
            changefreq: "daily",
        },
        { loc: "https://www.test-free.online/redis-lua/", changefreq: "daily" },
        { loc: "https://www.test-free.online/slide-puzzle/", changefreq: "daily" },
        { loc: "https://www.test-free.online/sse/", changefreq: "daily" },
        { loc: "https://www.test-free.online/sudoku/", changefreq: "daily" },
        {
            loc: "https://www.test-free.online/typinks-poster-generator/",
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