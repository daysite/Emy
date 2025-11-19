const handler = async (m, {isOwner, isAdmin, conn, text, participants, args, command, usedPrefix}) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    return;
  }
  const pesan = args.join` `;
  const colombia = `🧺 *𝓜𝓮𝓷𝓼𝓪𝓳𝓲𝓽𝓸:* ${pesan}`;
  let teks = `🧺 *𝓑𝓸𝓶 𝓭𝓲𝓪, 𝓮𝓼𝓽𝓻𝓮𝓵𝓲𝓷𝓱𝓪𝓼! 𝓐 𝓣𝓮𝓻𝓻𝓪 𝓶𝓪𝓷𝓭𝓪 𝓾𝓶 𝓸𝓲 ✨*\n${colombia}\n\n☁️ *Tags:*\n`;
  for (const mem of participants) {
    teks +=ּ ֶָ֢ ! 🧺 `@${mem.id.split('@')[0]}\n`;
  }
  conn.sendMessage(m.chat, {text: teks, mentions: participants.map((a) => a.id)} );
};
handler.help = ['tagall *<mesaje>*', 'invocar *<mesaje>*'];
handler.tags = ['grupo'];
handler.command = ['tagall', 'invocar'];
handler.admin = true;
handler.group = true;
export default handler;
