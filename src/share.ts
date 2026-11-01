/**
 * Links curtos do botão Compartilhar do jogo (dimension-riders#1321): `/<idioma>/s/<tipo>`. O idioma é o do texto que o
 * jogador mandou (a prévia do link sai nele); o tipo diz só a situação, nunca quem compartilhou. A página leva à
 * Início do idioma com a UTM, que o script de métricas grava e repassa ao `referrer` da Play (#450).
 */
export const SHARE_KINDS = {
  v: 'win',
  r: 'record',
  q: 'near',
  d: 'daily',
  t: 'rush',
} as const;

export type ShareCode = keyof typeof SHARE_KINDS;
export const SHARE_CODES = Object.keys(SHARE_KINDS) as ShareCode[];

/** A UTM de um tipo: `utm_source=share&utm_medium=app&utm_campaign=<situação>`. */
export function shareQuery(code: ShareCode): string {
  return new URLSearchParams({ utm_source: 'share', utm_medium: 'app', utm_campaign: SHARE_KINDS[code] }).toString();
}
