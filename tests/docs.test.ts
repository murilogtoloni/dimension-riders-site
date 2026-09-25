import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DIST, read } from './helpers';

describe('páginas de texto', () => {
  it('A Dobra existe nos dois idiomas com o conteúdo certo', () => {
    expect(existsSync(`${DIST}/en/fold/index.html`)).toBe(true);
    expect(existsSync(`${DIST}/pt/dobra/index.html`)).toBe(true);
    expect(read('/en/fold/index.html')).toContain('<h2');
    expect(read('/en/fold/index.html')).toContain('the Mark');
    expect(read('/pt/dobra/index.html')).toContain('a Marca');
    expect(read('/pt/dobra/index.html')).toContain('<html lang="pt-BR"');
  });

  it('Privacidade existe nos dois idiomas e diz que não coleta dados', () => {
    expect(read('/en/privacy/index.html')).toMatch(/does not collect/i);
    expect(read('/pt/privacidade/index.html')).toMatch(/não coleta/i);
    expect(read('/en/privacy/index.html')).toContain('2026-09-25');
  });

  it('nunca afirma a origem da Dobra nem o que é a Marca', () => {
    for (const path of ['/en/fold/index.html', '/pt/dobra/index.html']) {
      const html = read(path);
      expect(html).not.toMatch(/the Mark (is|means) a/i);
      expect(html).not.toMatch(/a Marca (é|significa) um/i);
    }
  });
});
