// commands/menu.js
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "menu",
    description: "Displays all available commands",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        // Load all commands dynamically
        const commandFiles = fs.readdirSync(path.join(__dirname))
            .filter(file => file.endsWith(".js") && file !== "menu.js");

        // Predefined categories (you can add more if needed)
        const categories = {
            "Fun Commands 🎉": [],
            "Info Commands ℹ️": [],
            "Utility Commands ⚙️": []
        };

        // Assign emojis for each command
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

        // Default categorization
        const fun = ["fact", "joke", "riddle", "quote", "sticker"];
        const info = ["info", "owner", "about", "status", "time", "date"];
        const utility = ["download", "ping", "menu", "autoreply", "autoview", "save", "fbdownloader", "calculator", "reminder"];

        // Dynamically load commands and categorize
        for (const file of commandFiles) {
            const command = require(`./${file}`);
            if (fun.includes(command.name)) categories["Fun Commands 🎉"].push(command);
            else if (info.includes(command.name)) categories["Info Commands ℹ️"].push(command);
            else if (utility.includes(command.name)) categories["Utility Commands ⚙️"].push(command);
            else {
                // Any new commands not mapped go to Utility by default
                categories["Utility Commands ⚙️"].push(command);
            }
        }

        // Build menu message with numbering
        let menuMessage = `╭━━━〔 *🤖 JM-MD BOT MENU 🤖* 〕━━━╮\n\n`;
        let counter = 1;

        for (const [cat, cmds] of Object.entries(categories)) {
            if (cmds.length === 0) continue; // skip empty categories
            menuMessage += `*${cat}*\n`;
            for (const cmd of cmds) {
                const emoji = emojis[cmd.name] || "🔹"; // fallback emoji
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

        await sock.sendMessage(from, { text: menuMessage });
    }
};
