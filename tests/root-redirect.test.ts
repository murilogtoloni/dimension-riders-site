import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BASE, DIST, read } from './helpers';

describe('raiz do site', () => {
  it('foi gerada (rode npm run build antes)', () => {
    expect(existsSync(`${DIST}/index.html`)).toBe(true);
  });

  it('cai em /en/ sem JavaScript e conhece os dois idiomas com JavaScript', () => {
    const html = read('/index.html');
    expect(html).toContain(`http-equiv="refresh" content="1;url=${BASE}/en/"`);
    expect(html).toContain(`"en":"${BASE}/en/"`);
    expect(html).toContain(`"pt":"${BASE}/pt/"`);
    expect(html).toContain(`<a href="${BASE}/en/"`);
  });
});
