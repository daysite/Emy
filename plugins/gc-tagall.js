const handler = async (m, {isOwner, isAdmin, conn, text, participants, args, command, usedPrefix}) => {

  if (usedPrefix == 'a' || usedPrefix == 'A') return;

  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }
  const pesan = args.join` `;
const oi = `*\`˚. 𝕬𝖛𝖎𝖘𝖔 𝕭𝖎𝖙𝖈𝖍 .ᐟ:\`* ${pesan}`;
  let teks = `𝓑𝓸𝓶 𝓭𝓲𝓪, 𝓮𝓼𝓽𝓻𝓮𝓵𝓲𝓷𝓱𝓪𝓼! 𝓐 𝓣𝓮𝓻𝓻𝓪 𝓶𝓪𝓷𝓭𝓪 𝓾𝓶 𝓸𝓲 ✨\n\n> \`𝖨𝗇𝗍𝖾𝗀𝗋𝖺𝗇𝗍𝖾𝗌:\` *${participants.length}*\n\n ${oi}\n\n`;
  for (const mem of participants) {
    teks += `ּ ֶָ֢ ! 🧺 @${mem.id.split('@')[0]}\n`;
  }
  teks += `\n> ${club}`;
  conn.sendMessage(m.chat, {text: teks, mentions: participants.map((a) => a.id)} );
};
handler.help = ['todos'];
handler.tags = ['gc'];
handler.command = /^(tagall|t|invocar|marcar|todos|invocación)$/i;
handler.admin = true;
handler.group = true;

export default handler;
