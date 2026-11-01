import { describe, expect, it } from 'vitest';
import { SHARE_CODES, SHARE_KINDS, shareQuery } from '../src/share';
import { BASE, SITE, read } from './helpers';

// dimension-riders#1321: o link do botão Compartilhar do jogo.
describe('links curtos do compartilhar (#1321)', () => {
  it('o jogo usa estes cinco tipos (DailyShare.cs: v, r, q, d, t)', () => {
    expect(SHARE_CODES).toEqual(['v', 'r', 'q', 'd', 't']);
    expect(shareQuery('q')).toBe('utm_source=share&utm_medium=app&utm_campaign=near');
  });

  for (const [locale, home] of [['en', `${BASE}/en/`], ['pt', `${BASE}/pt/`]] as const) {
    for (const code of SHARE_CODES) {
      it(`/${locale}/s/${code}/ tem prévia própria e leva à Início com a UTM`, () => {
        const html = read(`/${locale}/s/${code}/index.html`);
        const target = `${home}?utm_source=share&amp;utm_medium=app&amp;utm_campaign=${SHARE_KINDS[code]}`;
        expect(html).toContain(`property="og:url" content="${SITE}/${locale}/s/${code}/"`);
        expect(html).toContain(`property="og:image" content="${SITE}/og.jpg"`);
        expect(html).toContain(`http-equiv="refresh" content="0;url=${target}"`);
        expect(html).toContain('name="robots" content="noindex"');
        // nada que identifique o jogador: só o tipo da situação
        expect(html).not.toMatch(/utm_(content|term)|uid|player/);
      });
    }
  }

  it('a 404 manda /<idioma>/s/<tipo desconhecido> à Início com a UTM do compartilhar (revisão #1344)', () => {
    const html = read('/404.html');
    expect(html).toContain('location.pathname.match(/^\\/(pt|en)\\/s(\\/|$)/)');
    expect(html).toContain("'?utm_source=share&utm_medium=app'");
    expect(html).toContain(`"pt":"${BASE}/pt/"`);
    expect(html).toContain('name="robots" content="noindex"');
  });

  it('a raiz também tem prévia (o link antigo do jogo)', () => {
    const html = read('/index.html');
    expect(html).toContain(`property="og:url" content="${SITE}/"`);
    expect(html).toContain(`property="og:image" content="${SITE}/og.jpg"`);
  });
});
