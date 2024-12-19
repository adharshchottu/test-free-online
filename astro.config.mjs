import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";

import svelte from '@astrojs/svelte';

import vue from '@astrojs/vue';

import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.test-free.online',
  integrations: [react(), tailwind(), svelte(), vue()],
  adapter: vercel()
});