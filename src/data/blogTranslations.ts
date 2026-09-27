// English blog slug -> French translation slug, used for hreflang links
export const blogTranslations: Record<string, string> = {
  "how-to-test-sse-online": "comment-tester-sse-en-ligne",
  "how-to-test-redis-lua-script-online": "comment-utiliser-le-testeur-en-ligne-de-script-lua-redis",
  "how-to-use-typinks-poster-generator-online": "comment-utiliser-le-generateur-affiches-typinks-en-ligne",
  "how-to-use-kroenger-poster-generator-online": "comment-utiliser-le-generateur-affiches-kroenger-en-ligne",
  "how-to-use-life-time-calculator-online": "comment-utiliser-le-calculateur-temps-vie-en-ligne",
  "how-to-use-prelims-marks-calculator-online": "comment-utiliser-le-calculateur-notes-examens-preliminaires-en-ligne",
  "how-to-play-slide-puzzle-game-online": "comment-jouer-au-jeu-puzzle-coulissant-en-ligne",
  "how-to-play-sudoku-online-free-unlimited": "comment-jouer-au-sudoku-en-ligne-gratuit-illimite",
  "how-to-use-free-online-text-editor": "comment-utiliser-editeur-texte-en-ligne-gratuit",
  "how-to-format-and-validate-json-online": "comment-formater-et-valider-json-en-ligne",
  "how-to-encode-decode-base64-url-online": "comment-encoder-decoder-base64-url-en-ligne",
  "how-to-decode-jwt-online": "comment-decoder-jwt-en-ligne",
  "how-to-test-regex-online": "comment-tester-regex-en-ligne",
  "how-to-read-cron-expressions-online": "comment-lire-expressions-cron-en-ligne",
  "how-to-generate-uuid-and-hash-online": "comment-generer-uuid-et-hash-en-ligne",
};

export const getBlogAlternates = (pathname: string) => {
  const slug = pathname.match(/^\/blog\/([^/]+)\/?$/)?.[1];
  if (!slug) return null;

  const englishSlug =
    slug in blogTranslations
      ? slug
      : Object.keys(blogTranslations).find((en) => blogTranslations[en] === slug);
  if (!englishSlug) return null;

  return {
    en: `/blog/${englishSlug}/`,
    fr: `/blog/${blogTranslations[englishSlug]}/`,
  };
};
