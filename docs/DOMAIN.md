# Domínio e contato

Issue: dimension-riders#116. Domínio comprado pelo Murilo em 2026-10-05: `dimensionriders.app`.

O branch prepara o site na raiz do domínio, CNAME no artefato, contato por e-mail e links públicos. O APK fica
oculto enquanto não há distribuição pública; o Release do jogo privado responde 404 sem autenticação. O teste
interno continua pelo convite do Google Play. A política da Fase 2 é trabalho da #117; ela usa o mesmo contato.

## Ativação (Murilo)

1. Abra [Settings > Pages do site](https://github.com/murilogtoloni/dimension-riders-site/settings/pages).
   Mantenha Source = GitHub Actions. Em Custom domain, copie `dimensionriders.app` (sem protocolo nem barra) e
   clique Save. Faça isso antes de apontar o DNS. Este deploy usa Actions: ter `public/CNAME` não configura sozinho
   o domínio no painel.
2. O DNS consultado em 2026-10-05 aponta para AWS Route 53. Abra
   [Route 53](https://console.aws.amazon.com/route53/v2/hostedzones), Hosted zones, a zona pública
   `dimensionriders.app`. Use a zona cujos NS correspondam aos valores abaixo, caso haja mais de uma. Em Create
   record, use Simple routing, Alias desligado e TTL 300. Na raiz, deixe Record name vazio (outros provedores usam
   `@`). Crie um conjunto A com quatro linhas e um conjunto AAAA com quatro linhas; para CNAME, nome `www`.

NS atuais (preserve os registros NS e SOA):

```text
ns-1036.awsdns-01.org
ns-828.awsdns-39.net
ns-1992.awsdns-57.co.uk
ns-173.awsdns-21.com
```

A, nome vazio, valores:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

AAAA, nome vazio, valores:

```text
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

CNAME, nome `www`, valor:

```text
murilogtoloni.github.io
```

3. Aguarde DNS check successful no GitHub Pages. Marque Enforce HTTPS assim que o certificado estiver disponível
   (o GitHub informa até 24 h). O domínio `.app` precisa de HTTPS para abrir no navegador. Avise pelo painel quando
   tiver salvo o domínio e o DNS; o agente integra/publica o branch e confere as páginas e os assets. Não é preciso
   mesclar o PR à mão.

## Encaminhamento do contato (Murilo)

Sugestão: [ImprovMX Free](https://improvmx.com/pricing/), com encaminhamento de um domínio. O destino é a caixa que
você já lê; não precisa divulgar esse endereço no site nem enviar senha ao agente. Se já usa outro serviço, mantenha
o serviço e configure o mesmo alias, informando qual no painel.

1. Abra [ImprovMX](https://app.improvmx.com/), crie/acesse sua conta e adicione `dimensionriders.app`. Confirme a
   conta e o destino conforme os e-mails recebidos. No domínio, crie alias `contato`, encaminhado para sua caixa.
2. No mesmo DNS, crie MX na raiz com as duas linhas abaixo (prioridade já incluída). Crie TXT na raiz com o valor
   abaixo, incluindo as aspas no Route 53. Ambos: TTL 300, Simple routing, Alias desligado.

MX, nome vazio:

```text
10 mx1.improvmx.com
20 mx2.improvmx.com
```

TXT, nome vazio:

```text
"v=spf1 include:spf.improvmx.com ~all"
```

Se já houver serviço de e-mail/MX/SPF, informe no painel antes de substituir: SPF deve continuar em um único TXT.

3. No ImprovMX, confira a ativação do domínio. Envie uma mensagem de uma segunda conta para
   `contato@dimensionriders.app` e confirme recebimento (inclusive spam). Responda a ela pela caixa de destino para
   conferir que consegue atender o contato. O plano Free encaminha recebimento; envio com remetente do domínio
   requer configuração adicional. Avise pelo painel quando o teste funcionar.

## AdMob (Murilo fornece; agente publica)

Abra AdMob > Apps > View all apps > app-ads.txt > How to set up app-ads.txt. Copie a linha personalizada completa
para o comentário do painel. Ela contém o publisher ID real da conta (`pub-` e 16 dígitos); não use IDs de teste ou
IDs de bloco de anúncio. A linha não é senha. O agente grava `public/app-ads.txt` e verifica o arquivo publicado em:

```text
https://dimensionriders.app/app-ads.txt
```

Não há arquivo provisório com vendedor fictício. Depois que a ficha da Play estiver publicada e informar o Site
abaixo, o AdMob poderá verificar o domínio. A publicação da ficha é da #117.

## Valores para a Play Store (depois de confirmar site e e-mail)

```text
Site: https://dimensionriders.app/
Política de privacidade (EN): https://dimensionriders.app/en/privacy/
Política de privacidade (PT): https://dimensionriders.app/pt/privacidade/
E-mail: contato@dimensionriders.app
```

## Fontes oficiais

- [GitHub Pages: domínio e registros DNS](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Route 53: campos e valores dos registros](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-values-basic.html)
- [ImprovMX: registros MX/SPF](https://improvmx.com/guides/generic-dns-configuration/)
- [Google AdMob: linha personalizada e site do desenvolvedor](https://support.google.com/admob/answer/9363762?hl=en)
