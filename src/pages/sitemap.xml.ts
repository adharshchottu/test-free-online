import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
    const baseUrl = "https://tools.typinks.com";

    const sitemapItems = [
        // Pages from src/pages
        { loc: `${baseUrl}/`, changefreq: "daily" },
        { loc: `${baseUrl}/kroenger-poster-generator/`, changefreq: "daily" },
        { loc: `${baseUrl}/life-time-calculator/`, changefreq: "daily" },
        { loc: `${baseUrl}/prelims-marks-calculator/`, changefreq: "daily" },
        { loc: `${baseUrl}/redis-lua/`, changefreq: "daily" },
        { loc: `${baseUrl}/slide-puzzle/`, changefreq: "daily" },
        { loc: `${baseUrl}/sse/`, changefreq: "daily" },
        { loc: `${baseUrl}/sudoku/`, changefreq: "daily" },
        { loc: `${baseUrl}/typinks-poster-generator/`, changefreq: "daily" },

        // Pages from src/pages/blog
        { loc: `${baseUrl}/blog/comment-jouer-au-jeu-puzzle-coulissant-en-ligne/`, changefreq: "daily" },
        { loc: `${baseUrl}/blog/comment-jouer-au-sudoku-en-ligne-gratuit-illimite/`, changefreq: "daily" },
        { loc: `${baseUrl}/blog/comment-tester-sse-en-ligne/`, changefreq: "daily" },
        { loc: `${baseUrl}/blog/comment-utiliser-le-calculateur-notes-examens-preliminaires-en-ligne/`, changefreq: "daily" },
        { loc: `${baseUrl}/blog/comment-utiliser-le-calculateur-temps-vie-en-ligne/`, changefreq: "daily" },
        { loc: `${baseUrl}/blog/comment-utiliser-le-generateur-affiches-kroenger-en-ligne/`, changefreq: "daily" },
        { loc: `${baseUrl}/blog/comment-utiliser-le-generateur-affiches-typinks-en-ligne/`, changefreq: "daily" },
        { loc: `${baseUrl}/blog/comment-utiliser-le-testeur-en-ligne-de-script-lua-redis/`, changefreq: "daily" },
        { loc: `${baseUrl}/blog/how-to-play-slide-puzzle-game-online/`, changefreq: "daily" },
        { loc: `${baseUrl}/blog/how-to-play-sudoku-online-free-unlimited/`, changefreq: "daily" },
        { loc: `${baseUrl}/blog/how-to-test-redis-lua-script-online/`, changefreq: "daily" },
        { loc: `${baseUrl}/blog/how-to-test-sse-online/`, changefreq: "daily" },
        { loc: `${baseUrl}/blog/how-to-use-kroenger-poster-generator-online/`, changefreq: "daily" },
        { loc: `${baseUrl}/blog/how-to-use-life-time-calculator-online/`, changefreq: "daily" },
        { loc: `${baseUrl}/blog/how-to-use-prelims-marks-calculator-online/`, changefreq: "daily" },
        { loc: `${baseUrl}/blog/how-to-use-typinks-poster-generator-online/`, changefreq: "daily" },
    ];

    const now = new Date().toISOString();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemapItems
            .map(
                (item) => `
        <url>
          <loc>${item.loc}</loc>
          <lastmod>${now}</lastmod>
          <changefreq>${item.changefreq}</changefreq>
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