import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CONTACT_EMAIL } from '../src/config';
import { DIST, SITE, read } from './helpers';

describe('publicação no domínio próprio (#116)', () => {
  it('o artefato leva CNAME e URLs públicas na raiz do domínio', () => {
    expect(read('/CNAME').trim()).toBe(new URL(SITE).hostname);
    for (const [locale, privacy] of [['en', 'privacy'], ['pt', 'privacidade']]) {
      const html = read(`/${locale}/${privacy}/index.html`);
      expect(html).toContain(`rel="canonical" href="${SITE}/${locale}/${privacy}/"`);
      expect(html).toContain(`href="mailto:${CONTACT_EMAIL}"`);
      expect(html).toContain(`property="og:image" content="${SITE}/og.jpg"`);
    }
  });

  it('app-ads.txt na raiz com o publisher real do AdMob (#312)', () => {
    const lines = read('/app-ads.txt').trim().split('\n');
    expect(lines).toEqual(['google.com, pub-4500268638478905, DIRECT, f08c47fec0942fa0']);
    expect(read('/app-ads.txt')).not.toContain('pub-3940256099942544');
  });

  it('nenhuma página pública manda visitantes para o repositório privado ou a antiga subpasta', () => {
    const htmlFiles = readdirSync(DIST, { recursive: true }).filter((path) => String(path).endsWith('.html'));
    for (const path of htmlFiles) {
      const html = readFileSync(join(DIST, String(path)), 'utf8');
      expect(html).not.toContain('github.com/murilogtoloni/dimension-riders');
      expect(html).not.toContain('/dimension-riders-site/');
      expect(html).not.toContain('href=""');
    }
  });
});
