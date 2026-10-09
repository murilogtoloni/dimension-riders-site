import { describe, expect, it } from 'vitest';
import en from '../src/i18n/en.json';
import pt from '../src/i18n/pt.json';
import { read } from './helpers';

const PAGES = [['/pt/dobra/index.html', pt], ['/en/fold/index.html', en]] as const;

describe('página da Dobra (#339)', () => {
  for (const [path, dict] of PAGES) {
    it(`${path}: cinco capítulos, índice apontando para eles, e a frase do jogo`, () => {
      const html = read(path);
      const chapters = [...html.matchAll(/<section[^>]* id="([^"]+)"[^>]* data-chapter="(\d)"/g)].map((m) => m[1]);
      expect(chapters.length).toBe(5);
      for (const id of chapters) expect(html).toContain(`href="#${id}"`);
      expect(html).toContain(path.startsWith('/pt') ? 'Proteja a Dobra. Sele as Fendas.' : 'Protect the Fold. Seal the Rifts.');
      expect(html).toContain(`<h1>${dict.fold.title}</h1>`);
    });

    it(`${path}: as cinco camadas e os cinco Tiranos, com nome e alternativa no idioma da página`, () => {
      const html = read(path);
      for (const key of ['forest', 'gear', 'lava', 'ice', 'reef'] as const) {
        expect(html).toContain(dict.fold.worlds[key].name);
        expect(html).toContain(`alt="${dict.fold.worlds[key].alt}"`);
        expect(html).toContain(dict.fold.cast[key].name);
        expect(html).toContain(`alt="${dict.fold.cast[key].alt}"`);
      }
    });

    it(`${path}: toda imagem tem alt, e a chamada leva ao download`, () => {
      const html = read(path);
      const imgs = [...html.matchAll(/<img\s[^>]*>/g)].map((m) => m[0]);
      expect(imgs.length).toBeGreaterThan(10);
      for (const img of imgs) expect(img).toMatch(/\balt(="|[\s>])/); // alt="" sai como alt (decorativa)
      expect(html).toContain(dict.fold.cta.title);
      expect(html).toContain(dict.buttons.android);
    });
  }

  it('os dois idiomas têm os mesmos capítulos, na mesma ordem', () => {
    const titles = (path: string) => [...read(path).matchAll(/data-chapter="(\d)"/g)].map((m) => m[1]).join('');
    expect(titles('/pt/dobra/index.html')).toBe('12345');
    expect(titles('/en/fold/index.html')).toBe('12345');
  });
});
