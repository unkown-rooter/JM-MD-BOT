// commands/owner.js
const config = require("../config");

module.exports = {
    name: "owner",
    description: "Show bot owner information",
    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;

            // ✅ Owner details (with safe fallback)
            const ownerName = config.OWNER_NAME || "JapaneseMonk";
            const ownerNumber = (config.OWNER_NUMBER || "254743445041").replace(/[^0-9]/g, "");
            const botName = config.BOT_NAME || "JM-MD BOT";

            // ✅ Message template
            const ownerMessage = `
┏━━━━━━━━━━━━━━━━━━━┓
      🤖 *${botName} - Owner Info* 👑
┗━━━━━━━━━━━━━━━━━━━┛

📛 *Name:* ${ownerName}
📱 *WhatsApp:* [Chat Here](https://wa.me/${ownerNumber})
🤖 *Bot:* ${botName}

🚀 *Motto:* Shining bright and helping users grow! ✨
🙏 *Note:* Respect the owner’s time, no spam!
`;

            await sock.sendMessage(from, { text: ownerMessage });
        } catch (err) {
            console.error("❌ Error in owner.js:", err);
            await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Failed to fetch owner info." });
        }
    }
};
