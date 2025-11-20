import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix, command }) => {
  const quoted = m.quoted ? m.quoted : m
  const mime = quoted.mimetype || quoted.msg?.mimetype || ''

  if (!/image\/(jpe?g|png)/i.test(mime)) {
    await conn.sendMessage(m.chat, { react: { text: '❗', key: m.key } })
    return m.reply(`${getBotEmoji(global.mePn)} Envía una imagen o responde a una imagen para convertir a estilo Pixar.`)
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    let imageBuffer
    if (m.quoted && m.quoted.message && m.quoted.message.imageMessage) {
      imageBuffer = await getBufferFromMsg(m.quoted)
    } else if (m.message && m.message.imageMessage) {
      imageBuffer = await getBufferFromMsg(m)
    } else {
      imageBuffer = await quoted.download()
    }

    const form = new FormData()
    form.append('file', imageBuffer, {
      filename: 'image.jpg',
      contentType: 'image/jpeg'
    })
    form.append('expiry', '120')

    const uploadResponse = await fetch('https://cdn.russellxz.click/upload.php', {
      method: 'POST',
      body: form
    })

    const uploadData = await uploadResponse.json()

    if (!uploadData.url) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      return m.reply(`${getBotEmoji(global.mePn)} Error al subir la imagen al CDN.`)
    }

    const imageUrl = uploadData.url
    const apiUrl = `https://api.nekolabs.web.id/tools/convert/topixar?imageUrl=${encodeURIComponent(imageUrl)}`
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (!data.success || !data.result) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      return m.reply(`${getBotEmoji(global.mePn)} Error al convertir la imagen a estilo Pixar.`)
    }

    const convertedImageUrl = data.result
    const imageResponse = await fetch(convertedImageUrl)
    const convertedBuffer = await imageResponse.buffer()

    const originType = m.quoted ? 'imagen respondida' : 'imagen enviada'

    const caption = `⧉  *P I X A R - C O N V E R T E R*

◦  *Filtro* : Estudio Pixar
◦  *Origen* : ${originType}
◦  *Estado* : Conversión completada

> Desarrollado por ${getBotName(global.mePn)} - En constante evolución`

    await conn.sendMessage(m.chat, { 
      image: convertedBuffer, 
      caption: caption
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (error) {
    console.error(error)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply(`${getBotEmoji(global.mePn)} Error al procesar la imagen.`)
  }
}

// Función auxiliar para obtener buffer del mensaje (si no existe en tu proyecto)
async function getBufferFromMsg(message) {
  const media = await message.download()
  return media
}

// Función para obtener emoji del bot (debes definirla según tu configuración)
function getBotEmoji(mePn) {
  // Define tu lógica para obtener emojis
  return '🤖'
}

// Función para obtener nombre del bot (debes definirla según tu configuración)
function getBotName(mePn) {
  // Define tu lógica para obtener el nombre del bot
  return 'TuBot'
}

handler.help = ['pixar']
handler.tags = ['tools', 'image']
handler.command = /^(topixar|pixar)$/i

export default handler
