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
    
    // Intentar con múltiples APIs
    const apis = [
      `https://api.zenzxz.my.id/api/maker/bratvid?text=${encodedText}`,
      `https://api.lolhuman.xyz/api/ephoto2/brattext?apikey=yourkey&text=${encodedText}`,
      `https://violetics.pw/api/maker/brat-text?apikey=beta&text=${encodedText}`
    ]

    let videoBuffer
    let success = false

    for (let apiUrl of apis) {
      try {
        console.log('Probando API:', apiUrl)
        const response = await fetch(apiUrl)
        
        if (response.ok) {
          videoBuffer = await response.buffer()
          const fileInfo = await fileTypeFromBuffer(videoBuffer)
          
          if (fileInfo && fileInfo.mime.startsWith('video/')) {
            console.log('API exitosa:', apiUrl)
            success = true
            break
          }
        }
      } catch (apiError) {
        console.log('API falló:', apiUrl, apiError.message)
        continue
      }
    }

    if (!success) {
      throw new Error('Todas las APIs fallaron. Intenta más tarde.')
    }

    await conn.sendVideoAsSticker(m.chat, videoBuffer, m, { 
      packname: 'Neveloopp Pack', 
      author: 'Neveloopp' 
    })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (error) {
    console.error('Error en brat:', error)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    
    const errorMessage = `${getBotEmoji(global.mePn)} Error al generar el video sticker.\n\n${error.message}`
    await m.reply(errorMessage)
  }
}

// Función para obtener emoji del bot
function getBotEmoji(mePn) {
  return '🤖'
}

handler.help = ['brat <texto>']
handler.tags = ['sticker', 'fun']
handler.command = /^(brat)$/i

export default handler
