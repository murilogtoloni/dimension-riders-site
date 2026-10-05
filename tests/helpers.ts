import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const configSource = readFileSync(fileURLToPath(new URL('../astro.config.mjs', import.meta.url)), 'utf8');
const baseMatch = configSource.match(/base:\s*'([^']*)'/);
if (!baseMatch) throw new Error("tests/helpers: não achei base: '...' em astro.config.mjs");

/** O base do site, sem barra final. */
export const BASE = baseMatch[1].replace(/\/+$/, '');
export const SITE = 'https://dimensionriders.app';
export const DIST = fileURLToPath(new URL('../dist', import.meta.url));
/** Lê um arquivo de dist/ pelo caminho com barra inicial, ex.: read('/en/index.html'). */
export const read = (path: string) => readFileSync(`${DIST}${path}`, 'utf8');
