const config = require("../config");

module.exports = {
    name: "owner",
    description: "Show owner information and upcoming features",
    execute: async (msg, sock, args) => {
        const from = msg.key.remoteJid;

        const message = `👑 *Owner Information*

📛 Name: ${config.ownerName}
📱 Number: ${config.ownerNumber}
🤖 Bot: ${config.botName}

💡 *Coming Soon*:
- Personalized commands
- Interactive features
- Fun quizzes, jokes & riddles

_Type .menu to see all commands_`;

        await sock.sendMessage(from, { text: message });
    }
};
