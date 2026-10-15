import type { APIRoute } from 'astro';
import { HTML_LANG, LOCALES, PAGES, localePath } from '../i18n';

/** Sitemap com as duas versões de cada página ligadas por hreflang (#450). A raiz só redireciona: fica de fora. */
export const GET: APIRoute = ({ site }) => {
  const abs = (path: string) => new URL(path, site).toString();
  const urls = PAGES.flatMap((page) => LOCALES.map((locale) => {
    const alternates = [
      ...LOCALES.map((l) => `    <xhtml:link rel="alternate" hreflang="${HTML_LANG[l]}" href="${abs(localePath(l, page))}"/>`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(localePath('en', page))}"/>`,
    ];
    return `  <url>\n    <loc>${abs(localePath(locale, page))}</loc>\n${alternates.join('\n')}\n  </url>`;
  }));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
