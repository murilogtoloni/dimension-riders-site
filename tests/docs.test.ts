import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DIST, read } from './helpers';

describe('páginas de texto', () => {
  it('A Dobra existe nos dois idiomas com o conteúdo certo', () => {
    expect(existsSync(`${DIST}/en/fold/index.html`)).toBe(true);
    expect(existsSync(`${DIST}/pt/dobra/index.html`)).toBe(true);
    expect(read('/en/fold/index.html')).toContain('<h2');
    expect(read('/en/fold/index.html')).toContain('the Seal');
    expect(read('/pt/dobra/index.html')).toContain('o Selo');
    expect(read('/pt/dobra/index.html')).toContain('<html lang="pt-BR"');
  });

  it('Privacidade nomeia o Analytics, o Crashlytics e o AdMob, com data e contato, nos dois idiomas (#248)', () => {
    expect(read('/en/privacy/index.html')).toContain('2026-10-17');
    // dimension-riders#592: o progresso tem duas cópias do Google, o backup do Android e o backup no Google Play (opcional),
    // na Política e na FAQ do Suporte; os Termos dizem que sem cópia não há como recuperar.
    for (const path of ['/pt/privacidade/index.html', '/pt/suporte/index.html']) {
      const html = read(path);
      expect(html).toContain('backup do Google');
      expect(html).toContain('Backup no Google Play');
    }
    expect(read('/pt/privacidade/index.html')).toContain('Cópia do progresso');
    for (const path of ['/en/privacy/index.html', '/en/support/index.html']) {
      const html = read(path);
      expect(html).toContain('Google backup');
      expect(html).toContain('Google Play backup');
    }
    expect(read('/en/privacy/index.html')).toContain('Copies of your progress');
    expect(read('/pt/termos/index.html')).toContain('nenhuma dessas cópias estiver disponível');
    expect(read('/en/terms/index.html')).toContain('none of those copies is available');
    for (const path of ['/en/privacy/index.html', '/pt/privacidade/index.html']) {
      const html = read(path);
      for (const s of ['Google Analytics', 'Crashlytics', 'Google AdMob', 'mailto:support@dimensionriders.app']) expect(html).toContain(s);
    }
    expect(read('/pt/privacidade/index.html')).toContain('Segurança');
    // #253: objetivo de 60 dias, limites da limpeza e prazos próprios do Google.
    for (const s of ['Não pedimos conta nem login', 'Identificador aleatório', 'objetivo é limitar a retenção a 60 dias', 'a exclusão automática ainda não abrange todos os registros', 'tem prazos próprios']) expect(read('/pt/privacidade/index.html')).toContain(s);
    for (const s of ['account or login', 'Random identifier', 'goal is to limit retention to 60 days', 'automatic deletion does not yet cover all records', 'has its own retention periods']) expect(read('/en/privacy/index.html')).toContain(s);
  });

  it('nenhuma página identifica o desenvolvedor como pessoa (#281)', () => {
    for (const path of ['/en/index.html', '/pt/index.html', '/en/support/index.html', '/pt/suporte/index.html', '/en/terms/index.html', '/pt/termos/index.html', '/en/privacy/index.html', '/pt/privacidade/index.html']) {
      expect(read(path)).not.toMatch(/Toloni|Murilo/);
    }
  });

  it('Suporte dá o e-mail, o que mandar e a versão nas Configurações, nos dois idiomas (#281)', () => {
    for (const [path, settings] of [['/en/support/index.html', 'Settings'], ['/pt/suporte/index.html', 'Configurações']]) {
      const html = read(path);
      expect(html).toContain('mailto:support@dimensionriders.app');
      expect(html).toContain(path.startsWith('/en') ? 'We do not offer individual deletion' : 'Não oferecemos exclusão individual'); // #253
      expect(html).toContain(settings);
      expect(html).toContain('<h3');
    }
  });

  it('Termos dizem 13+, anúncios recompensados e Âmbar sem valor em dinheiro, nos dois idiomas (#281)', () => {
    const en = read('/en/terms/index.html');
    expect(en).toContain('13 or older');
    expect(en).toContain('Google AdMob');
    expect(en).toMatch(/no monetary value/);
    const pt = read('/pt/termos/index.html');
    expect(pt).toContain('13 anos ou mais');
    expect(pt).toContain('Google AdMob');
    expect(pt).toMatch(/não têm valor em dinheiro/);
    expect(pt).toContain('lei brasileira');
  });

  it('o rodapé de toda página leva a Suporte, Termos e Privacidade', () => {
    for (const [locale, support, terms, privacy] of [['en', 'support', 'terms', 'privacy'], ['pt', 'suporte', 'termos', 'privacidade']]) {
      const html = read(`/${locale}/index.html`);
      for (const slug of [support, terms, privacy]) expect(html).toContain(`href="/${locale}/${slug}/"`);
    }
  });

  it('nunca afirma a origem da Dobra nem do Selo, e o Âmbar não guarda Marca', () => {
    for (const path of ['/en/fold/index.html', '/pt/dobra/index.html']) {
      const html = read(path);
      expect(html).not.toMatch(/\bthe Mark\b|\ba Marca\b/);
      expect(html).not.toMatch(/(first Seal was|the Seal was first) (carved|made) by/i);
      expect(html).not.toMatch(/primeiro Selo foi (talhado|feito) por/i);
    }
  });
});
