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

  it('oferece APK e instruções somente quando houver download público', () => {
    const html = read('/en/download/index.html');
    if (APK_URL !== '') {
      expect(html).toContain(`href="${APK_URL}"`);
      expect(html).toContain(`Version ${APP_VERSION}`);
      expect(html).toContain(en.download.requirements);
      expect(html).toContain(en.download.step1);
      expect(html).toContain(en.download.step3);
    } else {
      expect(html).not.toContain(en.buttons.apk);
      expect(html).not.toContain(en.download.apkTitle);
      expect(html).not.toContain(en.download.step1);
      if (PLAY_STORE_URL === '') expect(html).toContain(en.download.unavailable);
    }
  });

  it('fala da loja de acordo com a constante', () => {
    const html = read('/pt/baixar/index.html');
    if (PLAY_STORE_URL === '') {
      expect(html).toContain(pt.download.storeSoon);
      expect(html).toContain(pt.download.soon);
      expect(html).toMatch(/<button[^>]*class="store-disabled"[^>]*disabled/);
      expect(html).not.toContain(pt.buttons.playStore);
    } else {
      expect(html).toContain(pt.download.storeReady);
      expect(html).toContain(`href="${PLAY_STORE_URL}"`);
      expect(html).toContain(`alt="${pt.buttons.playStore}"`);
      expect(html).not.toContain('class="store-disabled"');
    }
  });
});
