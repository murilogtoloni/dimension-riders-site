import { describe, expect, it } from 'vitest';
import en from '../src/i18n/en.json';
import pt from '../src/i18n/pt.json';
import { read } from './helpers';

describe('blocos e galeria da Início', () => {
  it('mostra os três blocos nos dois idiomas', () => {
    const enHtml = read('/en/index.html');
    const ptHtml = read('/pt/index.html');
    for (const key of ['ride', 'seal', 'tyrants'] as const) {
      expect(enHtml).toContain(en.features[key].title);
      expect(ptHtml).toContain(pt.features[key].title);
    }
  });

  it('galeria tem quatro capturas, legendas e alternativa no idioma da página', () => {
    for (const [locale, dict] of [['en', en], ['pt', pt]] as const) {
      const html = read(`/${locale}/index.html`);
      expect(html).toContain(dict.gallery.title);
      expect(html.match(/class="gallery-track"/g)?.length).toBe(1);
      for (const key of ['forest', 'gear', 'lava', 'arsenal'] as const) {
        expect(html).toContain(dict.gallery[key]);
        expect(html).toContain(`alt="${dict.gallery[`${key}Alt`]}"`);
      }
      expect(html).not.toContain('feature-placeholder');
    }
  });
});
