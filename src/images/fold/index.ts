/** As cinco camadas e os cinco Tiranos, na ordem do menu do jogo (ver SOURCES.md). */
import forest from './worlds/forest.webp';
import gear from './worlds/gear.webp';
import lava from './worlds/lava.webp';
import ice from './worlds/ice.webp';
import reef from './worlds/reef.webp';
import forestTyrant from './tyrants/forest.webp';
import gearTyrant from './tyrants/gear.webp';
import lavaTyrant from './tyrants/lava.webp';
import iceTyrant from './tyrants/ice.webp';
import reefTyrant from './tyrants/reef.webp';

export const WORLD_KEYS = ['forest', 'gear', 'lava', 'ice', 'reef'] as const;
export const WORLDS = [
  { key: 'forest', image: forest }, { key: 'gear', image: gear }, { key: 'lava', image: lava },
  { key: 'ice', image: ice }, { key: 'reef', image: reef },
] as const;
export const TYRANTS = [
  { key: 'forest', image: forestTyrant }, { key: 'gear', image: gearTyrant }, { key: 'lava', image: lavaTyrant },
  { key: 'ice', image: iceTyrant }, { key: 'reef', image: reefTyrant },
] as const;
