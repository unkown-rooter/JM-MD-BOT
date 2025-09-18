// commands/menu.js
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "menu",
    description: "Displays all available commands",
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        // Path to logo
        const logoPath = path.join(__dirname, "../assets/imglogo.png");

        // Load all command files dynamically (excluding menu.js)
        const commandsPath = path.join(__dirname);
        const commandFiles = fs.readdirSync(commandsPath)
            .filter(file => file.endsWith(".js") && file !== "menu.js");

        // Preload all commands once
        const allCommands = [];
        for (const file of commandFiles) {
            try {
                const command = require(path.join(commandsPath, file));
                if (command?.name) allCommands.push(command);
            } catch (err) {
                console.error(`❌ Error loading ${file}:`, err);
            }
        }

        // Predefined categories
        const categories = {
            "Fun Commands 🎉": [],
            "Info Commands ℹ️": [],
            "Utility Commands ⚙️": [],
            "Media Commands 📹": [],
            "System Commands 🛠️": []
        };

        // Tech-themed emojis for each command
        const emojis = {
            fact: "⚡", joke: "💻", riddle: "🧩", quote: "📡", advice: "💡",
            dictionary: "📖", meme: "😂", weather: "🌦️", news: "📰",
            info: "📱", owner: "👑", about: "📝", status: "📊",
            time: "⏰", date: "📅", autoreply: "🤖", autoview: "👀",
            download: "📥", ping: "🏓", save: "💾", fbdownloader: "📹",
            calculator: "🧮", reminder: "⏱️", sticker: "🏷️", ytdown: "🎵",
            menu: "📜"
        };

        // Category lists
        const fun = ["fact", "joke", "riddle", "quote", "advice", "meme", "sticker"];
        const info = ["info", "owner", "about", "status", "time", "date", "dictionary", "weather", "news"];
        const utility = ["download", "ping", "menu", "autoreply", "autoview", "save", "calculator", "reminder"];
        const media = ["fbdownloader", "ytdown"];
        const system = ["autoview", "autoreply"];

        // Assign commands to categories
        for (const cmd of allCommands) {
            if (fun.includes(cmd.name)) categories["Fun Commands 🎉"].push(cmd);
            else if (info.includes(cmd.name)) categories["Info Commands ℹ️"].push(cmd);
            else if (utility.includes(cmd.name)) categories["Utility Commands ⚙️"].push(cmd);
            else if (media.includes(cmd.name)) categories["Media Commands 📹"].push(cmd);
            else if (system.includes(cmd.name)) categories["System Commands 🛠️"].push(cmd);
            else categories["Utility Commands ⚙️"].push(cmd); // fallback
        }

        // Build menu message
        let menuMessage = "╔══════════════════════╗\n";
        menuMessage += `║       *JM-MD BOT*       ║\n`;
        menuMessage += "║ Smooth, reliable & fun! ║\n";
        menuMessage += "╚══════════════════════╝\n\n";

        let counter = 1;

        for (const [cat, cmds] of Object.entries(categories)) {
            if (cmds.length === 0) continue;
            menuMessage += `*${cat}*\n`;
            for (const cmd of cmds) {
                const emoji = emojis[cmd.name] || "🔹";
                // Only tech emoji, no logo
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

        // Send actual logo image at the bottom
        if (fs.existsSync(logoPath)) {
            await sock.sendMessage(from, {
                image: { url: logoPath },
                caption: "🌟 Welcome to the ultimate JM-MD BOT experience! 🌟"
            });
        }
    }
};
