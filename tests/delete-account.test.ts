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
