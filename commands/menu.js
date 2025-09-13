module.exports = {
    name: "menu",
    description: "Show all available commands and upcoming features",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        const menuMessage = `
📖 *JM-MD BOT Menu*

✨ General Commands:
• .about – About the bot
• .menu – Show this menu
• .owner – Show owner info
• .download – Download a file from bot storage

🕒 Utility Commands:
• .time – Show the current time
• .date – Show today's date

😂 Fun Commands:
• .joke – Get a random joke
• .fact – Get a random fun fact
• .quote – Get a friendly quote
• .riddle – Get a fun riddle

🤖 Auto-Reply:
• .autoreply on – Enable auto-reply
• .autoreply off – Disable auto-reply

🚀 *Coming Soon*:
- Interactive quizzes & games
- Personalized commands
- Daily motivational quotes

_Type a command starting with "." to use it_
`;

        await sock.sendMessage(from, { text: menuMessage });
    }
};
