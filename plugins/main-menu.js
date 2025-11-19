import fs from 'fs'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
const { levelling } = '../lib/levelling.js'
import { promises } from 'fs'
import { join } from 'path'
let handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text, command }) => {
try {        
let { exp, chocolates, level, role } = global.db.data.users[m.sender]
let { min, xp, max } = xpRange(level, global.multiplier)
let name = await conn.getName(m.sender)
let _uptime = process.uptime() * 1000
let _muptime
if (process.send) {
process.send('uptime')
_muptime = await new Promise(resolve => {
process.once('message', resolve)
setTimeout(resolve, 1000)
}) * 1000
}
let user = global.db.data.users[m.sender]
let muptime = clockString(_muptime)
let uptime = clockString(_uptime)
let totalreg = Object.keys(global.db.data.users).length
let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let perfil = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://qu.ax/QGAVS.jpg')
let taguser = '@' + m.sender.split("@s.whatsapp.net")[0]
const vid = ['https://files.catbox.moe/t4r0gq.gif', 'https://files.catbox.moe/t4r0gq.gif', 'https://files.catbox.moe/t4r0gq.gif']

let menu = `*🥟 황현진 ₊˚⊹ 🥢*

*ּ ֶָ֢! ᰔ ִ ׄ𝐎𝐥𝐢 𝐡𝐞𝐫𝐦𝐨𝐬𝐮𝐫𝐚 𝐜𝐨𝐦𝐨 𝐭𝐞 𝐞𝐧𝐜𝐮𝐞𝐧𝐭𝐫𝐚𝐬 𝐞𝐥 𝐝í𝐚 𝐝𝐞 𝐡𝐨𝐲ִ ࣪ ˖ ࣪*

*₊𖥔 ℓo͟v͟ꫀ ყoυ ! ۪ ׄ໑୧ ׅ𖥔ׄ.                · 　          ·.       ˚.         .     ๋ ࣭ 

   　 .  ๋ ࣭ ⭑         *           ˚                 

·       ๋ ࣭ *

“ 𝘖𝘭𝘪𝘪 *${taguser}* 𝘚𝘰𝘺 *𝓐𝓷𝓮𝓴𝓪 𝓑𝓸𝓽*, ${saludo} ”

.      ╭─ׅ─ׅ┈ ─๋︩︪─ ૮꒰◞ ˕ ◟ ྀི꒱ა─ׅ─ׅ┈ ─๋︩︪─╮
╭╼🧧     ⋆˚  ˖ ࣪  𝑨𝒏𝒆𝒌𝒊𝒕𝒂 ! ᰔ 𝜗𝜚˚⋆
                  ︶ ⏝ ︶ ୨୧ ︶ ⏝ ︶
│🥠 *𝕮𝖗𝖊𝖆𝖉𝖔𝖗:* 𝘋𝘢𝘯𝘪𝘦𝘭 𝘋'𝘈𝘯𝘦
│🥠 *𝕸𝖔𝖉𝖔:* 𝘗𝘶𝘣𝘭𝘪𝘤𝘰
│🥠 *𝕷𝖎𝖇𝖗𝖊𝖗𝖎𝖆:* 𝘉𝘢𝘪𝘭𝘦𝘺𝘴
│🥠 *𝕭𝖔𝖙:* ${(conn.user.jid == global.conn.user.jid ? 'Oficial' : 'SubBot')}
│🥠 *𝕿𝖎𝖊𝖒𝖕𝖔 𝖆𝖈𝖙𝖎𝖛𝖔:* ${uptime}
│🥠 *𝖀𝖘𝖚𝖆𝖗𝖎𝖔:* ${totalreg}
     
             ︶ ⏝ ︶ ୨୧ ︶ ⏝ ︶

.    ╭─ׅ─ׅ┈ ─๋︩︪─ ૮꒰◞ ˕ ◟ ྀི꒱ა─ׅ─ׅ┈ ─๋︩︪─╮
╭╼🧧     ⋆˚  ˖ ࣪  𝓤𝓼𝓾𝓪𝓻𝓲𝓸 ! ᰔ 𝜗𝜚˚⋆
             ︶ ⏝ ︶ ୨୧ ︶ ⏝ ︶
│🐅 *𝕮𝖑𝖎𝖊𝖓𝖙𝖊:* ${nombre}
│🐅 *𝕰𝖝𝖕𝖊𝖗𝖎𝖊𝖓𝖈𝖎𝖆:* ${exp}
│🐅 *𝕮𝖍𝖔𝖈𝖔𝖑𝖆𝖙𝖎𝖙𝖔𝖘:* ${chocolates}
│🐅 *𝕹𝖎𝖛𝖊𝖑:* ${level}
│🐅 *𝕽𝖆𝖓𝖌𝖔:* ${role}

      ︶ ⏝ ︶ ୨୧ ︶ ⏝ ︶

˚꒷︶︶꒷︶︶꒷꒦︶︶꒦ ˚꒷︶︶꒷︶︶꒷꒦︶︶꒦
            
⏝.⏝꒰ა𝘊𝘖𝘔𝘈𝘕𝘋𝘖𝘚 𝘈𝘕𝘌𝘒𝘈໒꒱⏝.⏝ 
.    ╭─ׅ─ׅ┈ ─๋︩︪─≽^• ˕ • ྀི≼─ׅ─ׅ┈ ─๋︩︪─╮
╭ ‧˚꒰🪭꒱༘‧  𝓘𝓷𝓯𝓸 𝓑𝓸𝓽
              ˙ . ꒷🍙 . 𖦹˙— 🐈‍⬛
╭・┈・┈・౨ৎ・┈・┈・
┊🧺.estado
┊🧺 .botreglas
┊🧺 .hornymenu
┊🧺 .creador
┊🧺 .menu2
┊🧺 .uptime
┊🧺 .script
┊🧺  .dash
┊🧺  .usuarios
┊🧺  .ping
┊🧺  .blocklist
┊🧺  .reporte
┊🧺  .sug
╰・┈・┈・౨ৎ・┈・┈・ 
.    ╭─ׅ─ׅ┈ ─๋︩︪─≽^• ˕ • ྀི≼─ׅ─ׅ┈ ─๋︩︪─╮
╭ ‧˚꒰🪭꒱༘‧  𝓑𝓾𝓼𝓬𝓪𝓭𝓸𝓻𝓮𝓼
              ˙ . ꒷🍙 . 𖦹˙— 🐈‍⬛
╭・┈・┈・౨ৎ・┈・┈・
┊🧺  .githubsearch <búsqueda>
┊🧺   .yts <búsqueda>
┊🧺  .imagen <query>
┊🧺  .pinterest <query>
┊🧺  .tiktoksearch <búsqueda>
╰・┈・┈・౨ৎ・┈・┈・
.    ╭─ׅ─ׅ┈ ─๋︩︪─≽^• ˕ • ྀི≼─ׅ─ׅ┈ ─๋︩︪─╮
╭ ‧˚꒰🪭꒱༘‧  𝓙𝓾𝓮𝓰𝓸𝓼
              ˙ . ꒷🍙 . 𖦹˙— 🐈‍⬛
╭・┈・┈・౨ৎ・┈・┈・
┊🧺   .69 @tag
┊🧺   .abrazar <@usuario>
┊🧺   .acertijo
┊🧺  .agarrar @tag
┊🧺  .anal @tag
┊🧺   .sonrojarse @tag
┊🧺   .gay <@tag> | <nombre>
┊🧺   .lesbiana <@tag> | <nombre>
┊🧺  .pajero <@tag> | <nombre>
┊🧺   .pajera <@tag> | <nombre>
┊🧺   .puto <@tag> | <nombre>
┊🧺   .puta <@tag> | <nombre>
┊🧺   .manco <@tag> | <nombre>
┊🧺  .manca <@tag> | <nombre>
┊🧺   .rata <@tag> | <nombre>
┊🧺   .prostituta <@tag> | <nombre>
┊🧺   .prostituto <@tag> | <nombre>
┊🧺   .apostar *<cantidad>*
┊🧺   .chupartetas @tag
┊🧺   .consejo
┊🧺   .cum @tag
┊🧺   .dance *<@user>*
┊🧺   .formarpareja5
┊🧺   .abrazar @tag
┊🧺   .violar @tag
┊🧺   .dormir @tag
┊🧺   .lamber @tag
┊🧺   .enamorada @tag
┊🧺   .mamada @tag
┊🧺   .meme
┊🧺   .violar @tag
┊🧺   .nombreninja *<texto>*
┊🧺   .acariciar @tag
┊🧺   .penetrar @user
┊🧺   .personalidad
┊🧺   .piropo
┊🧺   .pokedex *<pokemon>*
┊🧺   .pucheros @tag
┊🧺   .pregunta
┊🧺   .golpear @tag
┊🧺   .reto
┊🧺   .ruleta *<cantidad> <color>*
┊🧺   .rusa @tag
┊🧺   .triste @tag
┊🧺   .scared @tag
┊🧺   .sexo @tag
┊🧺   .ship
┊🧺   .love
┊🧺   .timida @tag
┊🧺   .simi
┊🧺   .bot
┊🧺   .dormir @tag
┊🧺   .dormir @tag
┊🧺  .top *<texto>*
┊🧺   .violar @tag
┊🧺   .tijeras @tag
┊🧺   .zodiac *2002 02 25*
┊🧺   .cancion
┊🧺   .math <mode>
┊🧺   .ppt
┊🧺   .slot <apuesta>
╰・┈・┈・౨ৎ・┈・┈・
.  .    ╭─ׅ─ׅ┈ ─๋︩︪─≽^• ˕ • ྀི≼─ׅ─ׅ┈ ─๋︩︪─╮
╭ ‧˚꒰🪭꒱༘‧ 𝓡𝓸𝓵𝓵𝔀𝓪𝓲𝓯𝓾
              ˙ . ꒷🍙 . 𖦹˙— 🐈‍⬛
╭・┈・┈・౨ৎ・┈・┈・
┊🧺   .character <personaje>
┊🧺   .confirmar
┊🧺   .darrw @usuario <personaje>
┊🧺   .guardar <personaje>
┊🧺  .sacar <personaje>
┊🧺   .obtenidos
┊🧺   .robarpersonaje
┊🧺   .roll
┊🧺   .toprw
╰・┈・┈・౨ৎ・┈・┈・
.    ╭─ׅ─ׅ┈ ─๋︩︪─≽^• ˕ • ྀི≼─ׅ─ׅ┈ ─๋︩︪─╮
╭ ‧˚꒰🪭꒱༘‧  𝓡𝓹𝓰
      ˙ . ꒷🍙 . 𖦹˙— 🐈‍⬛
╭・┈・┈・౨ৎ・┈・┈・
┊🧺   .bank
┊🧺   .cartera 
┊🧺   .crimen
┊🧺   .bal
┊🧺   .daily
┊🧺   .Buy
┊🧺   .Buyall
┊🧺   .claim
┊🧺   .depositar
┊🧺   .lb
┊🧺   .levelup
┊🧺   .minar
┊🧺   .retirar
┊🧺   .rob2
┊🧺   .rob
┊🧺   .addprem [@user] <days>
┊🧺   .slut
┊🧺   .trabajar
┊🧺   .transfer [tipo] [cantidad] [@tag]
╰・┈・┈・౨ৎ・┈・┈・

.    ╭─ׅ─ׅ┈ ─๋︩︪─≽^• ˕ • ྀི≼─ׅ─ׅ┈ ─๋︩︪─╮
╭ ‧˚꒰🪭꒱༘‧   𝓡𝓮𝓰𝓲𝓼𝓽𝓻𝓸
              ˙ . ꒷🍙 . 𖦹˙— 🐈‍⬛
╭・┈・┈・౨ৎ・┈・┈・
┊🧺  .profile
┊🧺   .unreg
┊🧺   .reg
╰・┈・┈・౨ৎ・┈・┈・

.    ╭─ׅ─ׅ┈ ─๋︩︪─≽^• ˕ • ྀི≼─ׅ─ׅ┈ ─๋︩︪─╮
╭ ‧˚꒰🪭꒱༘‧  𝓢𝓽𝓲𝓬𝓴𝓮𝓻𝓼
              ˙ . ꒷🍙 . 𖦹˙— 🐈‍⬛
╭・┈・┈・౨ৎ・┈・┈・
┊🧺   .toimg (reply)
┊🧺   .qc
┊🧺   .stiker <img>
┊🧺   .sticker <url>
┊🧺   .wm <packname>|<author>
╰・┈・┈・౨ৎ・┈・┈・
╭─ׅ─ׅ┈ ─๋︩︪─≽^• ˕ • ྀི≼─ׅ─ׅ┈ ─๋︩︪─╮
╭ ‧˚꒰🪭꒱༘‧  𝓕𝓲𝔁𝓶𝓮𝓷𝓼𝓪𝓳𝓮
              ˙ . ꒷🍙 . 𖦹˙— 🐈‍⬛
╭・┈・┈・౨ৎ・┈・┈・
┊🧺   .dsowner
┊🧺    .ds
╰・┈・┈・౨ৎ・┈・┈・
.    ╭─ׅ─ׅ┈ ─๋︩︪─≽^• ˕ • ྀི≼─ׅ─ׅ┈ ─๋︩︪─╮
╭ ‧˚꒰🪭꒱༘‧  𝓖𝓻𝓾𝓹𝓸𝓼 
              ˙ . ꒷🍙 . 𖦹˙— 🐈‍⬛
╭・┈・┈・౨ৎ・┈・┈・
┊🧺   .group abrir / cerrar
┊🧺   .delete
┊🧺   .setppgroup
┊🧺   .rentar2
┊🧺   .setwelcome
┊🧺   .demote
┊🧺   .encuesta <text|text2>
┊🧺   .hidetag
┊🧺   .infogrupo
┊🧺   .invite *<numero>*
┊🧺   .kick
┊🧺   .link
┊🧺   .promote
┊🧺   .rentar
┊🧺   .tagall *<mesaje>*
┊🧺   .invocar *<mesaje>*
╰・┈・┈・౨ৎ・┈・┈・
.    ╭─ׅ─ׅ┈ ─๋︩︪─≽^• ˕ • ྀི≼─ׅ─ׅ┈ ─๋︩︪─╮
╭ ‧˚꒰🪭꒱༘‧ 𝓞𝓷/𝓸𝓯𝓯 
              ˙ . ꒷🍙 . 𖦹˙— 🐈‍⬛
╭・┈・┈・౨ৎ・┈・┈・
┊🧺   .enable <option>
┊🧺   .disable <option>
╰・┈・┈・౨ৎ・┈・┈・
.    ╭─ׅ─ׅ┈ ─๋︩︪─≽^• ˕ • ྀི≼─ׅ─ׅ┈ ─๋︩︪─╮
╭ ‧˚꒰🪭꒱༘‧   𝓓𝓮𝓼𝓬𝓪𝓻𝓰𝓪𝓼
              ˙ . ꒷🍙 . 𖦹˙— 🐈‍⬛
╭・┈・┈・౨ৎ・┈・┈・
┊🧺   .facebook
┊🧺   .fb
┊🧺   .play
┊🧺  .playvid
┊🧺   .gitclone *<url git>*
┊🧺   .instagram
┊🧺   .ig
┊🧺   .imagen <query>
┊🧺   .mediafire <url>
┊🧺   .apkmod
┊🧺   .ytmp3doc
┊🧺   .ytmp4doc
┊🧺   .spotify
┊🧺   .tiktok
┊🧺   .tw
┊🧺   .ytmp4 *<url youtube>*
┊🧺   .xdl
╰・┈・┈・౨ৎ・┈・┈・
.    ╭─ׅ─ׅ┈ ─๋︩︪─≽^• ˕ • ྀི≼─ׅ─ׅ┈ ─๋︩︪─╮
╭ ‧˚꒰🪭꒱༘‧   𝓣𝓸𝓸𝓵𝓼
              ˙ . ꒷🍙 . 𖦹˙— 🐈‍⬛
╭・┈・┈・౨ৎ・┈・┈・
┊🧺   .toanime
┊🧺  .tts <lang> <teks>
┊🧺   .imagen <query>
┊🧺   .remini
┊🧺   .hd
┊🧺   .enhance
┊🧺   .nuevafotochannel
┊🧺   .nosilenciarcanal
┊🧺   .silenciarcanal
┊🧺   .noseguircanal
┊🧺   .seguircanal
┊🧺   .avisoschannel
┊🧺   .resiviravisos
┊🧺   .inspect
┊🧺   .inspeccionar
┊🧺   .eliminarfotochannel
┊🧺   .reactioneschannel
┊🧺   .reaccioneschannel
┊🧺   .nuevonombrecanal
┊🧺   .nuevadescchannel
┊🧺   .readvo
╰・┈・┈・౨ৎ・┈・┈・
.    ╭─ׅ─ׅ┈ ─๋︩︪─≽^• ˕ • ྀི≼─ׅ─ׅ┈ ─๋︩︪─╮
╭ ‧˚꒰🪭꒱༘‧   𝓒𝓻𝓮𝓪𝓭𝓸𝓻
              ˙ . ꒷🍙 . 𖦹˙— 🐈‍⬛
╭・┈・┈・౨ৎ・┈・┈・
┊🧺   .enable <option>
┊🧺   .disable <option>
┊🧺   .addprem [@user] <days>
┊🧺  .copia
┊🧺  .broadcastgroup <teks>
┊🧺   .bcgc <teks>
┊🧺   .bcgc2
┊🧺  .broadcast <teks>
┊🧺   .bc <teks>
┊🧺   .cheat
┊🧺   .cleartmp
┊🧺   .delprem <@user>
┊🧺  .dsowner
┊🧺   $
┊🧺   .fetch
┊🧺   .get
┊🧺   .getplugin *<nombre>*
┊🧺   .nuevabiobot <teks>
┊🧺   .nuevafotobot *<imagen>*
┊🧺   .nuevonombrebot <teks>
┊🧺   .prefix [prefix]
┊🧺   .resetprefix
┊🧺   .restart
┊🧺   .saveplugin nombre
┊🧺   .update
┊🧺   .actualizar
┊🧺   .resetpersonajes
╰・┈・┈・౨ৎ・┈・┈・
.    ╭─ׅ─ׅ┈ ─๋︩︪─≽^• ˕ • ྀི≼─ׅ─ׅ┈ ─๋︩︪─╮
╭ ‧˚꒰🪭꒱༘‧   𝓞𝔀𝓷𝓮𝓻
              ˙ . ꒷🍙 . 𖦹˙— 🐈‍⬛
╭・┈・┈・౨ৎ・┈・┈・
┊🧺   .autoadmin
┊🧺   .banchat
┊🧺   .banuser <@tag> <razón>
┊🧺   .grupocrear <nombre>
┊🧺   .ip <alamat ip>
┊🧺   .join <link>
┊🧺   .unbanchat
┊🧺   .unbanuser <@tag>
╰・┈・┈・౨ৎ・┈・┈・

.    ╭─ׅ─ׅ┈ ─๋︩︪─≽^• ˕ • ྀི≼─ׅ─ׅ┈ ─๋︩︪─╮
╭ ‧˚꒰🪭꒱༘‧   𝓘𝓷𝓽𝓮𝓵𝓲𝓰𝓮𝓷𝓬𝓲𝓪 𝓪𝓻𝓽𝓲𝓯𝓲𝓬𝓲𝓪𝓵
              ˙ . ꒷🍙 . 𖦹˙— 🐈‍⬛
╭・┈・┈・౨ৎ・┈・┈・
┊🧺  .bard
┊🧺  .chatgpt <texto>
┊🧺  .ia <texto>
┊🧺  .dalle
┊🧺  .remini
╰・┈・┈・౨ৎ・┈・┈・
.    ╭─ׅ─ׅ┈ ─๋︩︪─≽^• ˕ • ྀི≼─ׅ─ׅ┈ ─๋︩︪─╮
╭ ‧˚꒰🪭꒱༘‧   𝓬𝓸𝓷𝓿𝓮𝓻𝓽𝓮𝓻𝓼 
              ˙ . ꒷🍙 . 𖦹˙— 🐈‍⬛
╭・┈・┈・౨ৎ・┈・┈・
┊🧺   .togifaud
┊🧺   .tourl
┊🧺   .tovideo
┊🧺   .tomp3
┊🧺   .tts
╰・┈・┈・౨ৎ・┈・┈・

> ${dev}`.trim()

await conn.sendMessage(m.chat, { video: { url: vid.getRandom() }, caption: menu, contextInfo: { mentionedJid: [m.sender], isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: channelRD.id, newsletterName: channelRD.name, serverMessageId: -1, }, forwardingScore: 999, externalAdReply: { title: 'Aneka x Daniel', body: dev, thumbnailUrl: perfil, sourceUrl: redes, mediaType: 1, renderLargerThumbnail: false,
}, }, gifPlayback: true, gifAttribution: 0 }, { quoted: null })
await m.react(emojis)    

} catch (e) {
await m.reply(`✘ Ocurrió un error al enviar el menú\n\n${e}`)
await m.react(error)
}}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menú', 'allmenú', 'allmenu', 'menucompleto'] 
handler.register = true
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}
