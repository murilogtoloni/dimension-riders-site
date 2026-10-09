import { loadDoc } from './load';
import type { Locale } from '../i18n';

/** Um capítulo da Dobra: o título do "##" do Markdown e os parágrafos (HTML) abaixo dele. */
export interface Chapter { id: string; title: string; paragraphs: string[] }
export interface FoldProps { locale: Locale; opening: string[]; chapters: Chapter[] }
/** Mundos, Âmbar, Desdobrados, Cavaleiros, Selo: as figuras são escolhidas pela posição, então a ordem é fixa. */
export const CHAPTER_COUNT = 5;

const paragraphsOf = (part: string) => [...part.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1].trim());

/**
 * Lê src/content/fold.<idioma>.md: o que está antes do primeiro "##" é a abertura; cada "##" abre um capítulo.
 * Lança se o número de capítulos mudar: os dois idiomas precisam dos mesmos cinco, na mesma ordem.
 */
export async function foldChapters(locale: Locale): Promise<{ opening: string[]; chapters: Chapter[] }> {
  const html = await loadDoc('fold', locale).compiledContent();
  const [openingHtml, ...parts] = html.split(/(?=<h2\b)/);
  const chapters = parts.map((part) => {
    const m = part.match(/^<h2 id="([^"]+)">([\s\S]*?)<\/h2>([\s\S]*)$/);
    if (!m) throw new Error(`fold: capítulo sem <h2 id> em ${locale}`);
    return { id: m[1], title: m[2], paragraphs: paragraphsOf(m[3]) };
  });
  if (chapters.length !== CHAPTER_COUNT) throw new Error(`fold: esperava ${CHAPTER_COUNT} capítulos em ${locale}, achei ${chapters.length}`);
  return { opening: paragraphsOf(openingHtml), chapters };
}
