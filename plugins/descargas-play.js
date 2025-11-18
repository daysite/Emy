import fetch from "node-fetch";
import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender];

  if (user.chocolates < 2) {
    return conn.reply(m.chat, `🎵 *Faltan Chocolates* 🍫\nNecesitas 2 chocolates más para usar este comando.`, m);
  }

  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `🎵 *Búsqueda de Música*\nPor favor, ingresa el nombre de la canción.`, m);
    }

    await conn.sendMessage(m.chat, { 
      text: `🔍 *Buscando...*\n\"${text}\"` 
    }, { quoted: m });

    const search = await yts(text);
    if (!search.all || search.all.length === 0) {
      return m.reply('❌ *No se encontraron resultados*');
    }

    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;

    const vistas = formatViews(views);
    const canal = author.name || 'Desconocido';

    // Información del audio
    const infoMessage = `
🎧 *INFORMACIÓN DEL AUDIO*

📌 *Título:* ${title}
⏱️ *Duración:* ${timestamp}
👁️ *Vistas:* ${vistas}
📺 *Canal:* ${canal}
📅 *Publicado:* ${ago}

⬇️ *Descargando audio...*`;

    const thumb = (await conn.getFile(thumbnail))?.data;
    
    await conn.sendMessage(m.chat, {
      image: thumb,
      caption: infoMessage
    }, { quoted: m });

    // 🔄 NUEVAS APIs MÁS CONFIABLES
    const apis = [
      // API 1 - Más estable
      `https://api.akuari.my.id/downloader/youtube2?link=${url}`,
      
      // API 2 - Alternativa confiable
      `https://api.lolhuman.xyz/api/ytplay2?apikey=your_key&query=${encodeURIComponent(title)}`,
      
      // API 3 - Respaldo
      `https://api.download-lagu-mp3.com/@api/button/mp3/${url.split('v=')[1]}`,
      
      // API 4 - Último recurso
      `https://ytmp3.cx/api/convert?url=${url}`
    ];

    let audioUrl = null;
    let audioTitle = title;

    // Probar cada API hasta que una funcione
    for (let api of apis) {
      try {
        console.log(`Probando API: ${api}`);
        const response = await fetch(api, { timeout: 10000 });
        
        if (response.ok) {
          const data = await response.json();
          
          // Diferentes estructuras de respuesta
          if (data.result && data.result.audio) {
            audioUrl = data.result.audio;
            break;
          } else if (data.url) {
            audioUrl = data.url;
            break;
          } else if (data.link) {
            audioUrl = data.link;
            break;
          } else if (data.data && data.data.audio) {
            audioUrl = data.data.audio;
            break;
          }
        }
      } catch (e) {
        console.log(`API falló: ${e.message}`);
        continue;
      }
    }

    if (audioUrl) {
      // ✅ Éxito - Enviar audio
      await conn.sendMessage(m.chat, { 
        audio: { url: audioUrl }, 
        fileName: `${audioTitle}.mp3`, 
        mimetype: 'audio/mpeg' 
      }, { quoted: m });

      user.chocolates -= 2;
      await conn.sendMessage(m.chat, { 
        text: `✅ *Descarga exitosa!*\n🍫 *Chocolates usados:* 2\n💎 *Restantes:* ${user.chocolates}` 
      });

    } else {
      // ❌ Todas las APIs fallaron
      await conn.sendMessage(m.chat, { 
        text: `❌ *Error crítico de descarga*\n\n📡 *Estado:* Todas las APIs están offline\n🕒 *Solución:* Intenta en 1-2 horas\n\n💡 *Alternativa:* Usa YouTube directamente` 
      });
    }

  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { 
      text: `💥 *Error del sistema*\n${error.message}` 
    }, { quoted: m });
  }
};

handler.command = handler.help = ['play', 'mp3', 'playaudio'];
handler.tags = ['downloader'];

export default handler;

function formatViews(views) {
  if (!views) return "No disponible";
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B`;
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M`;
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K`;
  return views.toString();
}
