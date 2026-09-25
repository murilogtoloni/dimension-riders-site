import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { APK_URL, APP_VERSION, PLAY_STORE_URL } from '../src/config';
import en from '../src/i18n/en.json';
import pt from '../src/i18n/pt.json';
import { DIST, read } from './helpers';

describe('página Baixar', () => {
  it('existe nos dois idiomas', () => {
    expect(existsSync(`${DIST}/en/download/index.html`)).toBe(true);
    expect(existsSync(`${DIST}/pt/baixar/index.html`)).toBe(true);
  });

  it('tem o link do APK, a versão, os requisitos e os três passos', () => {
    const html = read('/en/download/index.html');
    expect(html).toContain(APK_URL);
    expect(html).toContain(`Version ${APP_VERSION}`);
    expect(html).toContain(en.download.requirements);
    expect(html).toContain(en.download.step1);
    expect(html).toContain(en.download.step3);
  });

  it('fala da loja de acordo com a constante', () => {
    const html = read('/pt/baixar/index.html');
    if (PLAY_STORE_URL === '') {
      expect(html).toContain(pt.download.storeSoon);
      expect(html).not.toContain(pt.buttons.playStore);
    } else {
      expect(html).toContain(pt.download.storeReady);
      expect(html).toContain(PLAY_STORE_URL);
    }
  });
});
