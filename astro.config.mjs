import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

import svelte from '@astrojs/svelte';

import vue from '@astrojs/vue';

import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.test-free.online',
  integrations: [react(), tailwind(), sitemap(), svelte(), vue()],
  adapter: vercel(),
  routes: [
    {
      path: '/sitemap.xml',
      entry: './src/components/sitemap.astro',
    },
  ],
});