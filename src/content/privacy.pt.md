Última atualização: 2026-10-30

Dimension Riders é um jogo para Android feito no Brasil. Responsável pelos dados descritos aqui: o desenvolvedor do jogo (MTechnologies). Contato: [support@dimensionriders.app](mailto:support@dimensionriders.app).

Você pode jogar sem uma conta vinculada. O progresso fica no aparelho. No Android, o Play Games pode reconhecer seu perfil de jogador; nos Ajustes você também pode vincular uma Conta Google para recuperar seu progresso. Essas formas de entrar podem acessar a mesma conta do jogo. Veja as cópias disponíveis em "Cópia do progresso".

## O que sai do aparelho

Google Analytics para Firebase (métricas): como o jogo é jogado (corridas, sessões, desempenho e estabilidade da nuvem), a campanha de instalação (Play Install Referrer), a versão, o aparelho, o idioma, o país aproximado pelo IP, um identificador da instalação e um código pseudônimo (hash irreversível) da conta do jogo, sem o ID de publicidade; serve para ajustar a dificuldade, conferir a estabilidade e medir a divulgação.

Firebase Crashlytics (relatórios de falha): quando o jogo trava, o erro, o trecho do código, a versão, o aparelho, indicadores técnicos de sincronização e identificadores da instalação e da sessão; serve para corrigir erros.

Google AdMob (vídeos recompensados, opcionais): para mostrar e medir anúncios e evitar fraude, pode tratar o ID de publicidade, outros identificadores do aparelho, o IP e as interações com os anúncios; o kit inicia ao abrir o jogo. Na dobra da recompensa diária, recebe o identificador da conta do jogo para confirmar o prêmio no servidor. Mais: [policies.google.com/technologies/partner-sites](https://policies.google.com/technologies/partner-sites).

## Identificador aleatório

Para registrar as recompensas diárias e não pagar a mesma duas vezes, o jogo cria sozinho, no Firebase, um identificador aleatório, sem nome nem email, com os recibos e um contador de dias. Ao vincular uma conta, esse identificador passa a permitir a recuperação do progresso. Google e Firebase podem tratar os dados de identidade autorizados no login, como nome e email; o jogo não solicita acesso às mensagens do Gmail. O aplicativo também valida sua integridade no Android com o Google Play Integrity (Firebase App Check).

## Cópia do progresso

Backup do Android: com o backup do Google ligado no celular (nas configurações do Android), o arquivo de progresso do jogo vai junto para a sua conta Google e volta quando você reinstala o jogo ou troca de celular. Vai só o progresso (Âmbar, itens, talentos, recordes); a corrida em andamento, os ajustes e as escolhas de privacidade ficam no aparelho. Desligar o backup do Android impede a cópia.

Play Games: se você usa o Play Games no celular, o jogo entra com ele sozinho ao abrir e liga a conta do jogo ao seu perfil de jogador, para recuperar o progresso quando você reinstala o jogo ou troca de celular.

Conta do jogo no Firebase: para contas vinculadas, o progresso é sincronizado em momentos como abertura, fim de corrida, vínculo, compras, forja e mudanças no menu. Um snapshot comprimido fica no Firestore, associado ao identificador da conta do jogo. A sincronização usa a conexão disponível, preserva a corrida deste aparelho e pede confirmação antes de unir o progresso deste aparelho ao de outra conta.

## Permissão e como desligar

Na União Europeia, no Espaço Econômico Europeu, na Suíça e no Reino Unido, métricas e relatórios de falha só saem com a sua permissão, pedida na primeira abertura; fora dessas regiões, o envio começa ligado, pelo nosso legítimo interesse em melhorar o jogo. Ligue ou desligue cada um em Ajustes > Termos e privacidade > Opções de dados. Anúncios personalizados: na área europeia, o Google pergunta antes (mude em Ajustes > Privacidade dos anúncios); fora dela, não há personalização.

## Por quanto tempo guardamos

Há rotinas de limpeza de registros com prazo de 60 dias (incluindo o espelho interno de métricas do desenvolvedor, onde identificadores pseudônimos saem em até 60 dias e restam só totais diários). Contas vinculadas e contas com compras são protegidas dessa limpeza; o progresso da conta vinculada permanece até a exclusão da conta. Isso não significa que todos os dados de métricas, anúncios ou backups tenham o mesmo prazo. O Google, nosso parceiro de tecnologia, tem prazos próprios e pode guardar dados por mais tempo para prestar seus serviços, proteger contra fraudes ou cumprir obrigações legais. Saiba mais: [policies.google.com/technologies/retention](https://policies.google.com/technologies/retention).

## Segurança

Os dados são transmitidos por conexão criptografada (HTTPS) ao Google (Firebase, Play Integrity, AdMob, backup do Android e Google Play Games), em servidores que podem ficar fora do Brasil. O tratamento segue as condições de cada serviço; anúncios podem envolver parceiros do Google. Não vendemos dados.

## Crianças e adolescentes

O jogo não é dirigido a menores de 13 anos; nas regiões europeias acima, menores de 16 devem pedir a um responsável antes de permitir o envio.

## Seus direitos

No aplicativo, Ajustes > Conta > Excluir conta permite pedir a exclusão da conta do jogo e do progresso associado no Firebase; é necessária conexão para o pedido chegar ao servidor. A exclusão vale para a conta do jogo aberta no aparelho (quando uma conta criada só pelo Play Games e sem compras é unida a uma Conta Google, a conta antiga já é encerrada automaticamente; para outra conta sua, escreva ao suporte; se a conta do progresso salvo não estiver mais disponível neste aparelho, o mesmo botão permite apagar só o progresso deste aparelho). O backup do Android e os dados do Play Games são gerenciados separadamente na sua conta Google. O pedido de exclusão da conta do jogo não apaga automaticamente dados de métricas ou anúncios desses serviços. Desligar métricas ou desinstalar não apaga os dados já enviados. Para dúvidas e exercício de direitos, escreva para [support@dimensionriders.app](mailto:support@dimensionriders.app). Você também pode procurar a ANPD, no Brasil, ou a autoridade de proteção de dados do seu país.

Pedidos no aplicativo exigem conexão e são processados pela rotina diária, que apaga a conta, o progresso e as recompensas e mantém apenas um marcador técnico sem dados pessoais e recibos de transação sem o identificador da conta para evitar repetição de bônus e fraudes. Sem o aplicativo, consulte [dimension-riders.web.app/excluir-conta](https://dimension-riders.web.app/excluir-conta) ou envie o pedido para [support@dimensionriders.app](mailto:support@dimensionriders.app), com o assunto EXCLUSÃO DE CONTA - DIMENSION RIDERS e o e-mail da Conta Google ou o nome de jogador do Play Games vinculados. Precisamos validar a titularidade; não envie senhas ou códigos de login. Uma conta sem Conta Google nem Play Games vinculados pode não ser identificável após desinstalar.

## Este site

O site dimensionriders.app é hospedado no GitHub Pages; o GitHub registra o endereço IP e o navegador de quem visita nos registros de segurança dele.

Para saber como o jogo é encontrado, o site usa o Google Analytics: a página visitada, o site ou a campanha de onde você veio, o idioma, o tipo de aparelho, o país aproximado e se você tocou no botão da Google Play. Para contar visitantes, ele grava os cookies _ga, que reconhecem o mesmo navegador por até 60 dias desde a última visita, sem ligar a visita ao jogo. Esses dados não servem para anúncios. Mais: [policies.google.com/technologies/partner-sites](https://policies.google.com/technologies/partner-sites).

Na União Europeia, no Espaço Econômico Europeu, na Suíça e no Reino Unido, os cookies só são gravados se você aceitar no aviso do site; sem aceite, o Google recebe só um registro da visita, sem cookie. A escolha fica guardada no navegador, e o botão Cookies no rodapé reabre o aviso. Fora dessas regiões, a contagem com cookies começa ligada, pelo nosso legítimo interesse em entender a divulgação do jogo; para não ser contado, apague ou bloqueie os cookies do site no navegador ou use um bloqueador de conteúdo.

## Mudanças nesta política

Quando esta política mudar, a versão nova entra no jogo e no site dimensionriders.app, onde a data no topo da página mostra a última atualização.
