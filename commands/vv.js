// commands/vv.js
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "vv",
    description: "Send a view-once image (disappears after opening) 👁️",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || msg.key.participant || "User";

        try {
            // Path to test image
            const imagePath = path.join(__dirname, "..", "assets", "logo.jpg");

            if (!fs.existsSync(imagePath)) {
                await sock.sendMessage(from, { 
                    text: "❌ No image found. Please place `logo.jpg` inside the assets folder." 
                });
                return;
            }

            const buffer = fs.readFileSync(imagePath);

            // Send as view-once
            await sock.sendMessage(from, {
                image: buffer,
                caption: `👁️ View Once by JM-MD BOT\n⚡ Fast. Simple. Powerful ⚡\n\nRequested by: *${sender}*`,
                viewOnce: true
            });

        } catch (e) {
            console.error("❌ VV command error:", e);
            await sock.sendMessage(from, { text: "⚠️ Failed to send view-once image." });
        }
    }
};
