// commands/owner.js
const config = require("../config");

module.exports = {
    name: "owner",
    description: "Show owner information and upcoming features",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        // ✅ Use values from config.js or fallback defaults
        const ownerName = config.OWNER_NAME || "JapaneseMonk";
        const ownerNumber = config.OWNER_NUMBER || "+254743445041";
        const botName = config.BOT_NAME || "JM-MD BOT";

        const ownerMessage = `
👑 *${botName} - Owner Information*

📛 *Name:* ${ownerName}
📱 *WhatsApp:* wa.me/${ownerNumber.replace(/[^0-9]/g, "")}
🤖 *Bot Name:* ${botName}

🌟 *Special Notes:*
- Respect the owner’s time 🙏
- Contact only for serious inquiries
- Support the growth of ${botName} 🚀

🚀 *Coming Soon*:
- Personalized commands
- Interactive features
- Fun quizzes, jokes & riddles

_Type *.menu* to see all available commands_
`;

        await sock.sendMessage(from, { text: ownerMessage });
    }
};
