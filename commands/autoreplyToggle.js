// commands/autoreplyToggle.js
// 🐾 JM-MD BOT – Autoreply Toggle Command
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../data/config.json");

module.exports = {
    name: "autoreply",
    description: "🐾 Turn auto-replies ON or OFF",
    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;

            // 🔹 Load current config or defaults
            let config = { autoreply: true, autoview: false };
            try {
                config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
            } catch (err) {
                console.log("⚠️ No config found, using defaults.");
            }

            // 🔹 If no argument provided, show current status
            if (!args || args.length === 0) {
                await sock.sendMessage(from, { 
                    text: `🐾 JM-MD BOT AutoReply Status:\nCurrent: ${config.autoreply ? "ON ✅" : "OFF ❌"}\n\nUse .autoreply on | off to change.` 
                });
                return;
            }

            const option = args[0].toLowerCase();

            if (option === "on") {
                config.autoreply = true;
                await sock.sendMessage(from, { text: "✅ Auto-reply is now ON, buddy! 🐾" });
            } else if (option === "off") {
                config.autoreply = false;
                await sock.sendMessage(from, { text: "❌ Auto-reply is now OFF, buddy! 🐾" });
            } else {
                await sock.sendMessage(from, { text: "⚠️ Invalid option! Use: .autoreply on | off 🐾" });
                return;
            }

            // 🔹 Save updated config safely
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            console.log(`🐾 Auto-reply updated: ${config.autoreply ? "ON ✅" : "OFF ❌"}`);

        } catch (err) {
            console.error("Error in autoreplyToggle.js:", err);
            const from = msg.key.remoteJid;
            await sock.sendMessage(from, { text: "⚠️ Oops! Something went wrong with .autoreply command 🐾" });
        }
    }
};
