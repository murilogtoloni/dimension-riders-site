/**
 * Métricas do site (#450): GA4 com aviso de cookies só na Europa e a origem da visita repassada ao link da Play.
 *
 * Para não perder de onde a pessoa veio ao passar da Início para a Baixar (inclusive quem está sem cookie), a origem
 * (UTM da URL de entrada ou o site que mandou o visitante) vai junto nos links internos, e o link da Play leva essa
 * origem no `referrer`, que a Play Console e o `first_open` do GA4 do app leem.
 */

/** Chaves de UTM lidas da URL e repassadas nos links internos. */
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;

/** Referrer de quem chega à Play sem origem conhecida. `utm_medium=site` separa quem passou pelo site do anúncio direto. */
export const PLAY_REFERRER_DEFAULT = { utm_source: 'direct', utm_medium: 'site', utm_campaign: 'site' };

/** Link da ficha da Play com o referrer padrão do site. O script troca a origem pela da visita. */
export function playStoreHref(storeUrl: string): string {
  const url = new URL(storeUrl);
  url.searchParams.set('referrer', new URLSearchParams(PLAY_REFERRER_DEFAULT).toString());
  return url.toString();
}

/** Países onde o cookie de análise só entra com aceite: União Europeia, EEE, Reino Unido e Suíça. O Google decide pelo IP. */
export const CONSENT_REGIONS = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH'];

/** Prazo do cookie `_ga`, igual à retenção das métricas do app: 60 dias desde a última visita. */
export const COOKIE_SECONDS = 60 * 24 * 60 * 60;

/** Chave do navegador onde fica a escolha do aviso ('granted' ou 'denied'); o script repete o literal (é autossuficiente). */
export const CONSENT_KEY = 'dr_consent';

export interface ConsentTexts { text: string; accept: string; decline: string; privacyLabel: string; privacyHref: string }
export interface MetricsConfig { gaId: string; regions: string[]; cookieSeconds: number; consent: ConsentTexts }

/**
 * Roda no navegador; vira script inline por `metricsScript`, então tudo o que usa fica aqui dentro.
 * `w` é a janela (os testes passam uma falsa).
 *
 * Consentimento (#450, escolha do Murilo: aviso só na Europa): o padrão é negado nos países de `regions` (o Google
 * decide pelo IP) e liberado no resto. O aviso aparece para quem tem fuso horário da Europa, decidido no aparelho,
 * sem consulta externa; quem aceita passa a ser contado com cookie. Fora do aviso, um europeu com fuso de outro
 * lugar continua sem cookie pelo padrão por país.
 */
export function metricsMain(cfg: MetricsConfig, w: any): void {
  var loc = w.location;
  var doc = w.document;
  var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
  var params = new URLSearchParams(loc.search);
  var origin: Record<string, string> = {};
  keys.forEach(function (k) {
    var v = params.get(k);
    if (v) origin[k] = v.slice(0, 100);
  });
  if (!origin.utm_source) {
    var host = '';
    try { host = doc.referrer ? new URL(doc.referrer).hostname : ''; } catch (e) { host = ''; }
    if (host && host !== loc.hostname) {
      origin.utm_source = host;
      origin.utm_medium = 'referral';
    }
  }

  // O script fica no <head>: os links e o rodapé só existem depois de lida a página.
  var ready = function (fn: () => void) {
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', fn);
    else fn();
  };

  ready(function () {
    if (!origin.utm_source) return;
    doc.querySelectorAll('a[href^="/"]').forEach(function (a: any) {
      var u = new URL(a.getAttribute('href'), loc.origin);
      Object.keys(origin).forEach(function (k) { if (!u.searchParams.has(k)) u.searchParams.set(k, origin[k]); });
      a.setAttribute('href', u.pathname + u.search + u.hash);
    });
    doc.querySelectorAll('a[data-play-link]').forEach(function (a: any) {
      var u = new URL(a.getAttribute('href'));
      var r = new URLSearchParams(u.searchParams.get('referrer') || '');
      r.set('utm_source', origin.utm_source);
      if (origin.utm_campaign) r.set('utm_campaign', origin.utm_campaign);
      if (origin.utm_medium) r.set('utm_content', origin.utm_medium);
      u.searchParams.set('referrer', r.toString());
      a.setAttribute('href', u.toString());
    });
  });

  if (!cfg.gaId) return;

  var tz = '';
  try { tz = w.Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { tz = ''; }
  var europe = /^Europe\//.test(tz) || /^Atlantic\/(Canary|Madeira|Azores|Reykjavik|Faroe)$/.test(tz);
  var stored = '';
  try { stored = w.localStorage.getItem('dr_consent') || ''; } catch (e) { stored = ''; }
  var save = function (value: string) {
    try { w.localStorage.setItem('dr_consent', value); } catch (e) { /* sem armazenamento: o aviso volta na próxima página */ }
  };

  w.dataLayer = w.dataLayer || [];
  var gtag = function () { w.dataLayer.push(arguments); };
  w.gtag = gtag;
  var denied = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' };
  (gtag as any)('consent', 'default', Object.assign({ region: cfg.regions }, denied));
  (gtag as any)('consent', 'default', Object.assign({}, denied, { analytics_storage: europe ? 'denied' : 'granted' }));
  if (stored === 'granted') (gtag as any)('consent', 'update', { analytics_storage: 'granted' });
  (gtag as any)('js', new Date());
  // Sem sinais de anúncio: só a contagem de visitas e cliques.
  (gtag as any)('config', cfg.gaId, { cookie_expires: cfg.cookieSeconds, allow_google_signals: false, allow_ad_personalization_signals: false });
  doc.addEventListener('click', function (e: any) {
    var a = e.target && e.target.closest ? e.target.closest('a[data-play-link]') : null;
    if (a) (gtag as any)('event', 'click_play', { link_url: a.getAttribute('href') });
  });

  var banner: any = null;
  var showBanner = function () {
    if (banner) return;
    banner = doc.createElement('div');
    banner.className = 'consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', cfg.consent.privacyLabel);
    var p = doc.createElement('p');
    p.textContent = cfg.consent.text + ' ';
    var more = doc.createElement('a');
    more.href = cfg.consent.privacyHref;
    more.textContent = cfg.consent.privacyLabel;
    p.appendChild(more);
    var choose = function (value: string) {
      return function () {
        save(value);
        (gtag as any)('consent', 'update', { analytics_storage: value });
        banner.remove();
        banner = null;
      };
    };
    var accept = doc.createElement('button');
    accept.type = 'button';
    accept.className = 'consent-accept';
    accept.textContent = cfg.consent.accept;
    accept.addEventListener('click', choose('granted'));
    var decline = doc.createElement('button');
    decline.type = 'button';
    decline.className = 'consent-decline';
    decline.textContent = cfg.consent.decline;
    decline.addEventListener('click', choose('denied'));
    banner.appendChild(p);
    banner.appendChild(decline);
    banner.appendChild(accept);
    doc.body.appendChild(banner);
  };

  if (!europe) return;
  ready(function () {
    // O botão "Cookies" do rodapé reabre o aviso para mudar a escolha.
    doc.querySelectorAll('[data-consent-reset]').forEach(function (b: any) {
      b.hidden = false;
      b.addEventListener('click', showBanner);
    });
    if (!stored) showBanner();
  });
}

/** O script inline das páginas. */
export function metricsScript(cfg: MetricsConfig): string {
  return `(${metricsMain.toString()})(${JSON.stringify(cfg)}, window);`;
}
