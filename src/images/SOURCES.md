# Imagens do site

Issue: #208. Murilo aprovou a direção A pelo painel em 2026-10-05.

- `feature.webp` e `icon.webp`: artes aprovadas da ficha #117, `docs/store/graphics/FeatureGraphic_1024x500.png` e `AppIcon_512.png` do jogo.
- `characters/knight.webp`: `art/characters/references/knight_golden.png` do jogo.
- `characters/chaser.webp`, `forest-tyrant.webp`, `lava-tyrant.webp`: conceitos em `dimension-riders-art/characters/{forest/chaser,forest/tyrant,lava/tyrant}/1-concept/concept.png`. Identificados como arte de conceito no site.
- `shots/{pt,en}/{forest,gear,lava,arsenal,fold}.webp`: capturas `docs/store/screenshots/{pt,en}/{2-run-0,3-run-1,4-run-2,5-arsenal,6-fold}.png` da #117. Cada idioma usa a própria HUD e menus.
- `public/selo.svg`: `art/mark/selo.svg` do jogo; mesmo Selo do favicon.
- `badges/en-google-play.png` e `pt-google-play.png`: selos oficiais baixados de [Google Play, inglês](https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png) e [português](https://play.google.com/intl/en_us/badges/static/images/badges/pt-br_badge_web_generic.png). Só exibidos com `PLAY_STORE_URL` preenchido. Sem redesenho ou corte.

Os PNGs do jogo foram codificados em WebP (Sharp, qualidade 90), preservando composição e resolução. Astro gera versões menores para `srcset`; as capturas completas continuam acessíveis ao clicar. Originais/hashes da #117 e pacote da revisão em `docs/review/208/RESEARCH.md`.

Russo One e Rajdhani SemiBold em `src/fonts/`: fontes do kit Relicário convertidas para WOFF2; licenças OFL junto aos arquivos. Os arquivos PNG e componente de blocos da versão inicial foram substituídos pelas imagens otimizadas e pelo elenco/galeria da direção aprovada.
