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
| Ligar o botão da Play Store | `PLAY_STORE_URL` em `src/config.ts` |
| Nova versão do APK | `APK_URL` (endereço público) e `APP_VERSION` em `src/config.ts`; vazio oculta o APK |
| Adicionar um idioma | `src/i18n/<xx>.json`, `src/content/*.<xx>.md`, pasta `src/pages/<xx>/` com as quatro páginas, e o código em `LOCALES`, `HTML_LANG` e `ROUTES` em `src/i18n/index.ts`, mais o locale em `astro.config.mjs` |
| Domínio próprio | `site` e `base` em `astro.config.mjs`, e um `public/CNAME` |

Ativação do domínio, DNS e encaminhamento do contato: `docs/DOMAIN.md` (issue #116). O deploy usa GitHub Actions: `public/CNAME` acompanha o artefato, mas o domínio também precisa ser salvo em Settings > Pages.

Regras de escrita e glossário: `~/projetos/dimension-riders-story/STORY.md`. Spec e plano: `docs/superpowers/`.
