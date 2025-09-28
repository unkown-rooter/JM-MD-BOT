// commands/owner.js
const config = require("../config");

module.exports = {
    name: "owner",
    description: "Show owner information",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        // ✅ Use values from config.js or fallback defaults
        const ownerName = config.OWNER_NAME || "JapaneseMonk";
        const ownerNumber = config.OWNER_NUMBER || "+254743445041";
        const botName = config.BOT_NAME || "JM-MD BOT";

        const ownerMessage = `
👑 *${botName} - Owner Information*

📛 *Name:* ${ownerName}
📱 *WhatsApp:* 🌐 [Chat Here](https://wa.me/${ownerNumber.replace(/[^0-9]/g, "")})
🤖 *Bot Name:* ✨ ${botName}

🙏 *Special Note:* ⏳ Respect the owner’s time
🚀 *JM-MD BOT Motto:* Shining bright and helping users grow! ✨
`;

        await sock.sendMessage(from, { text: ownerMessage });
    }
};
