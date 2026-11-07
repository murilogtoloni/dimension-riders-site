import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DELETION_PAGE_URL } from '../src/config';
import { DIST, read } from './helpers';

describe('atalhos /excluir-conta e /delete-account (#1394)', () => {
  it('existem e só redirecionam para a página de exclusão do Hosting, sem indexar', () => {
    for (const path of ['/excluir-conta/index.html', '/delete-account/index.html']) {
      expect(existsSync(`${DIST}${path}`)).toBe(true);
      const html = read(path);
      expect(html).toContain(`content="0;url=${DELETION_PAGE_URL}"`);
      expect(html).toContain(`href="${DELETION_PAGE_URL}"`);
      expect(html).toContain('name="robots" content="noindex"');
    }
  });

  it('a URL é a cadastrada no Play Console e citada na política', () => {
    expect(DELETION_PAGE_URL).toBe('https://dimension-riders.web.app/excluir-conta');
    expect(read('/pt/privacidade/index.html')).toContain(DELETION_PAGE_URL);
    expect(read('/en/privacy/index.html')).toContain(DELETION_PAGE_URL);
    expect(read('/sitemap.xml')).not.toContain('excluir-conta');
  });
});

it('#1394 / #1587: sem app/código há identificação PGS/Google, confirmação e escopo da mesma Conta Google', () => {
  for (const [path, phrases, forbidden] of [
    ['/pt/privacidade/index.html', ['autorize a identificação', 'confirme o pedido', 'não comprova titularidade', 'inclui as contas do jogo ligadas a essa Conta Google', 'registro identificável do pedido é removido'], 'essas contas não podem ser localizadas'],
    ['/en/privacy/index.html', ['authorize identification', 'confirm the deletion request', 'does not prove ownership', 'includes the game accounts tied to that Google Account', 'identifiable request record is removed'], 'those accounts cannot be located'],
    ['/pt/suporte/index.html', ['autorize a identificação', 'confirme o pedido', 'não comprova titularidade', 'inclui as contas do jogo ligadas a essa Conta Google'], 'Sem o código e sem Conta Google'],
    ['/en/support/index.html', ['authorize identification', 'confirm the deletion request', 'does not prove ownership', 'includes the game accounts tied to that Google Account'], 'Without the code and without']
  ] as const) {
    const html = read(path);
    for (const phrase of phrases) expect(html).toContain(phrase);
    expect(html).not.toContain(forbidden);
  }
});
