import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import en from '../src/i18n/en.json';
import pt from '../src/i18n/pt.json';
import { read } from './helpers';

const shotsDir = fileURLToPath(new URL('../src/images/shots', import.meta.url));
const shots = readdirSync(shotsDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

describe('blocos e galeria da Início', () => {
  it('mostra os três blocos nos dois idiomas', () => {
    const enHtml = read('/en/index.html');
    const ptHtml = read('/pt/index.html');
    for (const key of ['ride', 'seal', 'tyrants'] as const) {
      expect(enHtml).toContain(en.features[key].title);
      expect(ptHtml).toContain(pt.features[key].title);
    }
  });

  it('galeria: aviso quando não há capturas, imagens quando há', () => {
    const html = read('/en/index.html');
    expect(html).toContain(en.gallery.title);
    if (shots.length === 0) {
      expect(html).toContain(en.gallery.empty);
      expect(html).toContain('feature-placeholder');
    } else {
      expect(html).not.toContain(en.gallery.empty);
      expect(html.match(/class="gallery-track"/g)?.length).toBe(1);
      expect((html.match(/alt="Screenshot \d+ of Dimension Riders"/g) ?? []).length).toBe(shots.length);
    }
  });
});
