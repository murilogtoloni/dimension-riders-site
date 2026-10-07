import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, HTML_LANG, LOCALES, PAGES, ROUTES, localePath, t } from '../src/i18n';

describe('i18n', () => {
  it('lista os idiomas e as páginas', () => {
    expect([...LOCALES]).toEqual(['en', 'pt']);
    expect(DEFAULT_LOCALE).toBe('en');
    expect(HTML_LANG).toEqual({ en: 'en', pt: 'pt-BR' });
    expect([...PAGES]).toEqual(['home', 'fold', 'download', 'privacy', 'support', 'terms']);
  });

  it('tem um slug por página em cada idioma', () => {
    expect(ROUTES.fold).toEqual({ en: 'fold', pt: 'dobra' });
    expect(ROUTES.download).toEqual({ en: 'download', pt: 'baixar' });
    expect(ROUTES.privacy).toEqual({ en: 'privacy', pt: 'privacidade' });
    expect(ROUTES.support).toEqual({ en: 'support', pt: 'suporte' });
    expect(ROUTES.terms).toEqual({ en: 'terms', pt: 'termos' });
    expect(ROUTES.home).toEqual({ en: '', pt: '' });
  });

  it('localePath monta base + idioma + slug, sempre com barra no fim', () => {
    expect(localePath('pt', 'fold', '/dimension-riders-site')).toBe('/dimension-riders-site/pt/dobra/');
    expect(localePath('en', 'home', '/dimension-riders-site/')).toBe('/dimension-riders-site/en/');
    expect(localePath('en', 'privacy', '/')).toBe('/en/privacy/');
  });

  it('t devolve o texto, interpola variáveis e lança em chave faltando', () => {
    expect(t('en', 'site.name')).toBe('Dimension Riders');
    expect(t('pt', 'nav.fold')).toBe('A Dobra');
    expect(t('en', 'buttons.apkVersion', { version: '9.9.9' })).toContain('9.9.9');
    expect(() => t('en', 'nao.existe')).toThrow(/nao\.existe/);
  });
});
