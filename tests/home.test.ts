import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PLAY_STORE_URL } from '../src/config';
import en from '../src/i18n/en.json';
import pt from '../src/i18n/pt.json';
import { BASE, DIST, SITE, read } from './helpers';

describe('página Início', () => {
  it('existe nos dois idiomas (rode npm run build antes)', () => {
    expect(existsSync(`${DIST}/en/index.html`)).toBe(true);
    expect(existsSync(`${DIST}/pt/index.html`)).toBe(true);
  });

  it('em inglês: lang, título, slogan, abertura, link pro português', () => {
    const html = read('/en/index.html');
    expect(html).toContain('<html lang="en"');
    expect(html).toContain(en.hero.tagline);
    expect(html).toContain(en.hero.opening);
    expect(html).toContain(`href="${BASE}/pt/"`);
    expect(html).toContain(`hreflang="pt-BR" href="${SITE}${BASE}/pt/"`);
  });

  it('em português: lang pt-BR, textos em português, link pro inglês', () => {
    const html = read('/pt/index.html');
    expect(html).toContain('<html lang="pt-BR"');
    expect(html).toContain(pt.hero.tagline);
    expect(html).not.toContain(en.hero.tagline);
    expect(html).toContain(`href="${BASE}/en/"`);
  });

  it('botão do APK aponta pro release do jogo; botão da loja só com link', () => {
    const html = read('/en/index.html');
    expect(html).toContain('https://github.com/murilogtoloni/dimension-riders/releases/latest/download/dimension-riders-release.apk');
    expect(html).not.toContain('href=""');
    if (PLAY_STORE_URL === '') expect(html).not.toContain(en.buttons.playStore);
    else expect(html).toContain(PLAY_STORE_URL);
  });

  it('não tem JavaScript no navegador', () => {
    expect(read('/en/index.html')).not.toMatch(/<script/);
  });
});
