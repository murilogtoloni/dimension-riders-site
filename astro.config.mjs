import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://dimensionriders.app',
  base: '/',
  trailingSlash: 'always',
  i18n: {
    locales: ['en', { path: 'pt', codes: ['pt-BR', 'pt'] }],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
});
