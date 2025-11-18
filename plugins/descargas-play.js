import fetch from "node-fetch";
import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender];

  if (user.chocolates < 2) {
    return conn.reply(m.chat, `🎵 *Faltan Chocolates* 🍫\nNecesitas 2 chocolates más para usar este comando.`, m);
  }

  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `🎵 *Búsqueda de Música*\nPor favor, ingresa el nombre de la canción que deseas buscar.`, m);
    }

    // Mostrar mensaje de búsqueda
    await conn.sendMessage(m.chat, { 
      text: `🔍 *Buscando...*\n\"${text}\"` 
    }, { quoted: m });

    const search = await yts(text);
    if (!search.all || search.all.length === 0) {
      return m.reply('❌ *No se encontraron resultados*\nPrueba con otro nombre de canción.');
    }

    const videoInfo = search.all[0];
    if (!videoInfo) {
      return m.reply('❌ *Error al obtener información del video.*');
    }

    const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;

    if (!title || !thumbnail || !timestamp || !views || !ago || !url || !author) {
      return m.reply('❌ *Información del video incompleta.*');
    }

    const vistas = formatViews(views);
    const canal = author.name ? author.name : 'Desconocido';

    // Diseño mejorado de la información
    const infoMessage = `
🎧 *INFORMACIÓN DEL AUDIO*

📌 *Título:* ${title}
⏱️ *Duración:* ${timestamp}
👁️ *Vistas:* ${vistas}
📺 *Canal:* ${canal}
📅 *Publicado:* ${ago}

⬇️ *Descargando audio...*`;

    const thumb = (await conn.getFile(thumbnail))?.data;

    // Enviar información con miniaturas
    await conn.sendMessage(m.chat, {
      image: thumb,
      caption: infoMessage
    }, { quoted: m });

    // Procesar comando de audio
    if (command === 'play' || command === 'mp3' || command === 'playaudio') {
      try {
        // Intentar con primera API
        const apiAudioUrl = `https://api.stellarwa.xyz/dow/ytmp3?url=${url}&apikey=Diamond`;
        const response = await fetch(apiAudioUrl);
        
        if (response.ok) {
          const json = await response.json();
          const { title, dl } = json.data;

          if (dl) {
            await conn.sendMessage(m.chat, { 
              audio: { url: dl }, 
              fileName: `${title}.mp3`, 
              mimetype: 'audio/mpeg',
              contextInfo: {
                externalAdReply: {
                  title: `🎵 ${title}`,
                  body: `Duración: ${timestamp}`,
                  mediaType: 1,
                  sourceUrl: url,
                  thumbnail: thumb
                }
              }
            }, { quoted: m });
            
            // Restar chocolates después del éxito
            user.chocolates -= 2;
            await conn.sendMessage(m.chat, { 
              text: `🍫 *Chocolates usados:* 2\n💎 *Chocolates restantes:* ${user.chocolates}` 
            });
            
            return;
          }
        }
      } catch (e) {
        console.log('Primera API falló:', e.message);
      }

      try {
        // Intentar con segunda API
        const response2 = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`);
        if (response2.ok) {
          const json = await response2.json();
          const resultad = json.result;
          
          if (resultad && resultad.download && resultad.download.url) {
            await conn.sendMessage(m.chat, { 
              audio: { url: resultad.download.url }, 
              fileName: `${resultad.title}.mp3`, 
              mimetype: 'audio/mpeg' 
            }, { quoted: m });
            
            user.chocolates -= 2;
            await conn.sendMessage(m.chat, { 
              text: `🍫 *Chocolates usados:* 2\n💎 *Chocolates restantes:* ${user.chocolates}` 
            });
            
            return;
          }
        }
      } catch (e) {
        console.log('Segunda API falló:', e.message);
      }

      try {
        // Último intento con tercera API
        const response3 = await fetch(`https://api.dhamzxploit.my.id/api/ytmp3?url=${url}`);
        if (response3.ok) {
          const json = await response3.json();
          
          if (json.result && json.result.url) {
            await conn.sendMessage(m.chat, { 
              audio: { url: json.result.url }, 
              fileName: `${title}.mp3`, 
              mimetype: 'audio/mpeg' 
            }, { quoted: m });
            
            user.chocolates -= 2;
            await conn.sendMessage(m.chat, { 
              text: `🍫 *Chocolates usados:* 2\n💎 *Chocolates restantes:* ${user.chocolates}` 
            });
            
            return;
          }
        }
      } catch (e) {
        console.log('Tercera API falló:', e.message);
      }

      // Si todas las APIs fallan
      await conn.sendMessage(m.chat, { 
        text: `❌ *Error al descargar*\nNo se pudo obtener el audio en este momento.\n\n🔧 *Posibles soluciones:*\n• Intenta más tarde\n• Verifica tu conexión\n• Prueba con otra canción` 
      }, { quoted: m });

    } else if (command === 'play2' || command === 'mp4' || command === 'playvideo') {
      // Lógica similar para video...
      await conn.sendMessage(m.chat, { 
        text: `🎬 *Función de video*\nEsta función está en desarrollo.` 
      }, { quoted: m });
    }

  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { 
      text: `💥 *Error crítico*\nOcurrió un error inesperado:\n${error.message}\n\nPor favor, reporta este error.` 
    }, { quoted: m });
  }
};

handler.command = handler.help = ['play', 'mp3', 'playaudio', 'play2', 'mp4', 'playvideo'];
handler.tags = ['downloader'];

export default handler;

function formatViews(views) {
  if (views === undefined) {
    return "No disponible";
  }

  if (views >= 1_000_000_000) {
    return `${(views / 1_000_000_000).toFixed(1)}B`;
  } else if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1)}M`;
  } else if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1)}K`;
  }
  return views.toString();
}
