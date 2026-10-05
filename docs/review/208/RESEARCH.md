# Visual do site — pesquisa e proposta

Issue: #208

Base do site: `54750af` (main, PRs #1/#2 da #116). Frente: `feature/208-visual-site`, checkout `dimension-riders-site-wt/visual`.

## Decisões existentes

- #187: Murilo escolheu A, Relicário. #188 implementou o kit; #194 o título e Configurações.
- Kit real consultado em `origin/main:art/menu/kit.py`, `Assets/Scripts/Flow/Kit/UiKitTheme.cs` e `Assets/Art/Menu/Kit/Resources/UiKitTheme.asset`. Fontes: Russo One (títulos e botões), Rajdhani SemiBold (corpo). Tinta `#0b0820`, ouro `#d9a441`, realce `#f2cd72`, âmbar `#ffd166` → `#ff9419`, violeta `#a77bff` → `#6532d6`, ciano `#7ff3ff`.
- `STORY.md` e `ART.md` da oficina narrativa lidos integralmente. Chamada oficial: Proteja a Dobra. Sele as Fendas. / Protect the Fold. Seal the Rifts. Sem inventar facções, dimensões ou recursos. Tradução Gearworks conferida na tabela de localização do jogo.
- #116: domínio e HTTPS resolvidos; contato público `support@dimensionriders.app`. Play Store e APK públicos ainda sem URL. Preservar domínio, privacidade com anúncios opcionais, contato e retirada de links privados.

## Pesquisa externa (05/10/2026)

- [Brawl Stars — Supercell](https://supercell.com/en/games/brawlstars/): arte na abertura, síntese do jogo, links de loja. Inferência de design: cabeçalho enxuto, arte como primeiro contato e ação principal clara. Captura de referência em `captures/reference-brawlstars.png`.
- [Clash Royale — Supercell](https://supercell.com/en/games/clashroyale/): personagens, explicação do jogo e lojas. Inferência de design: apresentar o elenco e separar explicação, imagens e informações. Captura em `captures/reference-clashroyale.png`.
- [Google — marca e selo](https://developer.android.com/distribute/marketing-tools/brand-guidelines): o selo oficial é disponibilizado no Partner Marketing Hub. Proposta: botão genérico de download com Android e estado Em breve; quando a ficha existir, usar o selo original localizado e o link real. Não fabricar selo ou link. Não é preciso nova decisão sobre distribuição nesta etapa.
- Sites oficiais Archero/Habby tentados, mas não acessíveis no navegador de pesquisa; sem tratar como evidência visual. As referências do gênero já aprovadas na #187 dão o contexto do kit; não se reabre aquela decisão.

## Opções concretas

A (recomendada): abertura com arte promocional já aprovada para a ficha; texto à esquerda e Cavaleiro/Fenda à direita; no celular, texto e chamada seguidos pela arte. Mais presença do universo e do jogador. Capturas reais abaixo.

B: mesma linguagem, elenco, documentos, download e navegação, com captura real grande da Floresta na abertura. Evidencia o jogo imediatamente; perde parte da presença da ilustração inicial.

As duas têm início, download, Dobra e privacidade, PT e EN. `index.html` reúne comparação, capturas e pesquisa. `build_mockups.py` gera 16 arquivos estáticos de revisão; não participa do build Astro.

## Imagens e procedência

Artes reaproveitadas; nenhuma imagem nova gerada e nenhum conteúdo de captura alterado.

- `assets/feature.png`, `icon.png`: `docs/store/graphics/FeatureGraphic_1024x500.png` e `AppIcon_512.png` da #117.
- `assets/{pt,en}-*.png`: `docs/store/screenshots/{pt,en}/` da #117; arquivo `assets/store-source.json` preserva o manifesto original. Capturas das corridas e arsenal usadas na galeria; título e Dobra separados para aplicação na implementação.
- `assets/knight.png`: `art/characters/references/knight_golden.png`.
- `assets/chaser.png`: `dimension-riders-art/characters/forest/chaser/1-concept/concept.png`.
- `assets/forest-tyrant.png`: `dimension-riders-art/characters/forest/tyrant/1-concept/concept.png`.
- `assets/lava-tyrant.png`: `dimension-riders-art/characters/lava/tyrant/1-concept/concept.png`. Exceção de magma brilhante do Tirano confirmada no BRIEFS atual.
- `assets/selo.svg`: `art/mark/selo.svg` do jogo.
- Fontes e OFL copiados de `Assets/Art/Menu/Fonts/`.
- Binários consultados no checkout `dimension-riders-wt/store`; comparação de SHA-256 do manifesto feita antes de entregar. O checkout principal do jogo está atrasado e não foi atualizado ou editado.

Conceitos estão identificados como conceitos no protótipo. A implementação pode preservar esses cartões ou usar renders de modelos exportados; o mockup não promete que a ilustração seja gameplay.

## Conferência e limites

Chrome: 16 páginas × 2 viewports (1440×1000 e 390×844), imagens decodificadas, um h1, ausência de overflow horizontal, nenhum erro de script; botão em breve desativado no download. Proposta A também conferida em 320 px. Resultado detalhado em `captures/checks.json`. Inspeção visual de início A desktop/celular e download celular realizada. Capturas atuais de início/download em PT preservadas em `captures/before-*`.

Só pesquisa/protótipos em `docs/review/208`; nenhum arquivo em `src`, `public`, configuração ou workflow foi alterado. Não há build/teste de produção a rodar nesta etapa. Os PNGs originais são pesados e só servem para revisão: a implementação deve gerar formatos web eficientes, definir dimensões e carregamento, manter licenças e texto alternativo.

Pacote completo publicado em http://100.81.91.123:8000/visual/208-site/. PNGs/capturas ficam nesse pacote e no checkout local, ignorados pelo git para não duplicar 54 MB de arte existente no histórico do site. Fontes dos protótipos, licenças, manifestos e resultado das verificações são commitados. Para recuperar a revisão em outro checkout, copie o pacote do homelab (`~/apk-server/visual/208-site/`) para esta pasta.

## Depois da escolha

1. Aplicar a direção escolhida nos componentes/layouts/estilos Astro.
2. Imagens eficientes e responsivas; capturas por idioma; logos/fontes com licença.
3. Botão Android visível e em breve com URL vazia; selo oficial/link quando `PLAY_STORE_URL` estiver preenchido; APK apenas público.
4. Preservar política, suporte, canonical/alternate e domínio.
5. `npm run check`, navegação/teclado e capturas dos quatro tipos de página em PT/EN, celular/computador.
6. Integrar e publicar pelo fluxo do repositório; validar URLs, assets e HTTPS; enviar capturas finais no painel.
