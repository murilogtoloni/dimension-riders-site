import { describe, expect, it } from 'vitest';
import { GA_MEASUREMENT_ID } from '../src/config';
import { LOCALES, PAGES } from '../src/i18n';
import { PLAY_REFERRER_DEFAULT, metricsMain, metricsScript, playStoreHref } from '../src/metrics';
import { SITE, read } from './helpers';

const STORE = 'https://play.google.com/store/apps/details?id=app.dimensionriders';

/** Janela falsa com links internos e o selo da Play, o bastante para o script. */
function fakeWindow(search: string, referrer = '', readyState = 'complete') {
  const attr = (href: string, play = false) => ({
    href, play,
    getAttribute(name: string) { return name === 'href' ? this.href : null; },
    setAttribute(_: string, value: string) { this.href = value; },
    closest(sel: string) { return sel === 'a[data-play-link]' && this.play ? this : null; },
  });
  const internal = attr('/en/download/');
  const play = attr(playStoreHref(STORE), true);
  const listeners: Record<string, Array<(e?: unknown) => void>> = {};
  const w: Record<string, unknown> = {
    location: { search, hostname: 'dimensionriders.app', origin: SITE },
    document: {
      referrer,
      readyState,
      querySelectorAll: (sel: string) => (sel === 'a[data-play-link]' ? [play] : sel === 'a[href^="/"]' ? [internal] : []),
      addEventListener: (type: string, fn: (e?: unknown) => void) => (listeners[type] ??= []).push(fn),
    },
  };
  const fire = (type: string, e?: unknown) => (listeners[type] ?? []).forEach((fn) => fn(e));
  return { w, internal, play, click: () => fire('click', { target: play }), loaded: () => fire('DOMContentLoaded') };
}

const referrerOf = (href: string) => Object.fromEntries(new URLSearchParams(new URL(href).searchParams.get('referrer') ?? ''));

describe('métricas do site (#450)', () => {
  it('o link da Play sai com o referrer padrão do site', () => {
    expect(referrerOf(playStoreHref(STORE))).toEqual(PLAY_REFERRER_DEFAULT);
    expect(new URL(playStoreHref(STORE)).searchParams.get('id')).toBe('app.dimensionriders');
  });

  it('a campanha do anúncio segue nos links internos e chega à Play', () => {
    const { w, internal, play } = fakeWindow('?utm_source=tiktok&utm_medium=anuncio&utm_campaign=v01');
    metricsMain({ gaId: '' }, w);
    expect(internal.href).toBe('/en/download/?utm_source=tiktok&utm_medium=anuncio&utm_campaign=v01');
    expect(referrerOf(play.href)).toEqual({ utm_source: 'tiktok', utm_medium: 'site', utm_campaign: 'v01', utm_content: 'anuncio' });
  });

  it('no <head>, espera a página carregar para mexer nos links', () => {
    const { w, internal, loaded } = fakeWindow('?utm_source=tiktok', '', 'loading');
    metricsMain({ gaId: '' }, w);
    expect(internal.href).toBe('/en/download/');
    loaded();
    expect(internal.href).toBe('/en/download/?utm_source=tiktok');
  });

  it('sem UTM, o site que mandou a visita vira a origem; a própria página não conta', () => {
    const vindo = fakeWindow('', 'https://www.instagram.com/p/x');
    metricsMain({ gaId: '' }, vindo.w);
    expect(referrerOf(vindo.play.href)).toMatchObject({ utm_source: 'www.instagram.com', utm_campaign: 'site', utm_content: 'referral' });
    const interno = fakeWindow('', `${SITE}/en/`);
    metricsMain({ gaId: '' }, interno.w);
    expect(interno.internal.href).toBe('/en/download/');
    expect(referrerOf(interno.play.href)).toEqual(PLAY_REFERRER_DEFAULT);
  });

  it('com o GA: sem cookie nem sinal de anúncio, e o toque na Play vira click_play', () => {
    const { w, click } = fakeWindow('');
    metricsMain({ gaId: 'G-TESTE' }, w);
    click();
    const calls = (w.dataLayer as IArguments[]).map((a) => [...a]);
    expect(calls).toContainEqual(['config', 'G-TESTE', { client_storage: 'none', allow_google_signals: false, allow_ad_personalization_signals: false }]);
    expect(calls).toContainEqual(['consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' }]);
    expect(calls.find((c) => c[0] === 'event')).toEqual(['event', 'click_play', { link_url: expect.stringContaining('referrer=') }]);
  });

  it('o script inline é autossuficiente: roda só com o que leva dentro', () => {
    const { w, play } = fakeWindow('?utm_source=youtube&utm_campaign=v02');
    new Function('window', metricsScript({ gaId: '' }))(w);
    expect(referrerOf(play.href)).toMatchObject({ utm_source: 'youtube', utm_campaign: 'v02' });
  });

  it('o GA só entra na página com o ID preenchido', () => {
    const html = read('/en/index.html');
    if (GA_MEASUREMENT_ID === '') expect(html).not.toContain('googletagmanager');
    else expect(html).toContain(`gtag/js?id=${GA_MEASUREMENT_ID}`);
  });
});

describe('busca (#450)', () => {
  it('sitemap lista as páginas dos dois idiomas com hreflang', () => {
    const xml = read('/sitemap.xml');
    expect([...xml.matchAll(/<loc>/g)].length).toBe(PAGES.length * LOCALES.length);
    expect(xml).toContain(`<loc>${SITE}/pt/baixar/</loc>`);
    expect(xml).toContain(`hreflang="pt-BR" href="${SITE}/pt/privacidade/"`);
    expect(xml).toContain(`hreflang="x-default" href="${SITE}/en/"`);
    expect(xml).not.toContain(`<loc>${SITE}/</loc>`);
  });

  it('robots libera tudo e aponta o sitemap', () => {
    expect(read('/robots.txt')).toBe(`User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
  });

  it('a política do site fala da hospedagem e do Analytics sem cookies, nos dois idiomas', () => {
    for (const s of ['Este site', 'GitHub Pages', 'Google Analytics sem cookies', 'botão da Google Play']) expect(read('/pt/privacidade/index.html')).toContain(s);
    for (const s of ['This website', 'GitHub Pages', 'Google Analytics without cookies', 'Google Play button']) expect(read('/en/privacy/index.html')).toContain(s);
  });
});
