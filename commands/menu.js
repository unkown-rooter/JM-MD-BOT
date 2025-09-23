// commands/menu.js
const fs = require("fs");
const path = require("path");

// Track users waiting for command selection
const awaitingSelection = {};

module.exports = {
    name: "menu",
    description: "Displays all available commands and allows number selection",
    async execute(sock, msg, args, allCommandsGlobal) {
        const from = msg.key.remoteJid;
        const userId = msg.key.participant || from; // unique per user

        // Path to logo
        const logoPath = path.join(__dirname, "../assets/imglogo.png");

        // Load all command files dynamically (excluding menu.js)
        const commandsPath = path.join(__dirname);
        const commandFiles = fs.readdirSync(commandsPath)
            .filter(file => file.endsWith(".js") && file !== "menu.js");

        // Preload all commands
        const allCommands = [];
        for (const file of commandFiles) {
            try {
                const command = require(path.join(commandsPath, file));
                if (command?.name) allCommands.push(command);
            } catch (err) {
                console.error(`❌ Error loading ${file}:`, err);
            }
        }

        // Use global passed commands if provided (optional)
        const commandsList = allCommandsGlobal || allCommands;

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
        for (const cmd of commandsList) {
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

        menuMessage += "📌 Press the number to open a command\n\n";

        let counter = 1;
        const commandMap = {}; // Map numbers to command objects

        for (const [cat, cmds] of Object.entries(categories)) {
            if (cmds.length === 0) continue;
            menuMessage += `*${cat}*\n`;
            for (const cmd of cmds) {
                const emoji = emojis[cmd.name] || "🔹";
                menuMessage += `${counter}. ${emoji} .${cmd.name} – ${cmd.description}\n`;
                commandMap[counter] = cmd; // map number to command
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

        // Send logo image
        if (fs.existsSync(logoPath)) {
            await sock.sendMessage(from, {
                image: { url: logoPath },
                caption: "🌟 Welcome to the ultimate JM-MD BOT experience! 🌟"
            });
        }

        // Mark user as awaiting selection
        awaitingSelection[userId] = {
            commandMap
        };
    },

    // Function to handle number replies (call from your main message handler)
    handleReply: async (sock, msg) => {
        const from = msg.key.remoteJid;
        const userId = msg.key.participant || from;
        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
        if (!text) return;

        if (!awaitingSelection[userId]) return; // user not in menu selection

        const num = parseInt(text);
        if (isNaN(num)) return; // not a number

        const cmdObj = awaitingSelection[userId].commandMap[num];
        if (!cmdObj) return; // invalid number

        // Execute the command
        try {
            await cmdObj.execute(sock, msg, []);
        } catch (err) {
            console.error(`❌ Error executing command ${cmdObj.name}:`, err);
            await sock.sendMessage(from, { text: "❌ Failed to execute the selected command." });
        }

        // Clear user from awaiting selection
        delete awaitingSelection[userId];
    }
};
