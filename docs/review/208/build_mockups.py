"""Issue #208: gera somente protótipos estáticos de revisão, fora de src/public."""
from pathlib import Path
from html import escape
import re

ROOT = Path(__file__).resolve().parent
SITE = ROOT.parents[2]
DOWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/></svg>'
COPY = {
 'pt': dict(home='Início', fold='A Dobra', download='Baixar', privacy='Privacidade',
  eyebrow='AÇÃO PARA ANDROID · GRÁTIS · OFFLINE', h1='Proteja a Dobra.<br><strong>Sele as Fendas.</strong>',
  intro='Você é um Cavaleiro. Atravesse mundos, enfrente os invasores e derrube os Tiranos. Sua Estilha já está puxando.',
  cta='Baixar para Android', cta2='Conheça os mundos', facts='Em breve no Google Play · Sem conta',
  sum=[('Mova. Mire. Atire.','Dois polegares, uma missão.'),('Cada corrida, uma escolha.','Armas, relíquias e runas.'),('Mundos para proteger.','Enfrente seus invasores.')],
  roster_title='Pequenos heróis.<br>Grandes encrencas.', roster_text='Um Cavaleiro entre muitos. Criaturas de outros mundos. E Tiranos que não querem ir embora.',
  roster=[('O Cavaleiro','A Estilha puxa. Você segue.','knight'),('Invasor da Floresta','Nem todo morador da floresta é amigo.','chaser'),('Tirano da Floresta','O líder que sustenta a invasão.','forest-tyrant'),('Tirano da Caldeira','Âmbar, pedra e muito mau humor.','lava-tyrant')],
  concept='Arte de conceito do jogo', direct='DIRETO DO JOGO', gallery='Veja a corrida de perto.', gallery_p='Capturas reais. Armas, invasores e mundos para atravessar.',
  captions=['Na Floresta Primeva','Na Engrenagem','Na Caldeira','Prepare seu equipamento'],
  story_title='Tem outro mundo precisando de ajuda.', story_text='Os mundos vivem em camadas. Os Tiranos abrem Fendas para invadir. Os Cavaleiros seguem os vincos para fechá-las.', story_link='Explore a Dobra',
  close='Sua Estilha está puxando.', close_p='Grátis. Joga offline. Sem conta. Anúncio só se você quiser.',
  download_title='Seu próximo mundo<br>cabe no bolso.', download_p='Dimension Riders para Android. Ação com dois joysticks, corridas entre mundos e uma Fenda para selar.',
  soon='EM BREVE', store='Google Play', store_label='Para Android', store_p='O lançamento no Google Play está em preparação. O botão de instalação será liberado aqui quando a ficha estiver pública.',
  download_notice='O download público ainda não está disponível.', requirements='Android 8 ou mais novo.',
  download_features=[('Grátis para jogar','Anúncios em vídeo são opcionais.'),('Jogue offline','A corrida e o progresso ficam no aparelho.'),('Sem criar conta','Comece sua jornada sem cadastro.')],
  fold_desc='Quem são os Cavaleiros, o que move os Tiranos e por que sua Estilha está puxando.', privacy_title='Política de privacidade', privacy_desc='Seus dados, anúncios opcionais e suas escolhas de privacidade.', made='Feito por Murilo Toloni', contact='Contato', actual='Captura real do jogo', art='Arte promocional do jogo'),
 'en': dict(home='Home', fold='The Fold', download='Download', privacy='Privacy',
  eyebrow='ACTION FOR ANDROID · FREE · OFFLINE', h1='Protect the Fold.<br><strong>Seal the Rifts.</strong>',
  intro='You are a Rider. Cross worlds, fight the invaders and bring down the Tyrants. Your Shard is already pulling.',
  cta='Download for Android', cta2='Discover the worlds', facts='Coming soon to Google Play · No account',
  sum=[('Move. Aim. Shoot.','Two thumbs, one mission.'),('Every run, a choice.','Weapons, relics and runes.'),('Worlds to protect.','Face their invaders.')],
  roster_title='Little heroes.<br>Big trouble.', roster_text='One Rider among many. Creatures from other worlds. And Tyrants who refuse to leave.',
  roster=[('The Rider','The Shard pulls. You follow.','knight'),('Forest invader','Not every forest dweller is a friend.','chaser'),('Forest Tyrant','The leader behind the invasion.','forest-tyrant'),('Caldera Tyrant','Amber, stone and a very bad temper.','lava-tyrant')],
  concept='Game concept art', direct='FROM THE GAME', gallery='Take a closer look at the run.', gallery_p='Real screenshots. Weapons, invaders and worlds to cross.',
  captions=['In the Primeval Forest','In Gearworks','In Caldera','Prepare your equipment'],
  story_title='Another world needs your help.', story_text='The worlds lie in layers. The Tyrants open Rifts to invade. The Riders follow the creases to seal them.', story_link='Explore the Fold',
  close='Your Shard is pulling.', close_p='Free. Plays offline. No account. Ads only if you choose.',
  download_title='Your next world<br>fits in your pocket.', download_p='Dimension Riders for Android. Dual-stick action, runs across worlds and a Rift to seal.',
  soon='COMING SOON', store='Google Play', store_label='For Android', store_p='The Google Play launch is in preparation. Installation will be available here when the listing is public.',
  download_notice='Public download is not available yet.', requirements='Android 8 or newer.',
  download_features=[('Free to play','Video ads are optional.'),('Play offline','Your runs and progress stay on your device.'),('No account needed','Start your journey without signing up.')],
  fold_desc='Who the Riders are, what drives the Tyrants and why your Shard is pulling.', privacy_title='Privacy policy', privacy_desc='Your data, optional ads and your privacy choices.', made='Made by Murilo Toloni', contact='Contact', actual='Real game screenshot', art='Game promotional art')
}

def md(content):
    # Os documentos existentes são apresentados sem mudar seu texto.
    def inline(t):
        t=escape(t)
        t=re.sub(r'\*\*(.*?)\*\*',r'<strong>\1</strong>',t)
        t=re.sub(r'\[(.*?)\]\((.*?)\)',r'<a href="\2">\1</a>',t)
        return t
    parts=[]
    for block in content.strip().split('\n\n'):
        if block.startswith('# '): continue
        if block.startswith('## '): parts.append('<h2>'+inline(block[3:])+'</h2>')
        elif block.startswith('### '): parts.append('<h3>'+inline(block[4:])+'</h3>')
        elif block.startswith('- '): parts.append('<ul>'+''.join('<li>'+inline(line[2:])+'</li>' for line in block.splitlines() if line.startswith('- '))+'</ul>')
        elif block.startswith('> '): parts.append('<blockquote>'+inline(block.replace('> ',''))+'</blockquote>')
        elif block.startswith('---'): continue
        else: parts.append('<p>'+inline(block.replace('\n',' '))+'</p>')
    return '\n'.join(parts)

def render(direction,lang,page):
    c=COPY[lang]
    def url(p,l=lang,d=direction): return f'{d.lower()}-{l}-{p}.html'
    def button(label,p='download',secondary=False):
        return f'<a class="button {"secondary" if secondary else ""}" href="{url(p)}">{DOWN if p=="download" else ""}{label}</a>'
    links=''.join(f'<a {"aria-current=page" if p==page else ""} href="{url(p)}" class="{"nav-download" if p=="download" else ""}">{c[p]}</a>' for p in ('home','fold','download'))
    language=''.join(f'<a href="{url(page,l)}" lang="{l}" {"aria-current=true" if l==lang else ""}>{l.upper()}</a>' for l in ('pt','en'))
    header=f'<header><div class="wrap"><a class="brand" href="{url("home")}"><img src="assets/selo.svg" alt=""><span>DIMENSION RIDERS</span></a><nav aria-label="{c["home"]}">{links}<div class="language">{language}</div></nav></div></header>'
    if page=='home':
        hero_copy=f'<div class="hero-copy"><div class="eyebrow">{c["eyebrow"]}</div><h1>{c["h1"]}</h1><p>{c["intro"]}</p><div class="buttons">{button(c["cta"])}<a class="text-link" href="{url("fold")}">{c["cta2"]} →</a></div><div class="facts">{c["facts"]}</div></div>'
        if direction=='A': hero=f'<section class="hero hero-a"><div class="wrap">{hero_copy}</div><span class="art-credit">{c["art"]}</span></section>'
        else: hero=f'<section class="hero hero-b"><div class="wrap">{hero_copy}<div class="game-window"><img src="assets/{lang}-2-run-0.png" alt="{c["captions"][0]}"><div class="window-label">{c["actual"]}</div></div></div></section>'
        summary='<div class="wrap summary">'+''.join(f'<div><b>{title}</b><span>{text}</span></div>' for title,text in c['sum'])+'</div>'
        roster=''.join(f'<article class="character"><img src="assets/{img}.png" alt="{title}" loading="lazy"><div class="caption"><h3>{title}</h3><p>{text}</p><small>{c["concept"]}</small></div></article>' for title,text,img in c['roster'])
        roster=f'<section class="content wrap"><div class="section-top"><h2>{c["roster_title"]}</h2><p>{c["roster_text"]}</p></div><div class="roster">{roster}</div></section>'
        shots=''.join(f'<figure class="shot"><img src="assets/{lang}-{name}.png" alt="{caption}" loading="lazy"><figcaption>{caption}</figcaption></figure>' for name,caption in zip(('2-run-0','3-run-1','4-run-2','5-arsenal'),c['captions']))
        gallery=f'<div class="gallery-band"><section class="content wrap"><div class="eyebrow">{c["direct"]}</div><div class="section-top"><h2>{c["gallery"]}</h2><p>{c["gallery_p"]}</p></div><div class="shots">{shots}</div></section></div>'
        story=f'<section class="content wrap"><div class="story-callout"><img src="assets/selo.svg" alt=""><div><h2>{c["story_title"]}</h2><p>{c["story_text"]}</p></div>{button(c["story_link"],"fold",True)}</div></section>'
        content=hero+summary+roster+gallery+story+f'<section class="closing"><h2>{c["close"]}</h2><p>{c["close_p"]}</p>{button(c["cta"])}</section>'
    elif page=='download':
        panel=f'<div class="download-panel"><div class="ribbon"><span>{c["store"]}</span><span class="badge-soon">{c["soon"]}</span></div><button class="store-disabled" disabled>{DOWN}<span>{c["store_label"]}<small>{c["soon"]}</small></span></button><p>{c["store_p"]}</p><p class="notice">{c["download_notice"]}<br>{c["requirements"]}</p></div>'
        features=''.join(f'<div><h3>{title}</h3><p>{text}</p></div>' for title,text in c['download_features'])
        content=f'<section class="download-main"><div class="wrap"><div class="download-grid"><div class="download-art"><img src="assets/feature.png" alt="{c["art"]}"><img class="mini-icon" src="assets/icon.png" alt="Dimension Riders"></div><div class="download-copy"><div class="eyebrow">DIMENSION RIDERS · ANDROID</div><h1>{c["download_title"]}</h1><p>{c["download_p"]}</p>{panel}</div></div><div class="download-features">{features}</div></div></section>'
    else:
        title=c['fold'] if page=='fold' else c['privacy_title']
        desc=c['fold_desc'] if page=='fold' else c['privacy_desc']
        doc=(SITE/'src/content'/f'{page}.{lang}.md').read_text()
        content=f'<section class="doc-hero"><div class="wrap"><div class="eyebrow">DIMENSION RIDERS</div><h1>{title}</h1><p>{desc}</p></div></section><section class="reading">'+(f'<img class="seal" src="assets/selo.svg" alt=""><div class="character"><img src="assets/knight.png" alt="{c["roster"][0][0]}"></div>' if page=='fold' else '')+f'<article>{md(doc)}</article></section>'
    footer=f'<footer><div class="wrap"><span>© 2026 Dimension Riders · {c["made"]}</span><div><a href="{url("privacy")}">{c["privacy"]}</a><a href="mailto:support@dimensionriders.app">{c["contact"]}</a></div></div></footer>'
    preview=f'<div class="preview">Mockup #208 · {direction} <a href="index.html">Comparar propostas</a> <a href="{url(page,d="B" if direction=="A" else "A")}">Ver {"B" if direction=="A" else "A"}</a></div>'
    return f'<!doctype html><html lang="{lang if lang=="en" else "pt-BR"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{c[page]} · Dimension Riders · {direction}</title><link rel="stylesheet" href="mockup.css"></head><body>{preview}{header}<main>{content}</main>{footer}</body></html>'

for direction in ('A','B'):
    for lang in ('pt','en'):
        for page in ('home','download','fold','privacy'):
            (ROOT/f'{direction.lower()}-{lang}-{page}.html').write_text(render(direction,lang,page))
print('16 mockups estáticos gerados; src/public não foram alterados.')
