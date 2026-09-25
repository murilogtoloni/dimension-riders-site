import { describe, expect, it } from 'vitest';
import en from '../src/i18n/en.json';
import { flattenKeys } from '../src/i18n';

/** Texto narrativo, onde "fold" pode ser verbo. A regra vale para a interface. */
const NARRATIVE = new Set(['hero.opening']);
/** Usos permitidos: o nome do mundo e a expressão idiomática. */
const ALLOWED = /\b(the|into the) fold\b/gi;
const VERB = /\bfold(s|ed|ing)?\b/i;

const leaf = (key: string) => String(key.split('.').reduce((node: any, part) => node[part], en));

describe('"fold" nunca é verbo na interface em inglês', () => {
  for (const key of flattenKeys(en)) {
    if (NARRATIVE.has(key)) continue;
    it(key, () => {
      expect(leaf(key).replace(ALLOWED, '')).not.toMatch(VERB);
    });
  }
});
