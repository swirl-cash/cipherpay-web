import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Single-locale site: English only, served at clean unprefixed URLs
  // via next.config rewrites. 'as-needed' keeps generated links clean
  // (/docs, not /en/docs); no middleware is needed with one locale.
  locales: ['en'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});
