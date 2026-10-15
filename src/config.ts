/** Constantes de produto. Não são texto de interface: não vão no dicionário. */

/** Link da ficha pública na Play Store. Vazio: botão Android em breve; preenchido: selo oficial com link. */
export const PLAY_STORE_URL = '';

/** Vazio até existir APK público. Releases do repositório privado não abrem para visitantes. */
export const APK_URL = '';

/** Versão exibida na página Baixar. Atualizar a cada release do jogo. */
export const APP_VERSION = '0.1.0';

export const CONTACT_EMAIL = 'support@dimensionriders.app';

/**
 * ID do fluxo Web do GA4 (G-XXXXXXXXXX), na mesma propriedade do app (#450). Vazio: o site não carrega o Google
 * Analytics. Preenchido: conta visitas e o clique na Play, com aviso de cookies só na Europa (ver `src/metrics.ts`).
 */
export const GA_MEASUREMENT_ID = 'G-W6494Y4XPH';
