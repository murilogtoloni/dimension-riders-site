import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { GA_MEASUREMENT_ID, PLAY_STORE_URL } from '../src/config';
import { BASE, DIST } from './helpers';

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return path.endsWith('.html') ? [path] : [];
  });
}

/** O arquivo que o GitHub Pages serviria para um href interno. */
function targetFile(href: string): string {
  const path = href.replace(/[?#].*$/, '').slice(BASE.length);
  return path.endsWith('/') ? join(DIST, path, 'index.html') : join(DIST, path);
}

describe('links internos', () => {
  const allFiles = existsSync(DIST) ? htmlFiles(DIST) : [];
  const isPreview1595 = (f: string) => {
    const p = f.slice(DIST.length);
    return p.startsWith('/proposta/') || p.startsWith('/comparacao/');
  };
  const files = allFiles.filter((f) => !isPreview1595(f));

  it('dist/ existe e tem as 30 páginas (17 + os 10 links curtos do compartilhar, a 404 e os 2 atalhos da exclusão, #1321, #1394) (rode npm run build antes)', () => {
    expect(files.length).toBe(30);
  });

  for (const file of allFiles) {
    it(`${file.slice(DIST.length)}: todo link interno tem a base e aponta para uma página que existe; só o script de métricas`, () => {
      const html = readFileSync(file, 'utf8');
      const hrefs = [...html.matchAll(/<a\s[^>]*href="([^"]*)"/g)].map((m) => m[1]);
      const internal = hrefs.filter((h) => h.startsWith('/'));
      const withoutBase = internal.filter((h) => !h.startsWith(`${BASE}/`));
      const broken = internal.filter((h) => h.startsWith(`${BASE}/`) && !existsSync(targetFile(h)));
      expect({ withoutBase, broken }).toEqual({ withoutBase: [], broken: [] });
      // Páginas de redirecionamento e protótipos de revisão (#1595).
      const page = file.slice(DIST.length);
      if (isPreview1595(file) || ['/index.html', '/404.html', '/jogar/index.html', '/play/index.html', '/excluir-conta/index.html', '/delete-account/index.html'].includes(page) || /^\/(en|pt)\/s\/[a-z]\/index\.html$/.test(page)) return;
      // Único script: o de métricas (#450), e só quando há GA ou link da Play.
      const scripts = [...html.matchAll(/<script[^>]*>/g)].map((m) => m[0]);
      const expected = (GA_MEASUREMENT_ID !== '' ? 1 : 0) + (GA_MEASUREMENT_ID !== '' || PLAY_STORE_URL !== '' ? 1 : 0);
      expect(scripts.length).toBe(expected);
      for (const tag of scripts) expect(tag === '<script>' || tag.includes('src="https://www.googletagmanager.com/gtag/js?id=')).toBe(true);
    });
  }
});
