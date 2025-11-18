let handler = async (m, { conn, command, usedPrefix }) => {
let creadorID = '5351524614@s.whatsapp.net'
let isInGroup = m.isGroup && (await conn.groupMetadata(m.chat)).participants.some(p => p.id === creadorID)

let numeroTexto = isInGroup ? `@${creadorID.split('@')[0]}` : `5493884539290`

let creador = `🌹 *C R E A D O R - 💎 - B O T*

🌱 *NOMBRE:* Daniel.qsy
🍟 *NUMERO:* ${numeroTexto}
🪴 *LINK:* wa.me/+5493884539290`

await conn.sendMessage(m.chat, {
  text: creador.trim(),
  contextInfo: {
    forwardingScore: 200,
    isForwarded: false,
    mentionedJid: isInGroup ? [creadorID] : [],
    externalAdReply: {
      showAdAttribution: true,
      renderLargerThumbnail: true,
      title: `🥷 Developer 👑`,
      body: packname,
      mediaType: 1,
      sourceUrl: redes,
      thumbnailUrl: imagen1
    }
  }
}, {
  quoted: fkontak
})

}
handler.help = ['creador']
handler.command = ['creador', 'creator', 'owner', 'propietario', 'dueño']
handler.register = true
handler.tags = ['main']

export default handler
