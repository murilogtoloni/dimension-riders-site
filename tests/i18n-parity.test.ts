import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, LOCALES, flattenKeys } from '../src/i18n';

const dir = fileURLToPath(new URL('../src/i18n', import.meta.url));
const load = (locale: string) => JSON.parse(readFileSync(join(dir, `${locale}.json`), 'utf8'));

describe('paridade dos dicionários', () => {
  const files = readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
  const reference = new Set(flattenKeys(load(DEFAULT_LOCALE)));

  it('todo idioma da lista tem arquivo, e todo arquivo está na lista', () => {
    expect([...files].sort()).toEqual([...LOCALES].sort());
  });

  for (const locale of files) {
    it(`${locale}.json tem exatamente as chaves de ${DEFAULT_LOCALE}.json`, () => {
      const keys = new Set(flattenKeys(load(locale)));
      const missing = [...reference].filter((k) => !keys.has(k));
      const extra = [...keys].filter((k) => !reference.has(k));
      expect({ missing, extra }).toEqual({ missing: [], extra: [] });
    });

    it(`${locale}.json não tem texto vazio`, () => {
      const dict = load(locale);
      const empty = flattenKeys(dict).filter((k) => String(k.split('.').reduce((n, p) => n[p], dict)).trim() === '');
      expect(empty).toEqual([]);
    });
  }
});
