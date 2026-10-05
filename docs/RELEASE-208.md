# Publicação do visual Relicário

Issue: #208 (murilogtoloni/dimension-riders).

Murilo escolheu a proposta A pelo painel: aventura com Cavaleiro e Fenda na abertura. A base inclui a #116 (`54750af`), com domínio, HTTPS e `support@dimensionriders.app` já ativos.

## Mudança

Início com chamada oficial da ordem, arte promocional aprovada, elenco de jogador/invasor/Tiranos, capturas reais por idioma e acesso à Dobra. Tipografia, paleta, molduras e botões seguem o kit Relicário. Download com arte, ícone, requisitos e botão Android desativado com Em breve até haver URL pública; preenchendo `PLAY_STORE_URL`, o componente passa a usar o selo oficial localizado e o link configurado. APK e instruções continuam condicionados a `APK_URL` público.

Dobra e privacidade compartilham a apresentação e a leitura responsiva. Só o título dos documentos foi movido do Markdown para o layout; o corpo da política permanece igual à #116. Canonical, alternates, rotas, contato, CNAME e workflow permanecem compatíveis. Fontes locais WOFF2; imagens WebP e versões responsivas de Astro; conteúdo sem JavaScript no navegador (só o redirecionamento de idioma na raiz já existente).

## Validação

- Build Astro: nove páginas e assets otimizados.
- 130 testes do repositório, incluindo download, localização, domínio, documentos, galeria e links.
- Chrome: oito páginas × três larguras (320, 390 e 1440 px), sem overflow ou imagens quebradas. H1, canonical, troca de idioma, download desativado e link de pular conteúdo conferidos.
- Estado de download habilitado conferido numa cópia temporária, com URLs de teste; nenhuma URL de teste entra na produção.
- Capturas de computador/celular em PT/EN e relatório em `Logs/208-final`; publicar no homelab após validar o deploy real.

Pesquisa/propostas e capturas de antes: http://100.81.91.123:8000/visual/208-site/.

## Configuração de lançamento

`src/config.ts`: manter URLs vazias enquanto a loja e o APK não forem públicos. Quando a ficha abrir, preencher `PLAY_STORE_URL` e publicar pelo workflow existente. Não colocar links do repositório privado. Esta issue não libera a ficha da loja nem reabre a configuração AdMob da #117.
