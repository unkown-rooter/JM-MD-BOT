// autoview.js
const fs = require("fs");
const path = require("path");

// List of admin numbers allowed to toggle
const ADMINS = ["YOUR_PHONE_NUMBER@s.whatsapp.net"]; // Replace with your WhatsApp number

module.exports = {
    name: "autoview",
    description: "Toggle AutoView ON or OFF or check status",
    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;

            // Load config.json
            const configPath = path.join(__dirname, "../data/config.json");
            const config = JSON.parse(fs.readFileSync(configPath));

            // Check if sender is admin
            const isAdmin = ADMINS.includes(msg.key.participant || from);
            if (!isAdmin) {
                await sock.sendMessage(from, { text: "❌ You are not allowed to toggle AutoView." });
                return;
            }

            if (!args[0]) {
                await sock.sendMessage(from, { text: `❌ Please provide ON, OFF, or STATUS\nExample: .autoview on` });
                return;
            }

            const option = args[0].toLowerCase();

            if (option === "on") {
                config.autoview = true;
                fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
                await sock.sendMessage(from, { text: "✅👀 AutoView has been turned ON" });

                // Log the toggle
                fs.appendFileSync(path.join(__dirname, "../logs/autoview.log"),
                    `${new Date().toISOString()} - ${msg.pushName || from} turned ON AutoView\n`
                );

            } else if (option === "off") {
                config.autoview = false;
                fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
                await sock.sendMessage(from, { text: "❌💤 AutoView has been turned OFF" });

                // Log the toggle
                fs.appendFileSync(path.join(__dirname, "../logs/autoview.log"),
                    `${new Date().toISOString()} - ${msg.pushName || from} turned OFF AutoView\n`
                );

            } else if (option === "status") {
                const statusMsg = config.autoview ? "✅👀 AutoView is currently ON" : "❌💤 AutoView is currently OFF";
                await sock.sendMessage(from, { text: statusMsg });

            } else {
                await sock.sendMessage(from, { text: "❌ Invalid option! Use ON, OFF, or STATUS" });
            }

        } catch (err) {
            console.error("Autoview command error:", err);
            await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Something went wrong with the autoview command." });
        }
    }
};
