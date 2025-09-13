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
• .info – Show bot status, fun features & uptime 💖
• .ping – Check if the bot is online 🏓
• .download <filename> – Download a file from bot storage 📂 (e.g. .download sample.pdf)

🕒 Utility Commands:
• .time – Show the current time ⏰
• .date – Show today’s full date 📅 (weekday, day, month, year)

😂 Fun Commands:
• .joke – Get a random joke 🎉 (new fun jokes & emojis added!)
• .fact – Get a surprising fun fact 🤯 (science, history, nature & more)
• .quote – Get a friendly motivational or funny quote ✨
• .riddle – Get a fun riddle 🧩 (try ".riddle answer" for the solution!)

🤖 Auto-Reply:
• .autoreply on – Enable friendly auto-replies 🤖✨
• .autoreply off – Disable auto-replies ❌
• .status – Show current bot status and active features ⚡

🚀 *Coming Soon*:
- Interactive quizzes & games
- Personalized commands
- Daily motivational quotes

_Type a command starting with "." to interact with me_
`;

        await sock.sendMessage(from, { text: menuMessage });
    }
};
