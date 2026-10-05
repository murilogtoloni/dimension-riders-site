import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DIST, read } from './helpers';

describe('páginas de texto', () => {
  it('A Dobra existe nos dois idiomas com o conteúdo certo', () => {
    expect(existsSync(`${DIST}/en/fold/index.html`)).toBe(true);
    expect(existsSync(`${DIST}/pt/dobra/index.html`)).toBe(true);
    expect(read('/en/fold/index.html')).toContain('<h2');
    expect(read('/en/fold/index.html')).toContain('the Seal');
    expect(read('/pt/dobra/index.html')).toContain('o Selo');
    expect(read('/pt/dobra/index.html')).toContain('<html lang="pt-BR"');
  });

  it('Privacidade existe nos dois idiomas e diz que não coleta dados', () => {
    expect(read('/en/privacy/index.html')).toMatch(/does not collect/i);
    expect(read('/pt/privacidade/index.html')).toMatch(/não coleta/i);
    expect(read('/en/privacy/index.html')).toContain('2026-10-05');
  });

  it('nunca afirma a origem da Dobra nem do Selo, e o Âmbar não guarda Marca', () => {
    for (const path of ['/en/fold/index.html', '/pt/dobra/index.html']) {
      const html = read(path);
      expect(html).not.toMatch(/\bthe Mark\b|\ba Marca\b/);
      expect(html).not.toMatch(/(first Seal was|the Seal was first) (carved|made) by/i);
      expect(html).not.toMatch(/primeiro Selo foi (talhado|feito) por/i);
    }
  });
});
