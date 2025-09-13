const config = require("../config");

module.exports = {
    name: "owner",
    description: "Show owner information and upcoming features",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        const ownerMessage = `
👑 *JM-MD BOT Owner Information*

📛 *Name:* ${config.ownerName}
📱 *WhatsApp:* wa.me/${config.ownerNumber.replace(/[^0-9]/g, "")}
🤖 *Bot Name:* ${config.botName}

🌟 *Special Notes:*
- Respect the owner’s time 🙏
- Contact only for serious inquiries
- Support the growth of JM-MD BOT 🚀

🚀 *Coming Soon*:
- Personalized commands
- Interactive features
- Fun quizzes, jokes & riddles

_Type *.menu* to see all available commands_
`;

        await sock.sendMessage(from, { text: ownerMessage });
    }
};
