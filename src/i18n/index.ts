import en from './en.json';
import pt from './pt.json';

export const LOCALES = ['en', 'pt'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/** Valor do atributo lang do <html> e dos hreflang. */
export const HTML_LANG: Record<Locale, string> = { en: 'en', pt: 'pt-BR' };

/** Valor de og:locale por idioma. */
export const OG_LOCALE: Record<Locale, string> = { en: 'en_US', pt: 'pt_BR' };

export const PAGES = ['home', 'fold', 'download', 'privacy', 'support', 'terms'] as const;
export type Page = (typeof PAGES)[number];

/** Slug de cada página em cada idioma. '' é a raiz do idioma (Início). */
export const ROUTES: Record<Page, Record<Locale, string>> = {
  home: { en: '', pt: '' },
  fold: { en: 'fold', pt: 'dobra' },
  download: { en: 'download', pt: 'baixar' },
  privacy: { en: 'privacy', pt: 'privacidade' },
  support: { en: 'support', pt: 'suporte' },
  terms: { en: 'terms', pt: 'termos' },
};

type Dictionary = Record<string, unknown>;
const DICTIONARIES: Record<Locale, Dictionary> = { en, pt };

function lookup(dict: Dictionary, key: string): unknown {
  return key.split('.').reduce<unknown>(
    (node, part) => (node && typeof node === 'object' ? (node as Dictionary)[part] : undefined),
    dict,
  );
}

/** Texto da chave "a.b.c" no idioma; substitui {nome} por vars.nome. Lança se faltar: texto faltando é bug de build. */
export function t(locale: Locale, key: string, vars: Record<string, string> = {}): string {
  const value = lookup(DICTIONARIES[locale], key);
  if (typeof value !== 'string') throw new Error(`i18n: chave "${key}" não existe em "${locale}"`);
  return value.replace(/\{(\w+)\}/g, (match, name: string) => vars[name] ?? match);
}

/** Caminho absoluto (com base) de uma página num idioma, sempre com barra no fim. */
export function localePath(locale: Locale, page: Page, base: string = import.meta.env.BASE_URL): string {
  const root = base.replace(/\/+$/, '');
  const slug = ROUTES[page][locale];
  return slug ? `${root}/${locale}/${slug}/` : `${root}/${locale}/`;
}

/** Chaves folha de um dicionário no formato "a.b.c". Usado pelos testes. */
export function flattenKeys(obj: Dictionary, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === 'object'
      ? flattenKeys(value as Dictionary, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
}
