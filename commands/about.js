// commands/about.js
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "about",
    description: "About JM-MD BOT and features",
    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;

            // Load all commands dynamically (exclude about.js)
            const commandsPath = path.join(__dirname);
            const commandFiles = fs.readdirSync(commandsPath)
                .filter(file => file.endsWith(".js") && file !== "about.js");

            // Map commands with emojis
            const emojis = {
                fact: "🍯",
                joke: "😄",
                riddle: "🧩",
                quote: "✨",
                info: "🤖",
                owner: "👑",
                about: "📝",
                status: "📊",
                time: "⏰",
                date: "📅",
                autoreply: "🤖",
                autoview: "👀",
                download: "📥",
                ping: "🏓",
                save: "💾",
                fbdownloader: "📹",
                calculator: "🧮",
                reminder: "⏱️",
                sticker: "🏷️",
                ytdown: "🎵",
                weather: "🌤️",
                menu: "📜",
                dictionary: "🔤",
                news: "📰"
            };

            // Build numbered commands list
            let counter = 1;
            const commandsList = commandFiles
                .map(file => {
                    const command = require(path.join(commandsPath, file));
                    const emoji = emojis[command.name] || "⚡";
                    const line = `${counter}. ${emoji} .${command.name} – ${command.description}`;
                    counter++;
                    return line;
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
🌤️ Weather Updates
🔤 Dictionary Lookup
📰 Latest News
🎵 YouTube Downloader

🔮 *Coming Soon*
🎮 Quizzes & Games
💡 Motivational Quotes
⚙️ Personalized Commands & Media Tools

━━━━━━━━━━━━━━━━━━━━━━━
✨ *MOTTO:* Smooth, reliable, and fun – just like JM-MD BOT! ✨
`;

            await sock.sendMessage(from, { text: aboutMessage });
        } catch (error) {
            console.error("❌ Error in about.js:", error);
        }
    }
};
