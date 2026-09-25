# Site do Dimension Riders — versão 1 (design)

Data: 2026-09-25. Decidido com o Murilo nesta sessão. A história e o glossário que o site usa estão em
`~/projetos/dimension-riders-story/STORY.md`; este spec não os repete.

## 1. Objetivo

Um site público e estático para o jogo mobile **Dimension Riders**, no ar junto com o lançamento na Play
Store. Ele faz três coisas:

1. Dá vontade de experimentar o jogo: gancho da história, imagens, botão de download.
2. Fornece a URL de política de privacidade que o Play Console exige.
3. Serve de base para o que vem depois (ranking, bestiário, mais idiomas) sem precisar ser refeito.

Bilíngue desde o início: inglês (padrão) e português do Brasil, com framework de tradução para acrescentar
idiomas depois.

## 2. Fora de escopo (versão 1)

- Ranking, contas, qualquer coisa que exija servidor. O jogo é offline e não envia dados; ranking é projeto
  pós-lançamento e exige backend e mudanças no jogo.
- Bestiário ou catálogo de inimigos. Entra depois como coleção de conteúdo, sem mexer no que existe.
- Notícias, blog, formulário de contato, e-mail, analytics. Contato é o link do GitHub no rodapé.
- Domínio próprio. O site sai em `murilogtoloni.github.io/dimension-riders-site`; domínio depois é uma
  linha de configuração e um arquivo CNAME.
- Arte nova. Só o que já existe no jogo mais capturas de tela.

## 3. Stack

- **Astro**, site estático, publicado no **GitHub Pages** por GitHub Actions.
- Sem JavaScript no navegador na versão 1, exceto o redirecionamento de idioma na raiz.
- i18n nativo do Astro: rotas com prefixo de idioma (`/en/`, `/pt/`), `en` como padrão, todas as rotas
  prefixadas (inclusive o padrão), para que os dois idiomas fiquem simétricos.
- Node LTS, npm. Um único `package.json`.

Motivo da escolha: páginas de conteúdo carregam rápido no celular (onde a maioria chega vindo da loja),
i18n sem biblioteca extra, e React pode entrar como "ilha" só no ranking, quando ele existir.

## 4. Páginas

Quatro páginas, cada uma nos dois idiomas. Nomes de rota seguem o glossário do STORY.md.

| Página | EN | PT-BR |
|---|---|---|
| Início | `/en/` | `/pt/` |
| A Dobra (história) | `/en/fold/` | `/pt/dobra/` |
| Baixar | `/en/download/` | `/pt/baixar/` |
| Privacidade | `/en/privacy/` | `/pt/privacidade/` |

**Raiz (`/`)**: página mínima que lê o idioma do navegador e redireciona para `/pt/` se for português, senão
para `/en/`. Também tem um `<meta http-equiv="refresh">` para `/en/` como fallback sem JavaScript.

### 4.1 Início

De cima para baixo:

1. **Capa (Hero)**: título "Dimension Riders", slogan, o texto de abertura da história (STORY.md, seção 9),
   botões de download (seção 6). Fundo: a feature graphic do jogo.
2. **Três blocos** do que o jogo é, cada um com título, uma frase e uma imagem: cavalgue os vincos, sele os
   Rasgos, derrube os Tiranos. Imagens são recortes das capturas de tela.
3. **Galeria** de capturas de tela do celular, em retrato.
4. **Chamada final**: uma frase e os botões de download de novo.

### 4.2 A Dobra

A história adaptada do STORY.md para leitura pública: a Dobra, o Âmbar, a Marca, os dois lados. Texto corrido,
em Markdown, uma imagem por seção quando houver. Respeita a seção 11 do STORY.md (perguntas em aberto): o texto
nunca afirma a origem da Dobra nem o significado da Marca.

### 4.3 Baixar

Botão da Play Store (desligado até existir o link), botão do APK, versão atual, requisito (Android 8 ou mais
novo), instruções curtas para instalar fora da loja. Quando a loja estiver no ar, o botão da loja passa a ser
o principal e o APK fica como opção secundária.

### 4.4 Privacidade

Texto simples e verdadeiro: o jogo não coleta dados pessoais, funciona offline, não tem anúncios nem contas;
o progresso fica só no aparelho. Data da última atualização. É a URL que vai no Play Console.

### 4.5 Navegação

Cabeçalho com as quatro páginas e o seletor de idioma (troca para a mesma página no outro idioma). Rodapé com
o link da privacidade, o link do GitHub e o nome do desenvolvedor.

## 5. Estrutura de arquivos

```
dimension-riders-site/
  astro.config.mjs               site, base (/dimension-riders-site), i18n
  package.json
  src/
    i18n/
      en.json                    todo texto de interface e da capa
      pt.json
      index.ts                   t(lang, chave); lista de idiomas; mapa de rotas por idioma
    content/
      fold.en.md                 a história
      fold.pt.md
      privacy.en.md              a política de privacidade
      privacy.pt.md
    config.ts                    constantes de produto: link da loja, link do APK, versão, GitHub
    layouts/
      Base.astro                 <head>, cabeçalho, rodapé, hreflang, metadados sociais
    views/
      Home, DocPage, Download    uma "view" por tipo de página, recebe o idioma; as páginas só a chamam
    components/
      Hero.astro
      FeatureBlock.astro
      Gallery.astro              lê src/images/shots/ via import.meta.glob; mostra aviso se vazia
      StoreButtons.astro         Play Store (opcional) + APK
      LangSwitch.astro
    pages/
      index.astro                redirecionamento por idioma
      en/  index.astro, fold.astro, download.astro, privacy.astro
      pt/  index.astro, dobra.astro, baixar.astro, privacidade.astro
    images/
      icon.png                   AppIcon_1024 do jogo
      feature.png                FeatureGraphic_1024x500 do jogo
      shots/                     capturas de tela (vazia até chegarem, com .gitkeep)
  public/
    favicon.svg
  tests/
    helpers.ts                   BASE (lido do astro.config), DIST, read()
    i18n.test.ts, i18n-parity.test.ts, root-redirect.test.ts
    home.test.ts, home-sections.test.ts, docs.test.ts, download.test.ts
    links.test.ts, fold-verb.test.ts
  docs/superpowers/specs/        este arquivo
  .github/workflows/deploy.yml
```

**Regras:**

- Nenhum texto visível vive em `.astro`. Tudo vem de `src/i18n/*.json` ou de `src/content/*.md`. Assim não
  sobra texto sem tradução.
- As páginas em `en/` e `pt/` são finas: chamam os mesmos componentes passando o idioma.
- Adicionar um idioma é: um `xx.json`, os `.xx.md`, uma pasta `pages/xx/`, uma entrada na lista de idiomas.
  Nenhum componente muda.
- O mapa de rotas por idioma (`fold` ↔ `dobra`, `download` ↔ `baixar`, `privacy` ↔ `privacidade`) fica em
  `src/i18n/index.ts` e é o que o seletor de idioma e os `hreflang` usam.

## 6. Imagens e download

- **Existentes**: `AppIcon_1024.png` e `FeatureGraphic_1024x500.png` do repositório do jogo
  (`Assets/Icons/`), copiados para `src/images/`.
- **Capturas de tela**: pelo menos quatro, em retrato, tiradas pelo Murilo no celular, em
  `src/images/shots/`. A galeria lê a pasta com `import.meta.glob`; adicionar é colocar o arquivo. Se a pasta estiver vazia, a
  galeria mostra um quadro "capturas em breve" (texto do dicionário) e não quebra o layout.
- **Otimização**: as imagens ficam em `src/images/` e passam pelo `<Image>` do Astro (redimensionamento e
  WebP no build), o que só funciona para imagens importadas de `src/`, não de `public/`. Comita-se o PNG
  original.
- **APK**: não fica no site. É asset de um Release no GitHub do repositório do jogo; o botão aponta para o link
  fixo de "última versão" (`.../releases/latest/download/dimension-riders-release.apk`). A versão exibida na
  página Baixar vem de `APP_VERSION` em `src/config.ts`, atualizada a cada release.
- **Play Store**: o link vive em `PLAY_STORE_URL` em `src/config.ts`; vazio, o botão da loja não é renderizado.

## 7. Deploy

- Workflow `deploy.yml`: em push na `main`, instala (`actions/setup-node`), roda `astro build`, roda
  `npm test` (os testes de HTML leem `dist/`), publica no GitHub Pages com `actions/upload-pages-artifact` +
  `actions/deploy-pages`. Sem segredos.
- Setup manual único, pelo Murilo: criar o repositório `murilogtoloni/dimension-riders-site` no GitHub e ligar
  Pages com origem "GitHub Actions" nas configurações.
- `base` em `astro.config.mjs` é `/dimension-riders-site`; todo link interno usa `import.meta.env.BASE_URL`
  para não quebrar. Domínio próprio depois: `base` vira `/`, entra o `public/CNAME`.

## 8. Testes

Rodam com `npm test` (Vitest) e no workflow antes do build.

- **Paridade de idiomas**: carrega todos os `src/i18n/*.json` e falha se o conjunto de chaves de qualquer
  idioma diferir do padrão (`en`).
- **Links internos**: após o build, percorre o HTML em `dist/` e falha se algum `href` interno apontar para um
  arquivo que não existe. Cobre os dois idiomas e o seletor de idioma.
- **"fold" como verbo**: percorre os textos de interface em inglês (`en.json`, exceto a chave narrativa
  `hero.opening`, onde a abertura da história diz "who folded the worlds") e falha se encontrar `fold`, `folds`,
  `folded` ou `folding`, ignorando "the Fold" e "into the fold". A história em `fold.en.md` é narrativa e fica
  fora da regra. Regra do STORY.md, seção 8.
- **Páginas geradas**: um teste por página confere no HTML de `dist/` o `lang`, os textos do idioma certo, os
  `hreflang`, o link do APK e a ausência do botão da loja enquanto o link estiver vazio.
- **Build**: `astro build` é o teste principal de rotas, imagens e Markdown. Roda no workflow.

Sem teste visual automatizado. A conferência no celular é do Murilo.

## 9. Critério de pronto

1. As quatro páginas nos dois idiomas, no ar, no link do GitHub Pages.
2. Funciona no celular sem rolagem lateral; abre rápido (sem JavaScript além do redirecionamento da raiz).
3. A URL da privacidade existe e pode ser colada no Play Console.
4. O botão do APK aponta para o Release do jogo. O botão da loja aparece só quando o link existir.
5. Adicionar um idioma ou uma captura de tela não exige mexer em componente.
6. `npm test` passa e o workflow publica sozinho a cada push na `main`.

## 10. Ordem de trabalho

1. Esqueleto Astro, configuração de i18n e base, workflow de deploy, página raiz. Objetivo: link no ar no
   primeiro dia, mesmo vazio.
2. Dicionários, layout base, cabeçalho, rodapé, seletor de idioma, as quatro páginas nos dois idiomas com
   texto de verdade.
3. Imagens do jogo, galeria, botões de download.
4. Testes de paridade, links e "fold".

## 11. Dependências externas

- Capturas de tela do celular (Murilo).
- Release do jogo no GitHub com o APK como asset (repositório do jogo; hoje o APK só é publicado num link do
  homelab via `tools/deploy-apk.sh`).
- Link da Play Store, quando existir.
