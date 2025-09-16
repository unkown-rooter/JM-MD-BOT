const fs = require("fs");
const path = require("path");

module.exports = {
    name: "autoview",
    description: "Toggle AutoView ON or OFF",
    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;

            // ✅ Load config.json
            const configPath = path.join(__dirname, "../data/config.json");
            const config = JSON.parse(fs.readFileSync(configPath));

            if (!args[0]) {
                await sock.sendMessage(from, { text: `❌ Please provide ON or OFF\nExample: .autoview on` });
                return;
            }

            const option = args[0].toLowerCase();
            if (option === "on") {
                config.autoview = true;
                fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
                await sock.sendMessage(from, { text: "✅ AutoView has been turned ON" });
            } else if (option === "off") {
                config.autoview = false;
                fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
                await sock.sendMessage(from, { text: "❌ AutoView has been turned OFF" });
            } else {
                await sock.sendMessage(from, { text: "❌ Invalid option! Use ON or OFF" });
            }

        } catch (err) {
            console.error("Autoview command error:", err);
            await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Something went wrong with the autoview command." });
        }
    }
};
