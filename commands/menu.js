// commands/menu.js
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "menu",
    description: "Displays all available commands",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        // ✅ Send the logo first
        const logoPath = path.join(__dirname, "../assets/imglogo.png");
        if (fs.existsSync(logoPath)) {
            await sock.sendMessage(from, { 
                image: { url: logoPath },
                caption: "╭━━━〔 *🤖 JM-MD BOT* 〕━━━╮\n🌟 Welcome to the ultimate bot experience! 🌟"
            });
        }

        // Load all commands dynamically
        const commandFiles = fs.readdirSync(path.join(__dirname))
            .filter(file => file.endsWith(".js") && file !== "menu.js");

        // Predefined categories
        const categories = {
            "Fun Commands 🎉": [],
            "Info Commands ℹ️": [],
            "Utility Commands ⚙️": []
        };

        // Emojis for each command
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
            sticker: "🏷️"
        };

        const fun = ["fact", "joke", "riddle", "quote", "sticker"];
        const info = ["info", "owner", "about", "status", "time", "date"];
        const utility = ["download", "ping", "menu", "autoreply", "autoview", "save", "fbdownloader", "calculator", "reminder"];

        for (const file of commandFiles) {
            const command = require(`./${file}`);
            if (fun.includes(command.name)) categories["Fun Commands 🎉"].push(command);
            else if (info.includes(command.name)) categories["Info Commands ℹ️"].push(command);
            else if (utility.includes(command.name)) categories["Utility Commands ⚙️"].push(command);
            else categories["Utility Commands ⚙️"].push(command);
        }

        // Build menu message
        let menuMessage = "╔══════════════════════╗\n";
        menuMessage += "║       *JM-MD BOT*     ║\n";
        menuMessage += "║  Smooth, reliable & fun!  ║\n";
        menuMessage += "╚══════════════════════╝\n\n";
        let counter = 1;

        for (const [cat, cmds] of Object.entries(categories)) {
            if (cmds.length === 0) continue;
            menuMessage += `*${cat}*\n`;
            for (const cmd of cmds) {
                const emoji = emojis[cmd.name] || "🔹";
                menuMessage += `${counter}. ${emoji} .${cmd.name} – ${cmd.description}\n`;
                counter++;
            }
            menuMessage += `\n`;
        }

        menuMessage += `
━━━━━━━━━━━━━━━━━━
🚀 *Our Motto:*
*Smooth, reliable, and fun – just like JM-MD BOT!* ✨
━━━━━━━━━━━━━━━━━━
💡 Total Commands: ${counter - 1}`;

        // Send menu text
        await sock.sendMessage(from, { text: menuMessage });
    }
};
