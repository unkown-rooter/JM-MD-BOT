// commands/about.js
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "about",
    description: "About JM-MD BOT and features",
    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;

            // Load commands dynamically
            const commandsPath = path.join(__dirname);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
            const commandsList = commandFiles
                .map(file => {
                    const command = require(`./${file}`);
                    return `⚡ .${command.name} – ${command.description}`;
                })
                .join("\n");

            const aboutMessage = `
🤖 *JM-MD BOT v1.0*
━━━━━━━━━━━━━━━━━━━━━━━
👑 *Owner:* JapaneseMonk
📱 *Prefix:* .

🌟 *Core Values*
🕒 24/7 Smart Assistance
⚡ Automation & Productivity
⚡ Fast, Reliable & Interactive
🎯 Professional & User-Friendly

🛠️ *Available Commands*
${commandsList}

🚀 *Features*
🧠 Fun Facts
😂 Jokes
📝 Quotes
🎲 Riddles
🤖 AutoReply
👀 AutoView Status
📥 Downloads

🔮 *Coming Soon*
🎮 Quizzes & Games
💡 Motivational Quotes
🎵 Media Tools (downloaders, converters)
⚙️ Personalized Commands

━━━━━━━━━━━━━━━━━━━━━━━
✨ Powered by JM-MD BOT — always learning, always growing! ✨
`;

            await sock.sendMessage(from, { text: aboutMessage });
        } catch (error) {
            console.log("Error in about.js:", error);
        }
    }
};
