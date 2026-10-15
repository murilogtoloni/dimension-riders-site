# dimension-riders-site

Site do jogo mobile **Dimension Riders**: https://dimensionriders.app/

Astro 7, estático, bilíngue (inglês padrão, português do Brasil), publicado no GitHub Pages a cada push na `main`.

## Rodar

```bash
npm install
npm run dev      # http://localhost:4321/
npm run check    # build + testes (o que o deploy roda)
```

## Onde mexer

| Quero | Onde |
|---|---|
| Mudar um texto de interface | `src/i18n/en.json` e `src/i18n/pt.json` (as chaves têm que bater; `npm test` confere) |
| Mudar a história ou a privacidade | `src/content/fold.<idioma>.md`, `src/content/privacy.<idioma>.md` |
| Adicionar capturas de tela | jogue PNG/JPG em `src/images/shots/` (ordem por nome de arquivo) |
| Ligar o botão da Play Store | `PLAY_STORE_URL` em `src/config.ts` (o link sai com `referrer` de UTM; ver Métricas) |
| Ligar as métricas | `GA_MEASUREMENT_ID` em `src/config.ts` (ver Métricas) |
| Nova versão do APK | `APK_URL` (endereço público) e `APP_VERSION` em `src/config.ts`; vazio oculta o APK |
| Adicionar um idioma | `src/i18n/<xx>.json`, `src/content/*.<xx>.md`, pasta `src/pages/<xx>/` com as quatro páginas, e o código em `LOCALES`, `HTML_LANG` e `ROUTES` em `src/i18n/index.ts`, mais o locale em `astro.config.mjs` |
| Domínio próprio | `site` e `base` em `astro.config.mjs`, e um `public/CNAME` |

Ativação do domínio, DNS e encaminhamento do contato: `docs/DOMAIN.md` (issue #116). O deploy usa GitHub Actions: `public/CNAME` acompanha o artefato, mas o domínio também precisa ser salvo em Settings > Pages.

## Métricas (#450)

GA4 num fluxo Web da mesma propriedade do app, **sem cookie** (`client_storage: 'none'`, sem Google Signals): conta
`page_view` e o toque no selo da Play (`click_play`). Sem cookie, cada página conta sozinha, então a origem da visita
(UTM da URL ou o site que mandou o visitante) segue nos links internos e vai para o `referrer` do link da Play:
`utm_source` = origem, `utm_medium=site`, `utm_campaign` = campanha da visita, `utm_content` = meio da visita. Sem
origem: `direct`/`site`/`site`. A Play Console (aquisição por canal rastreado) e o `first_open` do app leem esse
`referrer`. Tudo em `src/metrics.ts`; o script só entra nas páginas com `GA_MEASUREMENT_ID` ou `PLAY_STORE_URL`
preenchido. Os eventos chegam ao BigQuery do app e ao espelho do homelab com `plataforma = WEB`.

Para anúncios (dimension-riders#449): `utm_source` = rede (`tiktok`, `instagram`, `youtube`), `utm_medium` =
`anuncio` ou `bio`, `utm_campaign` = id do vídeo; o mesmo padrão no anúncio que vai direto para a Play.

A política do site (`src/content/privacy.*.md`) tem a seção "Este site", que o texto do jogo
(`Assets/Resources/Legal/privacy.*.txt`) não tem; o resto é igual. `sitemap.xml` e `robots.txt` saem do build
(`src/pages/`).

Regras de escrita e glossário: `~/projetos/dimension-riders-story/STORY.md`. Spec e plano: `docs/superpowers/`.
