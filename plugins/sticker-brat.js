import fetch from 'node-fetch'
import { fileTypeFromBuffer } from 'file-type'

let handler = async (m, { conn, usedPrefix, command, text, args }) => {
  if (!text) {
    await conn.sendMessage(m.chat, { react: { text: '❗', key: m.key } })
    return m.reply(`${getBotEmoji(global.mePn)} Ingresa un texto para el video.\n\nEjemplo: *${usedPrefix + command} Hola mundo*`)
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '🔄', key: m.key } })

    const encodedText = encodeURIComponent(text)
    const apiUrl = `https://api.zenzxz.my.id/api/maker/bratvid?text=${encodedText}`
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status} ${response.statusText}`)
    }

    const videoBuffer = await response.buffer()
    
    // Verificar que sea un video válido
    const fileInfo = await fileTypeFromBuffer(videoBuffer)
    if (!fileInfo || !fileInfo.mime.startsWith('video/')) {
      throw new Error('La API no devolvió un video válido')
    }

    await conn.sendVideoAsSticker(m.chat, videoBuffer, m, { 
      packname: 'Neveloopp Pack', 
      author: 'Neveloopp' 
    })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (error) {
    console.error('Error en brat:', error)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    
    const errorMessage = `${getBotEmoji(global.mePn)} Error al generar el video sticker:\n\n\`\`\`${error.stack || error.message}\`\`\``
    await m.reply(errorMessage)
  }
}

// Función para obtener emoji del bot (debes definirla según tu configuración)
function getBotEmoji(mePn) {
  // Define tu lógica para obtener emojis
  return '🤖'
}

handler.help = ['brat <texto>']
handler.tags = ['sticker', 'fun']
handler.command = /^(brat)$/i

export default handler
