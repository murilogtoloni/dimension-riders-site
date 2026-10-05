import type { Locale } from '../i18n';
import ptForest from './shots/pt/forest.webp';
import ptGear from './shots/pt/gear.webp';
import ptLava from './shots/pt/lava.webp';
import ptArsenal from './shots/pt/arsenal.webp';
import ptFold from './shots/pt/fold.webp';
import enForest from './shots/en/forest.webp';
import enGear from './shots/en/gear.webp';
import enLava from './shots/en/lava.webp';
import enArsenal from './shots/en/arsenal.webp';
import enFold from './shots/en/fold.webp';

const localized = {
  pt: { forest: ptForest, gear: ptGear, lava: ptLava, arsenal: ptArsenal, fold: ptFold },
  en: { forest: enForest, gear: enGear, lava: enLava, arsenal: enArsenal, fold: enFold },
};
export const shotsFor = (locale: Locale) => localized[locale];
