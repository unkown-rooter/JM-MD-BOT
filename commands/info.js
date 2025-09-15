// info.js
module.exports = {
    name: 'info',
    description: 'Shows information about the bot and owner',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        const infoMessage = `ℹ️ *JM-MD BOT Info* ℹ️

🤖 Bot Name: JM-MD BOT
👑 Owner: JapaneseMonk
📞 Contact: wa.me/254743445041
📅 Created: 2025
🌍 Powered by: Node.js + Baileys

✨ Type .menu to explore commands!`;

        await sock.sendMessage(from, { text: infoMessage });
    }
};
