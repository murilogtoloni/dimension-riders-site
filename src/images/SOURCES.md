# Imagens do site

Issue: #208. Murilo aprovou a direção A pelo painel em 2026-10-05.

- `feature.webp`: recurso gráfico novo da ficha (dimension-riders#337, opção A "O duelo", escolhida pelo Murilo no painel em 2026-10-09), `docs/store/graphics/FeatureGraphic_1024x500.png` do jogo; o Cavaleiro com o arco, como no jogo, contra o Tirano da Floresta numa Fenda. Hoje só ilustra a página Baixar; o topo usa a `hero.webp` (#341).
- `icon.webp`: arte aprovada da ficha #117 (direção A da #260), `docs/store/graphics/AppIcon_512.png` do jogo.
- `characters/knight.webp`: `art/characters/references/knight_golden.png` do jogo.
- `characters/chaser.webp`, `forest-tyrant.webp`, `lava-tyrant.webp`: conceitos em `dimension-riders-art/characters/{forest/chaser,forest/tyrant,lava/tyrant}/1-concept/concept.png`. Identificados como arte de conceito no site.
- `shots/{pt,en}/{forest,gear,lava,arsenal}.webp`: capturas `docs/store/screenshots/{pt,en}/{2-run-0,3-run-1,4-run-2,5-arsenal}.png` da #117 (a `6-fold` saiu com a página da Dobra nova, #339). Cada idioma usa a própria HUD e menus.
- `public/selo.svg`: `art/mark/selo.svg` do jogo; mesmo Selo do favicon.
- `badges/en-google-play.png` e `pt-google-play.png`: selos oficiais baixados de [Google Play, inglês](https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png) e [português](https://play.google.com/intl/en_us/badges/static/images/badges/pt-br_badge_web_generic.png). Só exibidos com `PLAY_STORE_URL` preenchido. Sem redesenho ou corte.

Os PNGs do jogo foram codificados em WebP (Sharp, qualidade 90), preservando composição e resolução. Astro gera versões menores para `srcset`; as capturas completas continuam acessíveis ao clicar. Originais/hashes da #117 e pacote da revisão em `docs/review/208/RESEARCH.md`.

Russo One e Rajdhani SemiBold em `src/fonts/`: fontes do kit Relicário convertidas para WOFF2; licenças OFL junto aos arquivos. Os arquivos PNG e componente de blocos da versão inicial foram substituídos pelas imagens otimizadas e pelo elenco/galeria da direção aprovada.

## Página da Dobra (#339)

Direção "Travessia", escolhida pelo Murilo no painel em 2026-10-09. Tudo reaproveitado, sem geração nova. Preparo em `dimension-riders-art/site-339/20261009-dobra-v1/make.py` (Pillow, WebP).

- `fold/rift-islands.webp`, `fold/three-rifts.webp` e `fold/duel.webp`: as opções C ("O Cavaleiro e a Fenda"), B ("Os mundos") e A ("O duelo") do feature graphic da #337, geradas pelo gerador de imagem do Codex (OpenAI) em 2026-10-09 (`feature-337/20261009-opcoes-v1/gen2/`), sem o logo (a A com logo é a `feature.webp` do topo). Registro: `docs/legal/ia-por-ativo.md` do jogo.
- `fold/rider-rift.webp`: pintura do Cavaleiro diante da Fenda feita para o ícone da #260 (`icon/painted/v3-feature/concept.png`, Codex a partir de um render do modelo).
- `fold/worlds/*.webp`: faixa central (sem HUD, 1080×760) das capturas da #338 no S25: Floresta, Engrenagem, Geleira e Atol da passada em português, Caldeira da passada em inglês. Sem texto, servem aos dois idiomas.
- `fold/tyrants/*.webp`: conceitos dos cinco Tiranos (`characters/{forest,gear,lava,ice,reef}/tyrant/1-concept/concept.png`; Codex, Qwen ou do Murilo, conforme `ia-por-ativo.md`). O da Geleira veio em fundo verde, trocado pelo cinza dos outros.
- `fold/amber.webp`: conceito do cristal de Âmbar (`props/amber_crystal/1-concept/concept.png`, Qwen).

## Imagem do topo (#341)

Pintura feita para o topo (2,5:1), sem texto na arte: o Cavaleiro grande à direita, atirando com o arco, e o Tirano da Floresta pequeno ao fundo, saindo de uma Fenda; o lado esquerdo escuro e calmo para o título. Opção A "O guardião", escolhida pelo Murilo no painel em 2026-10-09 entre três (B "A Fenda", sem monstro; C "A Caldeira", com o Tirano de lava).

- `hero.webp` (2560×1024, WebP q82 pelo Pillow): gerada pelo gerador de imagem do Codex (OpenAI, `gpt-image-2`) em 2026-10-09, com o ícone do app, o Cavaleiro do jogo com o arco, o conceito do Tirano, a Fenda pintada da #260 e o recurso gráfico da #337 como referências de estilo; a geração saiu em 1983×793 e foi ampliada para 2560 px (Lanczos, realce leve). Oficina: `dimension-riders-art/feature-341/20261009-hero-v1/` (`prompts/A.txt`, `gen/A.png` original, `out/A-2560.png` fonte, `receipt.json`). Registro: `docs/legal/ia-por-ativo.md` do jogo.
- No `Hero.astro`, `<Picture>` gera AVIF e WebP em 960, 1600 e 2560 px (a maior fica em ~120 KB); no celular a imagem fica embaixo do texto, centrada no Cavaleiro (`object-position: 90% bottom`).
