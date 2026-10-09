import type { Locale } from '../i18n';
import ptForest from './shots/pt/forest.webp';
import ptGear from './shots/pt/gear.webp';
import ptLava from './shots/pt/lava.webp';
import ptArsenal from './shots/pt/arsenal.webp';
import enForest from './shots/en/forest.webp';
import enGear from './shots/en/gear.webp';
import enLava from './shots/en/lava.webp';
import enArsenal from './shots/en/arsenal.webp';

const localized = {
  pt: { forest: ptForest, gear: ptGear, lava: ptLava, arsenal: ptArsenal },
  en: { forest: enForest, gear: enGear, lava: enLava, arsenal: enArsenal },
};
export const shotsFor = (locale: Locale) => localized[locale];
