import fetch from "node-fetch";
import yts from 'yt-search';

// Sistema de cache
const videoCache = {};
const cacheTimeout = 10 * 60 * 1000;

// NUEVAS APIs MÁS CONFIABLES
const fetchAPI = async (url, type) => {
  const apis = [
    // API 1 - Más estable para 2024
    {
      audio: `https://api.yt-downloader.com/audio?url=${url}`,
      video: `https://api.yt-downloader.com/video?url=${url}`
    },
    // API 2 - Alternativa confiable
    {
      audio: `https://youtube-audio-downloader.p.rapidapi.com/url?url=${url}`,
      video: `https://youtube-video-downloader.p.rapidapi.com/url?url=${url}`
    },
    // API 3 - Respaldo simple
    {
      audio: `https://co.wuk.sh/api/json?url=${url}&format=mp3`,
      video: `https://co.wuk.sh/api/json?url=${url}&format=mp4`
    }
  ];

  for (let api of apis) {
    try {
      console.log(`Probando API: ${api[type]}`);
      const response = await fetch(api[type], {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Diferentes formatos de respuesta
        if (data.url) return { download: data.url, title: data.title };
        if (data.downloadUrl) return { download: data.downloadUrl, title: data.title };
        if (data.download) return { download: data.download, title: data.title };
        if (data.link) return { download: data.link, title: data.title };
      }
    } catch (error) {
      console.log(`API falló: ${error.message}`);
      continue;
    }
  }
  
  throw new Error("Todas las APIs están fallando. Intenta más tarde.");
};

// Acortador de URLs mejorado
const shortenURL = async (url) => {
  try {
    const services = [
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`,
      `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`
    ];
    
    for (let service of services) {
      try {
        let response = await fetch(service);
        let shortUrl = await response.text();
        if (shortUrl.includes("http")) return shortUrl;
      } catch (e) {
        continue;
      }
    }
    return url;
  } catch {
    return url;
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender];

  if (user.chocolates < 2) {
    return conn.reply(m.chat, 
      `🎵 *Faltan Chocolates* 🍫\nNecesitas 2 chocolates más.\n💎 *Tus chocolates:* ${user.chocolates}`, 
      m
    );
  }

  try {
    if (!text.trim()) {
      return conn.reply(m.chat, 
        `🎵 *Búsqueda de Música*\nEjemplo: ${usedPrefix}play bad bunny`, 
        m
      );
    }

    await conn.sendMessage(m.chat, { 
      text: `🔍 *Buscando...*\n\"${text}\"` 
    }, { quoted: m });

    const search = await yts(text);
    if (!search.all?.length) {
      return m.reply('❌ *No se encontraron resultados*');
    }

    // Tomar el primer resultado
    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;

    const infoMessage = `
🎧 *INFORMACIÓN ENCONTRADA*

📌 *Título:* ${title}
⏱️ *Duración:* ${timestamp}
👁️ *Vistas:* ${formatViews(views)}
📺 *Canal:* ${author?.name || 'Desconocido'}
📅 *Publicado:* ${ago}

💡 *Responde con:*
• "audio" 🎵 para descargar audio
• "video" 🎬 para descargar video

🍫 *Costo:* 2 chocolates`;

    const thumb = (await conn.getFile(thumbnail))?.data;
    
    // Guardar en cache
    videoCache[m.sender] = { url, title, timestamp: Date.now() };

    await conn.sendMessage(m.chat, {
      image: thumb,
      caption: infoMessage
    }, { quoted: m });

  } catch (error) {
    await conn.sendMessage(m.chat, { 
      text: `💥 *Error en búsqueda*\n${error.message}` 
    }, { quoted: m });
  }
};

// Handler para respuestas
handler.before = async (m, { conn }) => {
  if (!m.quoted || !m.quoted.text?.includes("INFORMACIÓN ENCONTRADA")) return;

  const userInput = m.text.toLowerCase().trim();
  let user = global.db.data.users[m.sender];

  if (user.chocolates < 2) {
    return conn.reply(m.chat, 
      `❌ *Chocolates insuficientes*\n💎 *Tus chocolates:* ${user.chocolates}`, 
      m
    );
  }

  if (!videoCache[m.sender] || Date.now() - videoCache[m.sender].timestamp > cacheTimeout) {
    delete videoCache[m.sender];
    return conn.reply(m.chat, "❌ *Sesión expirada*", m);
  }

  const { url, title } = videoCache[m.sender];

  try {
    let mediaType, responseMessage, fileName;

    if (userInput === 'audio') {
      mediaType = 'audio';
      responseMessage = '🎶 *Descargando audio...*';
      fileName = `${title}.mp3`;
    } else if (userInput === 'video') {
      mediaType = 'video';
      responseMessage = '🎬 *Descargando video...*';
      fileName = `${title}.mp4`;
    } else {
      return conn.reply(m.chat, 
        '❌ *Opción no válida*\nSolo responde con: "audio" o "video"', 
        m
      );
    }

    await conn.reply(m.chat, responseMessage, m);

    // Usar nueva función de API
    let apiData = await fetchAPI(url, mediaType);

    if (!apiData?.download) {
      throw new Error("No se pudo generar el enlace de descarga");
    }

    let downloadUrl = await shortenURL(apiData.download);

    // Enviar archivo
    if (mediaType === 'audio') {
      await conn.sendMessage(m.chat, { 
        audio: { url: downloadUrl }, 
        fileName: fileName,
        mimetype: 'audio/mpeg'
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, { 
        video: { url: downloadUrl }, 
        caption: `🎬 ${title}`
      }, { quoted: m });
    }

    // Restar chocolates y confirmar
    user.chocolates -= 2;
    await conn.sendMessage(m.chat, { 
      text: `✅ *Descarga exitosa!*\n🍫 *Chocolates usados:* 2\n💎 *Restantes:* ${user.chocolates}` 
    });

    delete videoCache[m.sender];

  } catch (error) {
    console.error('Error en descarga:', error);
    await conn.reply(m.chat, 
      `❌ *Error en descarga*\n${error.message}\n\n💡 *Solución:* Intenta con otra canción o más tarde.`, 
      m
    );
  }
};

handler.command = handler.help = ['play', 'mp3', 'playaudio', 'play2', 'mp4', 'playvideo'];
handler.tags = ['downloader'];

export default handler;

function formatViews(views) {
  if (!views) return "No disponible";
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B`;
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M`;
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K`;
  return views.toString();
}
