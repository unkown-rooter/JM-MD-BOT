// commands/menu.js
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "menu",
    description: "Shows the JM-MD-BOT main menu with info and quotes",
    async execute(sock, msg) {
        try {
            const from = msg.key.remoteJid;
            const commandDir = path.join(__dirname);
            const commandFiles = fs.readdirSync(commandDir).filter(f => f.endsWith(".js"));
            const totalCommands = commandFiles.length;

            // assign emojis to make each command unique
            const emojiMap = {
                about: "ℹ️", advice: "💡", apk: "📦", autoreply: "🤖", autoview: "👁️",
                calculator: "🧮", clubmatches: "⚽", date: "📅", dictionary: "📖",
                download: "⬇️", fact: "📚", fbdownloader: "📘", group: "👥",
                info: "💻", joke: "😂", meme: "🖼️", news: "📰", owner: "👑",
                photo: "📸", ping: "📡", play: "🎶", quote: "✍️", reload: "♻️",
                reminder: "⏰", repo: "🗂️", restart: "🔁", riddle: "❓", save: "💾",
                shutdown: "🛑", song: "🎵", status: "📊", sticker: "🎨", time: "⏱️",
                update: "⬆️", vcf: "📇", videodl: "🎥", weather: "🌦️", welcome: "🙌",
                ytdown: "▶️", vv: "🎬", vvdis: "🕹️"
            };

            // categories grouping (for organization only)
            const categories = {
                "🧩 General Commands": [],
                "🎮 Fun & Games": [],
                "🧠 Info & Utility": [],
                "🎵 Media & Download": [],
                "⚙️ System & Owner Tools": []
            };

            commandFiles.forEach(cmd => {
                const name = cmd.replace(".js", "");
                const emoji = emojiMap[name] || "✨";

                if (["joke", "meme", "riddle", "fact", "quote"].includes(name)) {
                    categories["🎮 Fun & Games"].push(`${emoji} *${name}*`);
                } else if (["about", "info", "dictionary", "weather", "time", "date", "ping"].includes(name)) {
                    categories["🧠 Info & Utility"].push(`${emoji} *${name}*`);
                } else if (["photo", "song", "apk", "download", "videodl", "ytdown", "fbdownloader", "play"].includes(name)) {
                    categories["🎵 Media & Download"].push(`${emoji} *${name}*`);
                } else if (["owner", "update", "reload", "restart", "shutdown", "save", "repo", "status", "welcome", "reminder", "group"].includes(name)) {
                    categories["⚙️ System & Owner Tools"].push(`${emoji} *${name}*`);
                } else {
                    categories["🧩 General Commands"].push(`${emoji} *${name}*`);
                }
            });

            // random quote
            const quotes = [
                "“Discipline is the bridge between goals and accomplishment.” – Jim Rohn",
                "“Don’t watch the clock; do what it does. Keep going.” – Sam Levenson",
                "“A river cuts through rock not because of its power, but because of its persistence.” – Jim Watkins",
                "“Work hard in silence, let your success make the noise.” – Frank Ocean",
                "“Dream big. Start small. Act now.” – Robin Sharma"
            ];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

            // create vertical menu layout
            let categoryList = "\n────────────────────────────\n";
            for (const [title, cmds] of Object.entries(categories)) {
                categoryList += `\n${title}:\n`;
                categoryList += cmds.length ? cmds.map(c => ` ${c}`).join("\n") : "  None\n";
                categoryList += "\n";
            }
            categoryList += "────────────────────────────";

            // build final menu message
            const menuMessage = `
*┏━━━🔥 JM-MD-BOT 🔥━━━┓*
╭──────────────────────────
│ 👑 *Owner:* _*JAPANESEMONK*_
│ 💻 *GitHub:* https://github.com/unkown-rooter/JM-MD-BOT.git
│ 📊 *Total Commands:* ${totalCommands}
│ 🕒 *Uptime:* ${(process.uptime() / 60).toFixed(2)} mins
╰──────────────────────────
📜 *Quote of the Day:*
${randomQuote}
${categoryList}
💡 Type *.help <command>* to learn more
*┗━━━━━━━━━━━━━━━━━━━━━━┛*
`;

            await sock.sendMessage(from, { text: menuMessage });
            console.log(`✅ Menu sent successfully (${totalCommands} commands listed neatly)`);

        } catch (error) {
            console.error("❌ Error in menu.js:", error);
            await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Something went wrong loading the menu." });
        }
    },
};
