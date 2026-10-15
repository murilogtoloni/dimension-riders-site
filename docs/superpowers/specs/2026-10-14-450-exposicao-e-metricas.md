# Site: como está exposto hoje e métricas de visitas e cliques para baixar

Issue: dimension-riders#450. Relacionadas: #449 (anúncios em rede social), #250 e #427 (GA4 do app), #438/#440
(espelho do BigQuery e Metabase no homelab), #117 (ficha e produção na Play).

**Decisão do Murilo pelo painel (2026-10-14):** opção B (GA4 no mesmo projeto do app, sem cookie) e "tudo agora"
(base e GA4 já). Implementado neste branch; ver README, seção Métricas.

**Correção em 2026-10-15:** no Chrome, com o ID real (`G-W6494Y4XPH`), o GA4 gravou os cookies `_ga` mesmo com
`client_storage: 'none'` e outras três variações; só o consentimento negado evita o cookie, e aí os relatórios do
GA4 quase não mostram nada. A opção B abaixo, como escrita ("sem cookie, sem banner"), não existe. O Murilo escolheu
então cookie com aviso de aceite só na Europa: padrão negado por IP na UE/EEE/Reino Unido/Suíça, aviso para quem
tem fuso da Europa, cookie de 60 dias no resto do mundo.

A análise abaixo foi só análise e proposta: nenhuma conta criada, nenhum serviço cadastrado, nada mudado no DNS nem publicado.
Conferido no ar em 2026-10-14.

## 1. Como o site está exposto hoje

| Item | Estado | Observação |
|---|---|---|
| Hospedagem | GitHub Pages (Fastly na frente), HTTPS, `www` redireciona (301) para a raiz | Sem acesso a log de acesso: o Pages não mostra visitas |
| Métricas | Nenhuma | Nenhum script no HTML; o site não grava cookie |
| `robots.txt` | **404** | Sem ele o Google indexa tudo (aceitável), mas também não aponta o sitemap |
| Sitemap | **404** (`/sitemap.xml`, `/sitemap-index.xml`) | São 12 páginas em 2 idiomas; o sitemap ajuda o Google a achar as duas versões |
| Search Console | **Não configurado** | O DNS não tem TXT `google-site-verification` e o site não tem meta nem arquivo de verificação |
| Indexação | Não encontrado numa busca pelo domínio | Indício (não prova) de que ainda não está indexado; só o Search Console confirma |
| Meta e Open Graph | Bons | `description`, `canonical`, `hreflang` en/pt-BR/x-default, `og:*` com imagem 1200×630, `twitter:card` grande. Ao colar o link numa rede social, o cartão sai certo |
| Página raiz `/` | `noindex` + redireciona por idioma do navegador | Correto: o Google indexa `/en/` e `/pt/` |
| Botão "baixar" | **Desligado** ("em breve") | `PLAY_STORE_URL` e `APK_URL` vazios em `src/config.ts`; o app está no teste interno/fechado, sem ficha pública. Hoje não existe clique para baixar a medir |
| UTM no link da Play | Não há link | Quando `PLAY_STORE_URL` for preenchido, entra sem UTM se nada mudar |
| Quem aponta para o site | A ficha da Play vai ter o campo Site (`docs/store/LISTING.md`, #117); o e-mail de suporte é do domínio | O jogo não abre o site (só `mailto:` do suporte). `app-ads.txt` publicado |
| Política de privacidade | Igual ao texto do jogo (`Assets/Resources/Legal/privacy.*.txt`) | Fala só do app. Não cita o próprio site nem a hospedagem (o GitHub registra IP nos logs dele) |

Resumo: o site está bem montado para ser compartilhado (cartão de rede social, idiomas, HTTPS), mas está
invisível para medição e pouco preparado para busca: sem sitemap, sem robots, sem Search Console e sem nenhuma
contagem de visita. O botão da Play ainda não existe, então a métrica de clique só passa a valer quando a ficha
for pública (#117).

## 2. O que medir

| Pergunta | Evento ou fonte |
|---|---|
| Quantos visitam | visualização de página, por página |
| De onde vêm | referrer (Instagram, TikTok, Google, direto) e UTM da URL de entrada (`utm_source`, `utm_campaign` dos anúncios da #449) |
| Em que idioma e país | página `/en/` ou `/pt/`, idioma do navegador, país aproximado |
| Quantos clicam para baixar | clique no selo da Play (e no APK, se voltar a existir), com a página onde estava |
| Quantos instalam | **não sai do site**: vem da Play (relatório de aquisição por UTM) e do `first_open` do GA4 do app |

O elo entre o clique no site e a instalação é o próprio link da Play com `referrer`:

```text
https://play.google.com/store/apps/details?id=app.dimensionriders&referrer=utm_source%3Dsite%26utm_medium%3Dbotao_baixar%26utm_campaign%3D<origem-da-visita>
```

- A Play Console mostra visitantes da ficha e instalações por `utm_source`/`utm_campaign`
  (Estatísticas > Aquisição > canais rastreados).
- O SDK do Firebase lê o Install Referrer e grava a campanha no `first_open` do GA4 do app. O app usa
  `firebase-analytics` 23.2.0; conferir num build que a biblioteca `installreferrer` entra no Gradle resolvido
  (a #427 já tem o `first_open` no espelho, então dá para ver o campo `traffic_source` no Metabase).
- Repassar a campanha da visita para o link (quem chegou por `utm_campaign=reels-1` sai para a Play com
  `utm_campaign=reels-1`) é um script de poucas linhas no site, sem cookie.

**Ligação com a #449:** anúncio de instalação deve ir **direto para a Play** com `referrer` (menos um clique e
menos perda); o site serve para tráfego orgânico (link na bio, busca, compartilhamento) e para quem quer saber
mais antes de instalar. Os dois caminhos usam os mesmos nomes de `utm_campaign`, então a Play Console e o GA4 do
app comparam anúncio direto e anúncio via site na mesma tabela. Sugestão de padrão: `utm_source` = rede
(`tiktok`, `instagram`, `youtube`), `utm_medium` = `anuncio` ou `bio`, `utm_campaign` = id do vídeo da #449.

## 3. Base comum (entra em qualquer opção)

Sem custo nem conta nova; o que é do Murilo está marcado.

1. `robots.txt` e `sitemap.xml` gerados no build (integração oficial `@astrojs/sitemap` ou um endpoint de
   12 linhas, sem dependência), com `hreflang` no sitemap.
2. **Murilo:** Search Console com propriedade de domínio (um TXT no Route 53, que o agente passa pronto) e envio
   do sitemap. Mostra buscas, impressões, cliques do Google e erros de indexação. Bing Webmaster importa do Search
   Console, opcional.
3. Link da Play com `referrer` e UTM quando `PLAY_STORE_URL` for preenchido (#117), com repasse da campanha.
4. Política do site: uma seção "Este site" dizendo que o site é hospedado no GitHub Pages (que registra IP e
   navegador nos logs dele) e, se escolhida uma ferramenta, o que ela coleta. A seção vale só para o site; o texto
   do jogo não muda (não trata dado do app), então não precisa de aviso na abertura do jogo. Na próxima revisão
   do texto legal do jogo, decidir se a cópia do jogo ganha a mesma seção para os textos seguirem iguais.

## 4. Opções de métricas

### A — Só a base, sem ferramenta no site

- **Mede:** buscas no Google (Search Console); visitantes da ficha e instalações por campanha (Play Console);
  campanha do `first_open` (GA4 do app).
- **Não mede:** visitas totais, de onde vêm as visitas de rede social, cliques no botão.
- **Custo:** zero. **Conta nova:** nenhuma. **Privacidade:** nada novo no site; política só ganha a hospedagem.
- **Esforço:** ~1 h do agente + 10 min do Murilo (TXT e Search Console).

### B — GA4: fluxo web na mesma propriedade do app, sem cookie (recomendada)

- **Como:** o Murilo cria um fluxo de dados Web na propriedade `557702138` (ele é o dono; o agente é só Leitor) e
  marca esse fluxo na exportação para o BigQuery. O site carrega o `gtag.js` com `client_storage: 'none'`,
  sem Google Signals nem personalização de anúncios: nenhum cookie, então **sem banner de consentimento**.
  Eventos: `page_view` (automático, com referrer, UTM, idioma e país) e `click_play` (com página e campanha).
- **Onde ver:** no GA4 (Relatórios em tempo real e Aquisição) e no Metabase da #440, porque o evento cai no mesmo
  export do BigQuery que a #438 espelha. Site, Play e app no mesmo painel, sem serviço novo.
- **Limites:** sem cookie, cada visita conta como visitante novo (mede visitas, não pessoas únicas; para o
  pré-lançamento é o que importa). Bloqueador de anúncio corta uma parte das visitas (estimativa de mercado
  10–30% no desktop, menos no celular). Os dados vão ao Google, o que a política já assume para o app.
- **Privacidade:** sem cookie nem identificador guardado, não há acesso ao aparelho que exija consentimento
  (ePrivacy); base legal = legítimo interesse, como as métricas do app fora da Europa. A política do site ganha
  "Este site: Google Analytics conta visitas e cliques sem cookie; o Google recebe IP e navegador, o GA4 não
  guarda o IP".
- **Custo:** zero; a exportação do BigQuery continua no sandbox (o volume do site é ínfimo perto do limite).
  **Conta nova:** nenhuma.
- **Esforço:** ~3 h do agente (script, evento, repasse de UTM, testes, política, painel no Metabase) + 10 min do
  Murilo (fluxo web e marcar na exportação).

Variante com cookie (visitantes únicos e sessões reais): exige banner de consentimento com Consent Mode, que
aparece para todo visitante, e política mais longa. Não vale para um site de 12 páginas antes do lançamento.

### C — Umami Cloud, plano grátis (sem cookie, painel próprio)

- **Como:** conta nova no Umami Cloud (Hobby: US$ 0, 100 mil eventos/mês, 1 site, 6 meses de retenção). Um
  script de 2 KB; o clique vira evento por atributo no HTML (`data-umami-event`).
- **Mede:** visitas, visitantes únicos (sem cookie, por hash diário), referrer, UTM, país, idioma, aparelho e o
  clique. Painel pronto e simples de ler.
- **Limites:** o plano grátis não tem API: não chega ao Metabase (só exportação manual), e site e app ficam em
  painéis separados. Mais um fornecedor na política e mais uma conta para proteger (#281). Dados com mais de 6
  meses somem.
- **Privacidade:** a mais leve (sem cookie, sem identificador, IP descartado). Política ganha "Este site: Umami".
- **Custo:** zero no Hobby; o Pro com API custa US$ 20/mês. **Conta nova:** sim.
- **Esforço:** ~1,5 h do agente + 15 min do Murilo (criar conta e site, passar o id).

### Descartadas

- **Umami ou Plausible no homelab:** o coletor precisa ser público; o homelab só responde pela Tailscale, e
  abrir uma porta ou um Funnel contraria a regra do painel interno.
- **Plausible Cloud:** pago (a partir de ~US$ 9/mês), sem vantagem sobre C para este volume.
- **Cloudflare Web Analytics:** grátis e sem cookie, mas exige conta nova e não tem evento de clique (só daria
  com uma página intermediária de redirecionamento); com o DNS no Route 53, só funciona pelo script.

## 5. Recomendação

**Base comum + B (GA4 sem cookie).** Não cria conta, não abre nada para fora do homelab, não exige banner, e
o clique no site, a ficha da Play e o `first_open` do app ficam no mesmo BigQuery que o Metabase da #440 já lê:
o funil "visita → clique → instalação → primeira corrida" sai num painel só, por campanha da #449.

Quando: a base (sitemap, robots, Search Console) pode entrar já, porque o Google leva semanas para indexar. O
GA4 e o link com UTM entram junto com o `PLAY_STORE_URL`, antes da produção (#117) e dos primeiros anúncios
(#449). A implementação é pequena: segue nesta issue, no repositório do site, num PR que o Murilo aprova.

## Fontes

- Umami Cloud, planos: https://umami.is/pricing (consultado em 2026-10-14)
- Cloudflare Web Analytics, limites: https://developers.cloudflare.com/web-analytics/limits/ e
  https://developers.cloudflare.com/analytics/faq/web-analytics
- GA4, `client_storage` e cookies: https://developers.google.com/tag-platform/security/guides/consent
- Play Console, aquisição por UTM: https://support.google.com/googleplay/android-developer/answer/9859173
- Install Referrer: https://developer.android.com/google/play/installreferrer
