import type { ImageMetadata } from 'astro';

/** Capturas de tela em src/images/shots/, em ordem de nome de arquivo. Vazio se a pasta estiver vazia. */
const modules = import.meta.glob<{ default: ImageMetadata }>('./shots/*.{png,jpg,jpeg,webp}', { eager: true });

export const shots: ImageMetadata[] = Object.keys(modules)
  .sort()
  .map((path) => modules[path].default);
