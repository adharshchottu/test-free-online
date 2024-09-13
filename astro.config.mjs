import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

import svelte from '@astrojs/svelte';

export default defineConfig({
  site: 'https://test-free.online',
  integrations: [react(), tailwind(), sitemap(), svelte()]
});