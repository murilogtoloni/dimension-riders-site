import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PLAY_STORE_LISTING_URL, PLAY_STORE_URL } from '../src/config';
import en from '../src/i18n/en.json';
import pt from '../src/i18n/pt.json';
import { playStoreHref } from '../src/metrics';
import { BASE, DIST, read } from './helpers';

describe('páginas de campanha /jogar e /play (#1237)', () => {
  it('gera /pt/jogar/, /en/play/, /jogar e /play', () => {
    expect(existsSync(`${DIST}/pt/jogar/index.html`)).toBe(true);
    expect(existsSync(`${DIST}/en/play/index.html`)).toBe(true);
    expect(existsSync(`${DIST}/jogar/index.html`)).toBe(true);
    expect(existsSync(`${DIST}/play/index.html`)).toBe(true);
  });

  it('atalhos /jogar e /play redirecionam para o idioma preservando location.search', () => {
    const jogar = read('/jogar/index.html');
    expect(jogar).toContain(`http-equiv="refresh" content="0;url=${BASE}/pt/jogar/"`);
    expect(jogar).toContain('location.replace(target + location.search)');
    expect(jogar).toContain(`<a href="${BASE}/pt/jogar/"`);

    const play = read('/play/index.html');
    expect(play).toContain(`http-equiv="refresh" content="0;url=${BASE}/en/play/"`);
    expect(play).toContain('location.replace(target + location.search)');
    expect(play).toContain(`<a href="${BASE}/en/play/"`);
  });

  it('usam o link HTTPS oficial da Google Play Store com referrer (nunca market://) e sem Meta Pixel', () => {
    const stripScripts = (html: string) => html.replace(/<script[\s\S]*?<\/script>/gi, '');
    const expectedHref = playStoreHref(PLAY_STORE_URL || PLAY_STORE_LISTING_URL).replaceAll('&', '&amp;');
    for (const path of ['/pt/jogar/index.html', '/en/play/index.html', '/jogar/index.html', '/play/index.html']) {
      const html = read(path);
      expect(html).not.toContain('market://');
      expect(html).not.toMatch(/fbq\(|connect\.facebook\.net|fbevents\.js/i);
    }
    for (const [path, dict] of [['/pt/jogar/index.html', pt], ['/en/play/index.html', en]] as const) {
      const bodyHtml = stripScripts(read(path));
      expect(bodyHtml).toContain(`href="${expectedHref}"`);
      expect(bodyHtml).toContain('data-play-link');
      expect(bodyHtml).toContain(dict.play.facts);
      if (PLAY_STORE_URL === '') expect(bodyHtml).not.toContain('data-play-redirect');
      else expect(bodyHtml).toContain('data-play-redirect');
    }
  });

  it('o texto visível alinha ao selo da Play Store ("Sem anúncio forçado" / "No forced ads") e nunca diz "Sem anúncios" / "No ads"', () => {
    const stripScripts = (html: string) => html.replace(/<script[\s\S]*?<\/script>/gi, '');
    const ptVisible = stripScripts(read('/pt/jogar/index.html'));
    const enVisible = stripScripts(read('/en/play/index.html'));
    expect(ptVisible).toContain('Grátis no Google Play · Joga offline · Sem anúncio forçado');
    expect(enVisible).toContain('Free on Google Play · Plays offline · No forced ads');
    expect(ptVisible).not.toMatch(/sem anúncios/i);
    expect(enVisible).not.toMatch(/\bno ads\b/i);
  });
});
