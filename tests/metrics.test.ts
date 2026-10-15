import { describe, expect, it } from 'vitest';
import { GA_MEASUREMENT_ID } from '../src/config';
import { LOCALES, PAGES } from '../src/i18n';
import { CONSENT_REGIONS, COOKIE_SECONDS, PLAY_REFERRER_DEFAULT, metricsMain, metricsScript, playStoreHref, type MetricsConfig } from '../src/metrics';
import { SITE, read } from './helpers';

const STORE = 'https://play.google.com/store/apps/details?id=app.dimensionriders';

/** Janela falsa com links internos e o selo da Play, o bastante para o script. */
function fakeWindow(search: string, referrer = '', readyState = 'complete', timeZone = 'America/Sao_Paulo', stored: string | null = null) {
  const attr = (href: string, play = false) => ({
    href, play,
    getAttribute(name: string) { return name === 'href' ? this.href : null; },
    setAttribute(_: string, value: string) { this.href = value; },
    closest(sel: string) { return sel === 'a[data-play-link]' && this.play ? this : null; },
  });
  const internal = attr('/en/download/');
  const play = attr(playStoreHref(STORE), true);
  const listeners: Record<string, Array<(e?: unknown) => void>> = {};
  const store: Record<string, string> = stored ? { dr_consent: stored } : {};
  const body: unknown[] = [];
  const el = (tag: string) => {
    const handlers: Record<string, () => void> = {};
    const node: Record<string, unknown> = {
      tag, children: [] as unknown[], attrs: {} as Record<string, string>, textContent: '',
      setAttribute(k: string, v: string) { (node.attrs as Record<string, string>)[k] = v; },
      appendChild(c: unknown) { (node.children as unknown[]).push(c); },
      addEventListener(type: string, fn: () => void) { handlers[type] = fn; },
      click() { handlers.click?.(); },
      remove() { body.splice(body.indexOf(node), 1); },
    };
    return node;
  };
  const reset = { hidden: true, ...el('button') };
  const w: Record<string, unknown> = {
    Intl: { DateTimeFormat: () => ({ resolvedOptions: () => ({ timeZone }) }) },
    localStorage: { getItem: (k: string) => store[k] ?? null, setItem: (k: string, v: string) => { store[k] = v; } },
    location: { search, hostname: 'dimensionriders.app', origin: SITE },
    document: {
      referrer,
      readyState,
      body: { appendChild: (n: unknown) => body.push(n) },
      createElement: el,
      querySelectorAll: (sel: string) => (sel === 'a[data-play-link]' ? [play] : sel === 'a[href^="/"]' ? [internal] : sel === '[data-consent-reset]' ? [reset] : []),
      addEventListener: (type: string, fn: (e?: unknown) => void) => (listeners[type] ??= []).push(fn),
    },
  };
  const fire = (type: string, e?: unknown) => (listeners[type] ?? []).forEach((fn) => fn(e));
  const consentCalls = () => (w.dataLayer as IArguments[] ?? []).map((a) => [...a]).filter((c) => c[0] === 'consent');
  return { w, internal, play, body, store, reset, consentCalls, click: () => fire('click', { target: play }), loaded: () => fire('DOMContentLoaded') };
}

const TEXTS = { text: 'Cookies?', accept: 'Aceitar', decline: 'Recusar', privacyLabel: 'Privacidade', privacyHref: '/pt/privacidade/' };
const cfg = (gaId = ''): MetricsConfig => ({ gaId, regions: CONSENT_REGIONS, cookieSeconds: COOKIE_SECONDS, consent: TEXTS });

const referrerOf = (href: string) => Object.fromEntries(new URLSearchParams(new URL(href).searchParams.get('referrer') ?? ''));

describe('métricas do site (#450)', () => {
  it('o link da Play sai com o referrer padrão do site', () => {
    expect(referrerOf(playStoreHref(STORE))).toEqual(PLAY_REFERRER_DEFAULT);
    expect(new URL(playStoreHref(STORE)).searchParams.get('id')).toBe('app.dimensionriders');
  });

  it('a campanha do anúncio segue nos links internos e chega à Play', () => {
    const { w, internal, play } = fakeWindow('?utm_source=tiktok&utm_medium=anuncio&utm_campaign=v01');
    metricsMain(cfg(), w);
    expect(internal.href).toBe('/en/download/?utm_source=tiktok&utm_medium=anuncio&utm_campaign=v01');
    expect(referrerOf(play.href)).toEqual({ utm_source: 'tiktok', utm_medium: 'site', utm_campaign: 'v01', utm_content: 'anuncio' });
  });

  it('no <head>, espera a página carregar para mexer nos links', () => {
    const { w, internal, loaded } = fakeWindow('?utm_source=tiktok', '', 'loading');
    metricsMain(cfg(), w);
    expect(internal.href).toBe('/en/download/');
    loaded();
    expect(internal.href).toBe('/en/download/?utm_source=tiktok');
  });

  it('sem UTM, o site que mandou a visita vira a origem; a própria página não conta', () => {
    const vindo = fakeWindow('', 'https://www.instagram.com/p/x');
    metricsMain(cfg(), vindo.w);
    expect(referrerOf(vindo.play.href)).toMatchObject({ utm_source: 'www.instagram.com', utm_campaign: 'site', utm_content: 'referral' });
    const interno = fakeWindow('', `${SITE}/en/`);
    metricsMain(cfg(), interno.w);
    expect(interno.internal.href).toBe('/en/download/');
    expect(referrerOf(interno.play.href)).toEqual(PLAY_REFERRER_DEFAULT);
  });

  it('com o GA: cookie de 60 dias, sem sinal de anúncio, e o toque na Play vira click_play', () => {
    const { w, click } = fakeWindow('');
    metricsMain(cfg('G-TESTE'), w);
    click();
    const calls = (w.dataLayer as IArguments[]).map((a) => [...a]);
    expect(calls).toContainEqual(['config', 'G-TESTE', { cookie_expires: 5184000, allow_google_signals: false, allow_ad_personalization_signals: false }]);
    expect(calls.find((c) => c[0] === 'event')).toEqual(['event', 'click_play', { link_url: expect.stringContaining('referrer=') }]);
  });

  it('consentimento: negado por padrão na Europa pelo IP, liberado no resto; anúncios sempre negados', () => {
    const { w, consentCalls, body, reset } = fakeWindow('');
    metricsMain(cfg('G-TESTE'), w);
    const [regional, global] = consentCalls();
    expect(regional[2]).toEqual({ region: CONSENT_REGIONS, ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
    expect(regional[2].region).toEqual(expect.arrayContaining(['DE', 'FR', 'PT', 'GB', 'CH', 'NO']));
    expect(global[2]).toMatchObject({ ad_storage: 'denied', analytics_storage: 'granted' });
    expect(body).toHaveLength(0);
    expect(reset.hidden).toBe(true);
  });

  it('com fuso da Europa: aviso na primeira visita; aceitar libera o cookie e não pergunta de novo', () => {
    const v = fakeWindow('', '', 'complete', 'Europe/Lisbon');
    metricsMain(cfg('G-TESTE'), v.w);
    expect(v.consentCalls()[1][2]).toMatchObject({ analytics_storage: 'denied' });
    expect(v.body).toHaveLength(1);
    expect(v.reset.hidden).toBe(false);
    const banner = v.body[0] as { children: Array<{ className?: string; click?: () => void; children?: Array<{ href?: string }> }> };
    banner.children.find((c) => c.className === 'consent-accept')!.click!();
    expect(v.store.dr_consent).toBe('granted');
    expect(v.consentCalls().at(-1)).toEqual(['consent', 'update', { analytics_storage: 'granted' }]);
    expect(v.body).toHaveLength(0);

    const volta = fakeWindow('', '', 'complete', 'Europe/Lisbon', 'granted');
    metricsMain(cfg('G-TESTE'), volta.w);
    expect(volta.body).toHaveLength(0);
    expect(volta.consentCalls()).toContainEqual(['consent', 'update', { analytics_storage: 'granted' }]);
  });

  it('com fuso da Europa: recusar guarda a escolha e o botão Cookies reabre o aviso', () => {
    const v = fakeWindow('', '', 'complete', 'Europe/Berlin');
    metricsMain(cfg('G-TESTE'), v.w);
    const banner = v.body[0] as { children: Array<{ className?: string; click?: () => void }> };
    banner.children.find((c) => c.className === 'consent-decline')!.click!();
    expect(v.store.dr_consent).toBe('denied');
    expect(v.body).toHaveLength(0);
    (v.reset as unknown as { click: () => void }).click();
    expect(v.body).toHaveLength(1);
  });

  it('o script inline é autossuficiente: roda só com o que leva dentro', () => {
    const { w, play } = fakeWindow('?utm_source=youtube&utm_campaign=v02');
    new Function('window', metricsScript(cfg()))(w);
    expect(referrerOf(play.href)).toMatchObject({ utm_source: 'youtube', utm_campaign: 'v02' });
  });

  it('o GA só entra na página com o ID preenchido', () => {
    const html = read('/en/index.html');
    if (GA_MEASUREMENT_ID === '') expect(html).not.toContain('googletagmanager');
    else {
      expect(html).toContain(`gtag/js?id=${GA_MEASUREMENT_ID}`);
      expect(html).toMatch(/<button type="button" class="footer-cookies" data-consent-reset hidden>/);
    }
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

  it('a política do site fala da hospedagem, dos cookies e do aviso na Europa, nos dois idiomas', () => {
    for (const s of ['Este site', 'GitHub Pages', 'cookies _ga', '60 dias', 'se você aceitar no aviso', 'botão Cookies', 'legítimo interesse']) expect(read('/pt/privacidade/index.html')).toContain(s);
    for (const s of ['This website', 'GitHub Pages', '_ga cookies', '60 days', 'only if you accept', 'Cookies button', 'legitimate interest']) expect(read('/en/privacy/index.html')).toContain(s);
  });
});
