/**
 * Métricas do site (#450): GA4 sem cookie e a origem da visita repassada ao link da Play.
 *
 * Sem cookie nem armazenamento no aparelho, cada página é contada sozinha. Para não perder de onde a pessoa veio
 * ao passar da Início para a Baixar, a origem (UTM da URL de entrada ou o site que mandou o visitante) vai junto
 * nos links internos, e o link da Play leva essa origem no `referrer`, que a Play Console e o `first_open` do GA4
 * do app leem.
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

export interface MetricsConfig { gaId: string }

/**
 * Roda no navegador; vira script inline por `metricsScript`, então tudo o que usa fica aqui dentro.
 * `w` é a janela (os testes passam uma falsa).
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

  // O script fica no <head>: os links só existem depois de lida a página.
  var decorate = function () {
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
  };
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', decorate);
  else decorate();

  if (!cfg.gaId) return;
  w.dataLayer = w.dataLayer || [];
  var gtag = function () { w.dataLayer.push(arguments); };
  w.gtag = gtag;
  // Sem cookie (client_storage) e sem sinais de anúncio: só a contagem de visitas e cliques.
  (gtag as any)('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
  (gtag as any)('js', new Date());
  (gtag as any)('config', cfg.gaId, { client_storage: 'none', allow_google_signals: false, allow_ad_personalization_signals: false });
  doc.addEventListener('click', function (e: any) {
    var a = e.target && e.target.closest ? e.target.closest('a[data-play-link]') : null;
    if (a) (gtag as any)('event', 'click_play', { link_url: a.getAttribute('href') });
  });
}

/** O script inline das páginas. */
export function metricsScript(cfg: MetricsConfig): string {
  return `(${metricsMain.toString()})(${JSON.stringify(cfg)}, window);`;
}
