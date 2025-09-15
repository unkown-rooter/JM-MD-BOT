// commands/menu.js
module.exports = {
    name: "menu",
    description: "Displays all available commands",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        const menuMessage = `
📜 *JM-MD BOT Command Menu* 📜

🎉 *Fun Commands*
- .fact – Get a friendly fun fact 🍯
- .joke – Laugh out loud 😄
- .riddle – Challenge your mind 🧩
- .quote – Motivational or funny quote ✨

ℹ️ *Info Commands*
- .info – Bot info 🤖
- .owner – Owner contact 👑
- .status – Bot status 📊
- .about – About the bot 📝
- .time – Current time ⏰
- .date – Current date 📅

⚙️ *Utility Commands*
- .download – Quick download guide 📥
- .ping – Check if bot is alive 🏓
- .menu – Show this menu 📜
- .autoreply – Enable auto-reply 🤖

✨ *Type any command with a dot prefix (.) to run it!*
🚀 *Our Motto: Smooth, reliable, and fun – just like JM-MD BOT!*
        `;

        await sock.sendMessage(from, { text: menuMessage });
    }
};
