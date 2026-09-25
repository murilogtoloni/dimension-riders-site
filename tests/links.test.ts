import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
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
  const files = existsSync(DIST) ? htmlFiles(DIST) : [];

  it('dist/ existe e tem as 9 páginas (rode npm run build antes)', () => {
    expect(files.length).toBe(9);
  });

  for (const file of files) {
    it(`${file.slice(DIST.length)}: todo link interno tem a base e aponta para uma página que existe`, () => {
      const html = readFileSync(file, 'utf8');
      const hrefs = [...html.matchAll(/<a\s[^>]*href="([^"]*)"/g)].map((m) => m[1]);
      const internal = hrefs.filter((h) => h.startsWith('/'));
      const withoutBase = internal.filter((h) => !h.startsWith(`${BASE}/`));
      const broken = internal.filter((h) => h.startsWith(`${BASE}/`) && !existsSync(targetFile(h)));
      expect({ withoutBase, broken }).toEqual({ withoutBase: [], broken: [] });
    });
  }
});
