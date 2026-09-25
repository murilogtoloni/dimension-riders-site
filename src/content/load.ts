import type { MarkdownInstance } from 'astro';
import type { Locale } from '../i18n';

export type DocName = 'fold' | 'privacy';

const docs = import.meta.glob<MarkdownInstance<Record<string, unknown>>>('./*.md', { eager: true });

/** O Markdown de uma página num idioma. Lança se o arquivo faltar: página sem tradução é bug de build. */
export function loadDoc(name: DocName, locale: Locale): MarkdownInstance<Record<string, unknown>> {
  const doc = docs[`./${name}.${locale}.md`];
  if (!doc) throw new Error(`content: falta src/content/${name}.${locale}.md`);
  return doc;
}
